# HF-Scripts
Scripts used in the unofficial HaxeFlixel template.

## Install

Then you can install the scripts on your relevant project
`npm i hf-scripts`

You need to make sure your project has the following dependencies installed before this will work:
- chokidar-cli
- concurrently
- http-server

The scripts file depends on the commands form these packages to work properly.

## Config file

You can create a configuration file to change a few things. Here are the default configuration settings for a project:

```js
const defaultOptions = {
  /**
   * Port that the webserver runs on.
   */
  webServerPort: 1212,
  /**
   * If this is set to true it will connect to the `compServerPort`.
   * And cache a HTML5 build of the game if `allowFirstBuild` is true to speed up subsequent builds.
   */
  useCompServer: true,
  /**
   * Builds the game for HTML5 before running the webserver.
   * Used for caching purposes so only works if `useCompServer` is true.
   */
  allowFirstBuild: true,
  /**
   * Port for compilation server
   */
  compServerPort: 8000,
  /**
   * Displays a notification in the OS when a build is complete.
   * Currently this only works on MacOS.
   */
  displayNotification: true,
};

```

## Support

If you've found this package useful and want to support me, you can [buy me a coffee](https://ko-fi.com/richardoliverbray).

If you to know more about me [check out my website](https://robray.dev/).