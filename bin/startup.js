#!/usr/bin/env node

import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';

import logger from './services/Logger.js';
import spinner from './services/Spinner.js';
import options from './options.js';

const execPromise = promisify(exec);

export default async function startup() {
  const skipFirstBuildFlag = process.argv[2] === '--skip' || process.argv[2] === '-s';
  const allowFirstBuild = skipFirstBuildFlag ? !skipFirstBuildFlag : options.allowFirstBuild;

  renderTitle();

  if (options.compServerMode) logger.warn(`⚠️ \s Please make sure you have the comp server running on port ${options.compServerPort}\n`)
  if (allowFirstBuild && options.compServerMode) await buildGameForWeb();

  startConcurrently();
}

function renderTitle() {
  logger.log('HaxeFlixel Template v.0.4.0\n');
}

async function buildGameForWeb() {
  logger.log('🔨 Caching HTML5 build of game');
  spinner.start();

  try {
    const { stderr } = await execPromise(`lix lime build html5 -debug --connect ${options.compServerPort}`);

    spinner.stop();
    logger.success(`✅ Done!`);

    if (stderr) {
      logger.error(stderr);
      process.exit(1);
    }
  } catch (err) {
    logger.error(`buildGameForWeb failed to run: ${err}`);
    process.exit(1);
  }
}

function startConcurrently() {
  const logMsg = options.compServerMode
    ? '[ϟ] Starting file watcher and web server'
    : '[ϟ] Starting file watcher, web and compilation server';

  logger.log(logMsg);

  const watchCmd = "chokidar 'src/**/*.hx' -c 'node bin/watcher.js'";
  const serverCmd = `http-server export/html5/bin --port ${options.webServerPort} -c0`;
  const compServerCmd = `haxe -v --wait ${options.compServerPort}`;

  const args = ['concurrently', '--hide', '1,2', '--names', 'ϟ', watchCmd, serverCmd, compServerCmd];

  if (options.compServerNewTab) args.pop();

  const child = spawn('npx', args, { stdio: ['pipe', 'inherit', 'pipe'] });

  child.stderr.on('data', (data) => {
    logger.warn(`child stderr: ${data}`);
  });

  child.on('error', (err) => {
    logger.error(`startConcurrently failed to run: ${err}`);
    process.exit(1);
  });

  logger.info(
    `\nYour game is running on http://localhost:${options.webServerPort}\nTo shut it down press <CTRL> + C at any time.\n`
  );
}
