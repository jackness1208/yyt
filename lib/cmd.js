const pkg = require('../package.json');
const util = require('yyl-util');
const print = require('yyl-print');
const extOs = require('yyl-os');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, '../config');
const PROJECT_PATH = process.cwd();
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
      const logArr = await print.borderBox([
        'nightwatch cli',
        `yyt ${chalk.yellow.bold(pkg.version)}`
      ]);
      console.log(logArr.join('\n'));
    }
    return pkg.version;
  },
  async start() {
    const PKG_PATH = path.join(CONFIG_PATH, 'package.json');
    const pkgJson = {
      scripts: {
        start: `nightwatch --path ${PROJECT_PATH}`
      }
    };
    fs.writeFileSync(PKG_PATH, JSON.stringify(pkgJson, null, 2));

    await extOs.runSpawn('npm run start', CONFIG_PATH);
  }
};


module.exports = cmd;
