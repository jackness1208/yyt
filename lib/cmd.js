const pkg = require('../package.json');
const util = require('yyl-util');
const print = require('yyl-print');
const chalk = require('chalk');
const cmd = {
  help(iEnv) {
    const h = {
      usage: 'yyt',
      commands: {
      },
      options: {
        '-h, --help': 'print usage information',
        '-v, --version': 'print version'
      }
    };
    if (!iEnv.silent) {
      util.help(h);
    }
    return Promise.resolve(h);
  },
  async version(iEnv) {
    if (!iEnv.silent) {
      const logArr = await print.borderBox(['nightwatch cli', `yyt ${chalk.yellow.bold(pkg.version)}`]);
      console.log(logArr.join('\n'));
    }
    return pkg.version;
  },
  start() {

  }
};

module.exports = cmd;
