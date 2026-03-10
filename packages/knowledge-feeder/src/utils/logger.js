'use strict';

const chalk = require('chalk');

const logger = {
  info(msg) {
    console.log(chalk.cyan('ℹ'), chalk.white(msg));
  },
  success(msg) {
    console.log(chalk.green('✔'), chalk.greenBright(msg));
  },
  warn(msg) {
    console.log(chalk.yellow('⚠'), chalk.yellow(msg));
  },
  error(msg) {
    console.log(chalk.red('✖'), chalk.red(msg));
  },
  step(msg) {
    console.log(chalk.blue('→'), chalk.blueBright(msg));
  },
  dim(msg) {
    console.log(chalk.dim(msg));
  },
  header(msg) {
    console.log('');
    console.log(chalk.bold.magenta('━━━ ' + msg + ' ━━━'));
    console.log('');
  },
  // SSE-compatible: returns a formatted string for real-time streaming
  sseMessage(type, msg) {
    return JSON.stringify({ type, message: msg, timestamp: new Date().toISOString() });
  },
};

module.exports = logger;
