  # StreamDiscovery
  StreamDiscovery is an automated browser tool meant to crowdsource an answer to the question "Who's streaming right now?"
  
  ## Getting started
  ### About your data
  StreamDiscovery asks you to log into your accounts, then uses your accounts to find information about livestreams. The data that it gathers is saved to a file, `livestreams.json`. As a precautionary measure, StreamDiscovery does not send this data anywhere by default.
  
  StreamDiscovery can also be configured to send data to a StreamSource server, as part of the Streamwall suite of tools. For transparency, all transmitted data is logged and shown in the app.
  
  
  
   
  
  ### Installation
  
  ### Upgrading
  
  ### Crowdsource Configuration
  Configure StreamDiscovery to share data with a centralized server
  
  #### Server settings
  ##### URL
  ##### Token
  
  ### Platform Configuration
  
  #### DLive.tv
  TODO
  
  #### Facebook
  
  ##### Authorization
  
  ##### Settings
  
  #### Instagram
  
  ##### Authorization
  
  ##### Settings
  
  #### Periscope.tv
  
  ##### Authorization
  
  ##### Settings
  
  #### Twitch.tv
  
  ##### Authorization
  
  ##### Settings
  
  #### YouTube
  
  ##### Authorization
  
  ##### Settings
  
  ### Running StreamDiscovery
  
  #### Check for streams
  
  ####
  
  ## Developers
  
  ### Prerequisites
  This is a Node / Electron app and should be buildable cross-platform.
  
  This stack depends on:
  - [Node.js](https://nodejs.dev/learn)
  - [Electron](https://www.electronjs.org/docs/tutorial/quick-start)
  - [Electron Forge](https://www.electronforge.io/)
  - [Puppeteer](https://developers.google.com/web/tools/puppeteer/get-started)
  - [Cheerio.js](https://cheerio.js.org/)
  
  ### Building from source
  
  #### Build and run locally
  ```
  npm start
  ```
  
  #### Compile to distributables
  [Electron Forge](https://www.electronforge.io/config/makers) provides the following command to build:
  ```
  npm run make
  ```