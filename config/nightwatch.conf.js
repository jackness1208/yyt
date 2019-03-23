/* eslint node/no-extraneous-require: 0 */
/* eslint max-len: 0 */
const util = require('yyl-util');
const print = require('yyl-print');
const extOs = require('yyl-os');
const chalk = require('chalk');
const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
const fs = require('fs');
const path = require('path');

const iEnv = util.envParse(process.argv.splice(2).join(' '));

const PORT = iEnv.port || 7000;
const PRODUCT_PORT = PORT + 1;

let USER_CONFIG_PATH = path.join(iEnv.path, 'yyt.config.js');

if (iEnv.extConfig) {
  USER_CONFIG_PATH = path.resolve(iEnv.path, iEnv.extConfig);
  iEnv.path = path.dirname(USER_CONFIG_PATH);
}

const HELPER_PATH_01 = path.join(__dirname, '../node_modules/nightwatch-helpers');
const HELPER_PATH_02 = path.join(__dirname, '../../node_modules/nightwatch-helpers');

let helperPath = '';

const commandsPaths = [];
const assertionsPaths = [];

if (fs.existsSync(HELPER_PATH_01)) {
  helperPath = HELPER_PATH_01;
} else if (fs.existsSync(HELPER_PATH_02)) {
  helperPath = HELPER_PATH_02;
}

if (helperPath) {
  commandsPaths.push(path.join(helperPath, 'commands'));
  assertionsPaths.push(path.join(helperPath, 'assertions'));
}


const DEFAULT_CONFIG = {
  src_folders: ['test'],
  output_folder: false,
  custom_commands_path: commandsPaths,
  custom_assertions_path: assertionsPaths,
  page_objects_path : '',
  globals_path : path.join(__dirname, 'globals.js'),
  request_timeout_options: {
    timeout: 30000,
    retry_attempts: 5
  },
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    log_path: false,
    port: PORT,
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
      'webdriver.gecko.driver' : '',
      'webdriver.edge.driver' : ''
    }
  },
  test_settings: {
    default: {
      selenium_port: PORT,
      selenium_host: 'localhost',
      screenshots: {
        enabled: false,
        path: ''
      },
      silent: true,
      desiredCapabilities: {
        browserName: 'chrome',
        marionette: true,
        chromeOptions: {
          args: []
        }
      },
      globals: {
        productListUrl: `http://localhost:${PRODUCT_PORT}/productlist.html`
      }
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          args: []
        }
      }
    },

    globals: {
      productListUrl: `http://localhost:${PRODUCT_PORT}/productlist.html`
    }
  },
  __extend: {}
};

let nwConfig = {};

if (!fs.existsSync(USER_CONFIG_PATH)) {
  if (!iEnv.silent) {
    print.log.warn(`config is not exists: ${USER_CONFIG_PATH}, use default config`);
  }
} else {
  let userConfig = {};
  try {
    userConfig = require(USER_CONFIG_PATH);
  } catch (er) {
    print.log.error(`config [${USER_CONFIG_PATH}]  parse fail:`, er);
  }
  if (typeof userConfig === 'object' && userConfig) {
    if (iEnv.mode) {
      if (!userConfig[iEnv.mode]) {
        throw new Error(`config.${iEnv.mode} is not defined`);
      }
      if (!iEnv.silent) {
        print.log.success(`using ${chalk.yellow(`config.${iEnv.mode}`)} setting`);
      }
      nwConfig = userConfig[iEnv.mode];
    } else if (userConfig.default) {
      if (!iEnv.silent) {
        print.log.success(`using ${chalk.yellow('config.default')} setting`);
      }
      nwConfig = userConfig.default;
    } else {
      if (!iEnv.silent) {
        print.log.success(`using ${chalk.yellow('config')} setting`);
      }
      nwConfig = userConfig;
    }
  }
}

if (iEnv.proxy) {
  nwConfig.__extend.proxy = iEnv.proxy;
}

if (iEnv.headless) {
  nwConfig.__extend.headless = iEnv.headless;
}

