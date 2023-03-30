import fs from "node:fs";
import logger from './services/Logger.js';

const defaultOptions = {
  /**
   * Port that the webserver runs on.
   */
  webServerPort: 1212,
  /**
   * If this is set to true it will connect to the `compServerPort`.
   * And cache a HTML5 build of the game if `allowFirstBuild` is true to speed up subsequent builds.
   */
  compServerMode: true,
  /**
   * Builds the game for HTML5 before running the webserver.
   * Used for caching purposes so only works if `compServerMode` is true.
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

Object.freeze(defaultOptions);

let options = defaultOptions;
const pathToConfigFile = 'config.js';

fs.access(pathToConfigFile, fs.constants.F_OK, (err) => {
  if (err) {
    return;
  }
  fs.readFile(pathToConfigFile, 'utf8', (err, data) => {
    if (err) {
      logger.error("There's an issue with your configuration file.");
      return;
    }
    options = { ...defaultOptions, ...data };
  });
});

export default options;
