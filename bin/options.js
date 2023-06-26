import fs from "node:fs";
import path from "node:path";


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

Object.freeze(defaultOptions);


export default async function calculateOptions() {
  const pathToConfigFile = 'config.json';
  const fullPathToConfig = path.resolve(pathToConfigFile);

  try {
    const data = await fs.promises.readFile(fullPathToConfig);
    const parsedData = JSON.parse(data);
    return { ...defaultOptions, ...parsedData };
  } catch (err) {
    return defaultOptions;
  }
}
