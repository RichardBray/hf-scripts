#!/usr/bin/env node

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import logger from './utils/Logger.js';
import spinner from './utils/Spinner.js';
import calculateOptions from './options.js';

const execPromise = promisify(exec);
const options = await calculateOptions();

async function watcher() {
  spinner.start();
  await buildGame();
  spinner.stop();
  if (options.displayNotification) displayNotification();
  logger.success(`[ϟ] ✅ Done!`);
}

async function buildGame() {
  const baseCmd = 'npx lix lime build html5 -debug'
  const buildCmd = (options.useCompServer) ? `${baseCmd} --connect ${options.compServerPort}` : baseCmd;

  logger.log('🔨 Building game!!');

  try {
    const { stdout, stderr } = await execPromise(buildCmd);

    if (stdout) {
      logger.log(stdout);
    }

    if (stderr) {
      logger.error(stderr);
      process.exit(1);
    }

  } catch (err) {
    logger.error(`buildGame failed to run: ${err}`);
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
