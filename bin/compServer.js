#! /usr/bin/env node

import { spawn } from 'node:child_process';

import logger from './services/Logger.js';
import options from './options.js';

export default function startCompServer() {
  const command = spawn('haxe', ['-v', '--wait', options.compServerPort], { stdio: ['pipe', 'inherit', 'pipe'] });

  command.stderr.on('data', (data) => {
    logger.warn(`command stderr: ${data}`);
  });

  command.on('error', (err) => {
    logger.error(`startConcurrently failed to run: ${err}`);
    process.exit(1);
  });

  logger.info(
    `\n Compilation server is now running on port ${options.compServerPort}\n`
  );
}