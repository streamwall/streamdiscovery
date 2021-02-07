#!/usr/bin/env node
const dotenv = require('dotenv')
dotenv.config()

const _ = require('lodash')
const fs = require('fs')
const { DateTime } = require("luxon");
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const Discord = require('discord.js')
const fetch = require('node-fetch')
const {Client} = require('./lib/streamsource/client.js')
const {Location} = require('./src/node/locations')

const iPhoneX = devices.devicesMap['iPhone X']
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
const TWITCH_OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID
const STREAMSOURCE_TOKEN = process.env.STREAMSOURCE_TOKEN
const UPDATE_INTERVAL = 240000
const FACEBOOK_NOTIFICATIONS_URL = 'https://m.facebook.com/notifications'
const BOT_NAME = "SPN Stream Finder Bot"

const ignorePatterns = [] // Get from config

const streamsource = new Client(STREAMSOURCE_TOKEN)

const discordClient = new Discord.Client()
let discordChannel

async function submitLink(message) {
  discordChannel.send(message)
}

async function update() {
  console.group(`[${DateTime.local().toString()}] Running...`)

  console.group('Fetching streams...')
  const liveStreams = await streamsource.getStreamsData({
    isExpired: false,
  })
  console.log(`${liveStreams.length} currently active streams`)
  console.groupEnd()

  console.group('Fetching known Twitch Streamers')
  const twitchStreams = await streamsource.getStreamsData({
    isExpired: true,
    platform: 'Twitch'
  })

  const twitchStreamerNames = new Set()
  twitchStreams.forEach(stream => {
    const channelName = stream.source.toLowerCase().trim()
    if(!channelName) {
      return
    }
    twitchStreamerNames.add(channelName)
  })
  const twitchChannels = [...twitchStreamerNames]
  console.log(`${twitchChannels.length} known Twitch channels`)
  console.groupEnd()

  const browser = await puppeteer.launch({
    userDataDir: './notifications-tmp/',
    ignoreHTTPSErrors: true,
    headless: false,
    args: [
      "--window-position=0,500",
      "--window-size=320,480",
    ]
  })

  console.group("Loading Facebook...")
  let fbMessages = []
  try {
    fbMessages = await parseFacebookNotifications(browser)
    console.log(`Found ${fbMessages.length} messages`)
  } catch (e) {
    console.error(e)
  }
  console.groupEnd()

  console.group("Loading Instagram...")
  let instaMessages = []
  try {
    instaMessages = await parseInstagramNotifications(browser)
    console.log(`Found ${instaMessages.length} messages`)
  } catch (e) {
    console.error(e)
  }
  console.groupEnd()

  console.group("Loading Twitch...")
  let twitchMessages = []
  try {
    twitchMessages = await parseTwitchNotifications(twitchChannels)
    console.log(`Found ${twitchMessages.length} messages`)
  } catch(e) {
    console.error(e)
  }
  console.groupEnd()

  await browser.close()

  console.log('Sending Messages...')
  const allMessages = fbMessages.concat(instaMessages).concat(twitchMessages)

  const dedupedMessages = allMessages.reduce((acc, current) => {
    const x = acc.find(item => item.url === current.url);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  for (const message of dedupedMessages) {
    const locationElements = [message.city, message.region]
    const locationString = locationElements.filter(e => e && e.length > 0).join(', ')
    const location = locationString ? `[${locationString}] ` : ''
    const messageText = `${location}${message.source} - ${message.url}`
    if(ignorePatterns.some(p => p.test(message.url))) {
      console.log(`- [SKIPPED] In ignored patterns: ${messageText}`)
      continue;
    }
    if(liveStreams.some((stream, i) => stream.link === message.url)) {
      console.log(`- [SKIPPED] Link already in livesheet: ${messageText}`)
      continue;
    }
    console.log(`+ [NEW] ${messageText}`)
    try {
      const { status } = await streamsource.createStream({
        link: message.url,
        city: message.city || '',
        region: message.region || '',
        source: message.source || '',
        postedBy: BOT_NAME,
        platform: message.platform || '',
        status: 'Live',
      })
      if(status === 201) {
        await submitLink(messageText)
      }
    } catch(err) {
      console.log("Couldn't submit directly to StreamSource", err)
    }
  }
  console.log('Done.')
  console.groupEnd()
}

async function tryUpdate() {
  try {
    await update()
  } catch(e) {
    console.log("Couldn't update!: ", e)
  }
}

async function main() {
  discordClient.on('ready', () => {
    console.log("Connecting to discord channel")
    discordChannel = discordClient.channels.cache.get(DISCORD_CHANNEL_ID);
    if (!discordChannel) {
      console.log("Can't fetch discord channel")
      return
    }
    tryUpdate()
    setInterval(tryUpdate, UPDATE_INTERVAL)
  })

  console.log("Logging into Discord...")
  await discordClient.login(DISCORD_TOKEN)
  console.log("Done loading")
}

