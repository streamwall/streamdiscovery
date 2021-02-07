import * as fs from 'fs'
import yargs from 'yargs'
import * as TOML from "@iarna/toml";

export default function parseArgs() {
  return yargs
    .config('config', (configPath) => {
      return TOML.parse(fs.readFileSync(configPath, 'utf-8'))
    })
    .group([
      'window.height',
      'window.width',
    ], 'Window Dimensions')
    .option('window.width', {
      number: true,
      default: 1920,
    })
    .option('window.height', {
      number: true,
      default: 1080,
    })
    .group([
      'streamsource.apiToken',
    ], 'Streamsource Settings')
    .option('streamsource.apiToken', {
      describe: `Streamsource is a centralized repository of live streams 
                 that Streamdiscovery can submit its results to. This
                 apiToken can be obtained by following the authentication
                 instructions for Streamsource here: https://github.com/streamwall/streamsource#api-reference`,
      default: null,
    })
    .group([
      'twitch.updateInterval',
      'twitch.clientId',
      'twitch.oauthToken',
    ], 'Twitch Settings')
    .option('twitch.updateInterval', {
      describe: `The number of minutes between checks for live Twitch streams`,
      number: true,
      default: 10,
    })
    .option('twitch.clientId', {
      describe: `Your Twitch clientId can be found by visiting https://twitchtokengenerator.com/`,
      default: null,
    })
    .option('twitch.oauthToken', {
      describe: `Your Twitch OAuth Token (or "Access Token") can be found by clicking the 
                 "Generate Token!" button on the big form on https://twitchtokengenerator.com/`,
      default: null,
    })
    .group([
      'dlive.updateInterval',
    ], 'DLive Settings')
    .option('dlive.updateInterval', {
      describe: `The number of minutes between checks for live DLive streams`,
      number: true,
      default: 10,
    })
    .group([
      'facebook.updateInterval',
    ], 'Facebook Settings')
    .option('facebook.updateInterval', {
      describe: `The number of minutes between checks for live Facebook streams`,
      number: true,
      default: 10,
    })
    .group([
      'instagram.updateInterval',
    ], 'Instagram Settings')
    .option('instagram.updateInterval', {
      describe: `The number of minutes between checks for live Instagram streams`,
      number: true,
      default: 10,
    })
    .group([
      'periscope.updateInterval',
    ], 'Periscope Settings')
    .option('periscope.updateInterval', {
      describe: `The number of minutes between checks for live Periscope streams`,
      number: true,
      default: 10,
    })
    .group([
      'youtube.updateInterval',
    ], 'YouTube Settings')
    .option('youtube.updateInterval', {
      describe: `The number of minutes between checks for live YouTube streams`,
      number: true,
      default: 10,
    })
    .group([
      'data.ignorePatterns',
    ], 'Data settings')
    .option('data.ignorePatterns', {
      describe: `A list of regular expressions that, if they 
                 match the URL of a live stream, will be ignored.`,
      array: true,
      default: [
        '^(?:www\.)?twitch\.tv\/p\/',
        '^(?:www\.)?.instagram\.com\/p\/',
        '^(?:www\.)?facebook\.com\/photo/',
        '^(?:www\.)?facebook\.com\/profile/',
        '^(?:www\.)?facebook\.com\/groups\/',
        'twitch\.tv\/subs\/',
        'twitch\.tv\/.*\/clip\/',
        'twitch\.tv\/.*\/v\/',
        'twitch\.tv\/videos\/',
      ],
    })
    .help().argv
}