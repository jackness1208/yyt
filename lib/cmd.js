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
const ROOT_PATH = path.join(__dirname, '../');
const IS_WINDOWS = process.platform == 'win32';

const CHROME_DRIVER_MAP = {
  70: ['2.45.0'],
  71: ['2.45.0', '2.46.0'],
  72: ['2.45.0', '2.46.0'],
  73: ['2.45.0', '2.46.0', '73.0.0'],
  74: ['74.0.0']
};

const fn = {
  disMatchChromeDriver(chromeVer, driverVer) {
    if (!chromeVer) {
      return;
    }
    const mainVer = chromeVer.split('.').shift();

    const driverArr = CHROME_DRIVER_MAP[mainVer];
    if (!driverArr) {
      return;
    }
    if (driverArr.indexOf(driverVer) !== -1) {
      return;
    } else {
      return driverArr[driverArr.length - 1];
    }
  },
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
    },
    cmd: {
      name: 'CMD>',
      color: 'white',
      bgColor: 'bgBlack'
    }
  }
});

const cmd = {
  async check({ env }) {
    const she = this;
    if (!env.silent) {
      print.log.info('starting yyt test demo');
    }
    env.path = path.join(__dirname, '../test/test-case/case-base');
    return await she.start({ env, shortEnv: {}, cmds: [] });
  },
  path({ env }) {
    const r = path.join(__dirname, '../');
    if (!env.silent) {
      print.log.info(`yyt path: ${chalk.yellow.bold(r)}`);
      extOs.openPath(r);
    }
    return Promise.resolve(r);
  },
  async chromedriver({ env, cmds, shortEnv }) {
    const drPath = require('chromedriver').path;
    const cmd = `${drPath} ${cmds.join(' ')} ${util.envStringify(env)} ${util.shortEnvStringify(shortEnv)}`;
    print.log.cmd(cmd);
    return await extOs.runCMD(cmd, process.cwd());
  },
  help({ env }) {
    const h = {
      usage: 'yyt',
      commands: {
        'init': 'init yyt config',
        'check': 'check usage',
        'chromedriver': 'chromedriver handle',
        'nightwatch': 'nightwatch handle',
        'doctor': 'detect environment'
      },
      options: {
        '-h, --help': 'print usage information',
        '-v, --version': 'print version',
        '--mode': 'select test mode, config.default by default',
        '--platform': 'pc|mobile|android|ios',
        '-p': 'show yyt path',
        '--headless': 'run chrome headless mode',
        '--proxy': 'set proxy server port'
      }
    };
    if (!env.silent) {
      print.help(h);
    }
    return Promise.resolve(h);
  },
  async doctor({ env }) {
    // cli checking list
    const chromeVer = await extOs.getChromeVersion();
    const javaVer = await extOs.getJavaVersion();
    const chromeDriverVer = require('chromedriver/package.json').version;

    if (!env.silent) {
      const notFoundStr = chalk.red.bold('not found');
      const javaStr = javaVer ? chalk.green.bold(javaVer) : notFoundStr;
      let chromeStr = '';
      if (chromeVer) {
        const mainVer = chromeVer.split('.').shift();
        if (mainVer in CHROME_DRIVER_MAP) {
          chromeStr = chalk.green.bold(chromeVer);
        } else {
          const keys = Object.keys(CHROME_DRIVER_MAP).sort();
          const leastVer = keys[0];
          const latestVer = keys[keys.length - 1];
          chromeStr = `${chalk.red(chromeVer)} ${chalk.yellow(`(need ${leastVer} - ${latestVer})`)}`;
        }
      } else {
        chromeStr = notFoundStr;
      }

      let cdStr = '';
      const reinstallVer = fn.disMatchChromeDriver(chromeVer, chromeDriverVer);
      if (reinstallVer) {
        cdStr = `${chalk.yellow(chromeDriverVer)} (require ${chalk.yellow(reinstallVer)})`;
      } else {
        cdStr = chalk.green.bold(chromeDriverVer);
      }

      if (!env.silent) {
        print.log.ver(`yyt ${chalk.yellow.bold(pkg.version)}`);
        console.log([
          '',
          ` ${chalk.yellow.bold('nightwatch')} checking list:`,
          '',
          ` ${chalk.yellow('java        ')} : ${javaStr}`,
          ` ${chalk.yellow('chrome      ')} : ${chromeStr}`,
          ` ${chalk.yellow('chromedriver')} : ${cdStr}`,
          ''
        ].join('\n'));
      }

      if (reinstallVer) {
        print.log.warn(`chrome(${chromeVer}) require chromedriver(${reinstallVer}), auto fix it`);
        const cmd = `npm i chromedriver@${reinstallVer} --save --chromedriver-force-download`;
        if (!env.silent) {
          print.log.cmd(cmd);
        }
        await extOs.runCMD(cmd, ROOT_PATH);
      }
      const r = {
        java: javaVer,
        chrome: chromeVer,
        chromedriver: reinstallVer || chromeDriverVer
      };

      if (r.java && r.chrome && r.chromedriver) {
        if (!env.silent) {
          print.log.success('all is well, enjoy it');
        }
      }
      
      return r;
    }
  },
  async nightwatch({ cmds, env, shortEnv }) {
    const PROJECT_PATH = process.cwd();
    const iEnv = env;
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
    const handleStr = `${cmds.slice(1)} ${util.envStringify(env)} ${util.shortEnvStringify(shortEnv)}`;

    if (!env.silent) {
      print.log.cmd(`nightwatch ${handleStr}`);
    }
    return await extOs.runSpawn(`${nwBin} ${handleStr}`, PROJECT_PATH);
  },
  async version({ env }) {
    if (!env.silent) {
      const logArr = await print.borderBox([
        'nightwatch cli',
        `yyt ${chalk.yellow.bold(pkg.version)}`
      ]);
      console.log(logArr.join('\n'));
    }
    return pkg.version;
  },
  async start({ env, shortEnv, cmds }) {
    const PROJECT_PATH = process.cwd();
    const iEnv = env;
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

    // file paths
    const filePaths = cmds.map((iPath) => {
      return util.path.resolve(iEnv.extBasePath, iPath);
    });
    delete iEnv.extBasePath;
    if (filePaths.length) {
      iEnv.extSrcFolders = escape(JSON.stringify(filePaths));
    }

    const cmdCtx = `${util.envStringify(iEnv)} ${util.shortEnvStringify(shortEnv)}`;
    const cmd = `${nwBin} ${cmdCtx}`;

    let nEnv = Object.assign({}, iEnv);
    delete nEnv.path;
    nEnv = Object.assign(nEnv, process.env);
    // print.log.cmd(`nightwatch ${cmdCtx}`);
    await extOs.runSpawn(cmd, nEnv, CONFIG_PATH);
  },
  async init({ env }) {
    const PROJECT_PATH = process.cwd();

    fn.printHeader(env);

    const configPath = path.join(PROJECT_PATH, 'yyt.config.js');
    const initPath = path.join(__dirname, '../init');
    if (fs.existsSync(configPath)) {
      throw `yyt init run fail, ${chalk.yelow('yyt.config.js')} is exists`;
    } else {
      const data = await extFs.copyFiles(initPath, PROJECT_PATH);
      if (!env.silent) {
        print.log.success(`yyt init finished. ${chalk.green('A')} ${chalk.yellow.bold(data.add.length)}  ${chalk.cyan('U')} ${chalk.yellow.bold(data.update.length)}`);
      }
      return data;
    }
  }
};


module.exports = cmd;
