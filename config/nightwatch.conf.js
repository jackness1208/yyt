/* eslint node/no-extraneous-require: 0 */
/* eslint max-len: 0 */
const util = require('yyl-util');
const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
const print = require('yyl-print');
const fs = require('fs');
const path = require('path');

const iEnv = util.envParse(process.argv.splice(2).join(' '));

const PORT = iEnv.port || 7000;
const PRODUCT_PORT = PORT + 1;

let USER_CONFIG_PATH = path.join(iEnv.path, 'yyt.config.js');
let USER_CONFIG_PATH2 = path.join(iEnv.path, 'config.js');

if (iEnv.config) {
  USER_CONFIG_PATH = path.resolve(iEnv.path, iEnv.config);
} else if (!fs.existsSync(USER_CONFIG_PATH) && fs.existsSync(USER_CONFIG_PATH2)) {
  USER_CONFIG_PATH = USER_CONFIG_PATH2;
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
        marionette: true
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
          args: [
            '--headless',
            '--disable-gpu'
          ]
        }
      }
    },

    globals: {
      productListUrl: `http://localhost:${PRODUCT_PORT}/productlist.html`
    }
  }
};

let nwConfig = {};

if (!fs.existsSync(USER_CONFIG_PATH)) {
  print.log.warn(`config is not exists: ${USER_CONFIG_PATH}, use default config`);
} else {
  let userConfig = {};
  try {
    userConfig = require(USER_CONFIG_PATH);
  } catch (er) {
    print.log.error(`config [${USER_CONFIG_PATH}]  parse fail:`, er);
  }
  if (typeof userConfig === 'object' && userConfig.nightwatch) {
    nwConfig = userConfig.nightwatch;
  }
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
  'html_report_folder'
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
if (config.html_report_folder) {
  if (!fs.existsSync(config.html_report_folder)) {
    print.log.warn(`config.html_report_folder [${config.html_report_folder}] is not exists, auto create it`);
    util.mkdirSync(config.html_report_folder);
  }
  global.html_report_folder = config.html_report_folder;
}

module.exports = config;