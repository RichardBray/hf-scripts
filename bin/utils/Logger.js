// @ts-check
class Logger {
  static colors = {
    red: '\x1b[31m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    cyan: '\x1b[36m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
  };

  static error(message) {
    console.error(Logger.colors.red, message);
  }

  static warn(message) {
    console.warn(Logger.colors.yellow, message);
  }

  static info(message) {
    console.info(Logger.colors.cyan, message);
  }

  static success(message) {
    console.info(Logger.colors.green, message);
  }

  static log(message) {
    console.log(message);
  }
}

export default Logger;