// 合并 config a + b = a
const configArrMerrage = function (a, b, key) {
  let arr = [];
  if (util.type(b[key]) === 'array') {
    arr = b[key];
  } else if (util.type(b[key]) === 'string') {
    arr = [b[key]];
  }
  a[key] = a[key].concat(arr);
  delete b[key];
  return a;
};

// 合并 config
if (nwConfig.custom_commands_path) {
  configArrMerrage(DEFAULT_CONFIG, nwConfig, 'custom_commands_path');
}

if (nwConfig.custom_assertions_path) {
  configArrMerrage(DEFAULT_CONFIG, nwConfig, 'custom_assertions_path');
}

const config = util.extend(true, DEFAULT_CONFIG, nwConfig);

// 路径纠正
config.src_folders = config.src_folders.map((iPath) => path.resolve(iEnv.path, iPath));
config.custom_commands_path = config.custom_commands_path.map((iPath) => path.resolve(iEnv.path, iPath));
config.custom_assertions_path = config.custom_assertions_path.map((iPath) => path.resolve(iEnv.path, iPath));

const PATH_ATTRS = [
  'output_folder',
  'selenium.log_path',
  'page_objects_path',
  'globals_path',
  'test_settings.screenshots.path',
  '__extend.html_report_folder'
];
PATH_ATTRS.forEach((ctx) => {
  const deep = ctx.split('.');
  let handle = config;
  let ctrl = null;
  let lastKey = null;
  deep.forEach((key, i) => {
    if (i === deep.length - 1) {
      ctrl = handle;
      lastKey = key;
    }
    if (handle) {
      handle = handle[key];
    }
  });
  if (handle && ctrl && lastKey) {
    ctrl[lastKey] = path.resolve(iEnv.path, handle);
  }
});

// html report 配置
if (config.__extend.html_report_folder) {
  if (!fs.existsSync(config.__extend.html_report_folder)) {
    if (!iEnv.silent) {
      print.log.warn(`config.__extend.html_report_folder [${config.__extend.html_report_folder}] is not exists, auto create it`);
    }
    util.mkdirSync(config.__extend.html_report_folder);
  }
  global.html_report_folder = config.__extend.html_report_folder;
}

const defaultOpts = config.test_settings.default.desiredCapabilities.chromeOptions;
const chromeOpts = config.test_settings.chrome.desiredCapabilities.chromeOptions;

// headless
if (extOs.IS_LINUX) {
  config.__extend.headless = true;
}
if (typeof config.__extend.headless === 'boolean') {
  const HEADLESS_ARGS = [
    '--headless',
    '--disable-gpu',
    '--disable-extensions',
    '--no-sandbox',
    '--disable-dev-shm-usage'
  ];
  if (!iEnv.silent) {
    if (extOs.IS_LINUX) {
      print.log.success(`using headless in ${chalk.yellow('linux')}`);
    } else {
      print.log.success(`using headless ${chalk.yellow(`${config.__extend.headless}`)}`);
    }
  }
  [defaultOpts, chromeOpts].forEach((opt) => {
    if (typeof config.__extend.headless === 'boolean') {
      // headless
      if (config.__extend.headless) {
        HEADLESS_ARGS.forEach((attr) => {
          if (opt.args.indexOf(attr) === -1) {
            opt.args.push(attr);
          }
        });
      } else {
        HEADLESS_ARGS.forEach((attr) => {
          const index = opt.args.indexOf(attr);
          if (index !== -1) {
            opt.args.splice(index, 1);
          }
        });
      }
    }
  });
}

// proxy
if (config.__extend.proxy) {
  if (!iEnv.silent) {
    print.log.success(`using proxy ${chalk.yellow(`${extOs.LOCAL_IP}:${config.__extend.proxy}`)}`);
  }
  [defaultOpts, chromeOpts].forEach((opt) => {
    opt.args.push(`--proxy-server=http=${extOs.LOCAL_IP}:${config.__extend.proxy}`);
  });
}

if (!iEnv.silent) {
  config.src_folders.forEach((iPath) => {
    print.log.success(`src_folders  : ${chalk.yellow.bold(path.relative(iEnv.path, iPath))}`);
  });
  if (config.output_folder) {
    print.log.success(`output_folder: ${chalk.yellow.bold(path.relative(iEnv.path, config.output_folder))}`);
  }
}

module.exports = config;
