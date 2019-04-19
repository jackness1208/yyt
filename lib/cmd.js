const pkg = require('../package.json');
const util = require('yyl-util');
const print = require('yyl-print');
const extOs = require('yyl-os');
const extFs = require('yyl-fs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const NIGHTWATCH_VERSION = require('nightwatch/package.json').version;

const CONFIG_PATH = path.join(__dirname, '../config');
const IS_WINDOWS = process.platform == 'win32';

const fn = {
  printHeader(iEnv) {
    if (!iEnv.silent) {
      print.log.ver(`yyt ${chalk.yellow.bold(pkg.version)}`);
      print.log.success(`${chalk.green.bold('nightwatch')} ${chalk.yellow.bold(NIGHTWATCH_VERSION)}`);
    }
  }
};

print.log.init({
  type: {
    ver: {
      name: 'YYT>',
      color: 'white',
      bgColor: 'bgBlue'
    }
  }
});

const cmd = {
  async check(iEnv) {
    const she = this;
    print.log.info('starting yyt test demo');
    iEnv.path = path.join(__dirname, '../test/test-case/case-base');
    return await she.start(iEnv);
  },
  path(iEnv) {
    const r = path.join(__dirname, '../');
    if (!iEnv.silent) {
      print.log.info(`yyt path: ${chalk.yellow.bold(r)}`);
      extOs.openPath(r);
    }
    return Promise.resolve(r);
  },
  help(iEnv) {
    const h = {
      usage: 'yyt',
      commands: {
        'init': 'init yyt config',
        'check': 'check usage'
      },
      options: {
        '-h, --help': 'print usage information',
        '-v, --version': 'print version',
        '-p': 'show yyt path',
        '--headless': 'run chrome headless mode',
        '--proxy': 'set proxy server port'
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
    const PROJECT_PATH = process.cwd();
    fn.printHeader(iEnv);

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
  },
  async init(iEnv) {
    const PROJECT_PATH = process.cwd();

    fn.printHeader(iEnv);

    const configPath = path.join(PROJECT_PATH, 'yyt.config.js');
    const initPath = path.join(__dirname, '../init');
    if (fs.existsSync(configPath)) {
      throw `yyt init run fail, ${chalk.yelow('yyt.config.js')} is exists`;
    } else {
      const data = await extFs.copyFiles(initPath, PROJECT_PATH);
      if (!iEnv.silent) {
        print.log.success(`yyt init finished. ${chalk.green('A')} ${chalk.yellow.bold(data.add.length)}  ${chalk.cyan('U')} ${chalk.yellow.bold(data.update.length)}`);
      }
      return data;
    }
  }
};


module.exports = cmd;
