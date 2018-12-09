const pkg = require('../package.json');
const util = require('yyl-util');
const print = require('yyl-print');
const extOs = require('yyl-os');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, '../config');
const PROJECT_PATH = process.cwd();
const IS_WINDOWS = process.platform == 'win32';

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
  async start(iEnv) {
    const EXT = IS_WINDOWS ? '.cmd': '';
    const NODE_MODULE_PATH_01 = path.join(__dirname, '../node_modules');
    const NODE_MODULE_PATH_02 = path.join(__dirname, '../../node_modules');
    let iPath = '';
    let nwBin = '';

    if (IS_WINDOWS) {
      iPath = `.bin/nightwatch${EXT}`;
    } else {
      iPath = 'nightwatch/bin/nightwatch';
    }
    const BIN_PATH_01 = path.join(NODE_MODULE_PATH_01, iPath);
    const BIN_PATH_02 = path.join(NODE_MODULE_PATH_02, iPath);

    if (fs.existsSync(BIN_PATH_01)) {
      nwBin = BIN_PATH_01;
    } else if (fs.existsSync(BIN_PATH_02)) {
      nwBin = BIN_PATH_02;
    }

    if (!nwBin) {
      throw `${BIN_PATH_01} is not exists`;
    }

    if (iEnv.path) {
      iEnv.path = path.resolve(PROJECT_PATH, iEnv.path);
    } else {
      iEnv.path = PROJECT_PATH;
    }

    await extOs.runSpawn(`${nwBin} ${util.envStringify(iEnv)}`, CONFIG_PATH);
  }
};


module.exports = cmd;
