#!/usr/bin/env node

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import logger from './services/Logger.js';
import spinner from './services/Spinner.js';

import options from './options.js';

const execPromise = promisify(exec);

async function watcher() {
  await buildGameUsingCompServer();
  spinner.stop();
  if (options.displayNotification) displayNotification();
  logger.success(`[ϟ] ✅ Done!`);
}

async function buildGameUsingCompServer() {
  logger.log('🔨 Building game!!');
  spinner.start();

  try {
    const { stdout, stderr } = await execPromise(`lix lime build html5 -debug --connect ${options.compServerPort}`);

    if (stdout) {
      logger.log(stdout);
    }

    if (stderr) {
      logger.error(stderr);
      process.exit(1);
    }

  } catch (err) {
    logger.error(`buildGameUsingCompServer failed to run: ${err}`);
    process.exit(1);
  }
}

function displayNotification() {
  const isMac = process.platform === 'darwin';

  if (!isMac) throw Error('This only works on MacOS');

  const cmd = `osascript -e 'display notification "✅ Build finished!!!" with title "HaxeFlixel"'`;
  exec(cmd, (err, _stdout, stderr) => {

    if (err ?? stderr) {
      const error = err ?? stderr;
      logger.error(`displayNotification failed to run: ${error}`);
      process.exit(1);
    }
  });
}

watcher();
