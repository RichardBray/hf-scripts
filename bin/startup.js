#!/usr/bin/env node

import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';

import logger from './services/Logger.js';
import spinner from './services/Spinner.js';
import { calculateOptions } from './options.js';

import pkgJson from '../package.json' assert {
  type: 'json'
};

const execPromise = promisify(exec);
const options = await calculateOptions();

export default async function startup() {
  const skipFirstBuildFlag = process.argv[2] === '--skip' || process.argv[2] === '-s';
  const allowFirstBuild = skipFirstBuildFlag ? !skipFirstBuildFlag : options.allowFirstBuild;

  renderTitle();

  if (options.useCompServer) logger.warn(`⚠️  Please make sure you have the comp server running on port ${options.compServerPort}\n`)
  if (allowFirstBuild && options.useCompServer) await buildGameForWeb();

  startConcurrently();
}

function renderTitle() {
  logger.log(`HaxeFlixel Scripts v${pkgJson.version}\n`);
}

async function buildGameForWeb() {
  logger.log('🔨 Caching HTML5 build of game');
  spinner.start();

  try {
    const { stderr } = await execPromise(`npx lix lime build html5 -debug --connect ${options.compServerPort}`);

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
  const logMsg = options.useCompServer
    ? '[ϟ] Starting file watcher, web and compilation server'
    : '[ϟ] Starting file watcher and web server';

  logger.log(logMsg);

  const watchCmd = "chokidar 'src/**/*.hx' -c 'node ./node_modules/hf-scripts/bin/watcher.js'";
  const serverCmd = `http-server export/html5/bin --port ${options.webServerPort} -c0`;
  const compServerCmd = `haxe -v --wait ${options.compServerPort}`;

  const args = ['concurrently', '--hide', '1,2', '--names', 'ϟ', watchCmd, serverCmd, compServerCmd];

  if (options.compServerNewTab) args.pop();

  const child = spawn('npx', args, { stdio: ['pipe', 'inherit', 'pipe'] });

  child.stderr.on('data', (data) => {
    logger.error(`child stderr: ${data}`);
  });

  child.on('error', (err) => {
    logger.error(`startConcurrently failed to run: ${err}`);
    process.exit(1);
  });

  logger.info(
    `\nYour game is running on http://localhost:${options.webServerPort}\nTo shut it down press <CTRL> + C at any time.\n`
  );
}

startup();
