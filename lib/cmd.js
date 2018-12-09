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
    const NW_BIN_PATH_01 = path.join(__dirname, `../node_modules/.bin/nightwatch${EXT}`);
    const NW_BIN_PATH_02 = path.join(__dirname, `../../node_modules/.bin/nightwatch${EXT}`);

    let nwBin = '';

    if (fs.existsSync(NW_BIN_PATH_01)) {
      nwBin = NW_BIN_PATH_01;
    } else if (fs.existsSync(NW_BIN_PATH_02)) {
      nwBin = NW_BIN_PATH_02;
    }

    if (!nwBin) {
      throw `${NW_BIN_PATH_01} is not exists`;
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
