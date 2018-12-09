/* eslint node/no-extraneous-require: 0 */
const util = require('yyl-util');
const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
const print = require('yyl-print');
const fs = require('fs');
const path = require('path');

const iEnv = util.envParse(process.argv.splice(2).join(' '));

const PORT = iEnv.port || 7000;
const PRODUCT_PORT = PORT + 1;

let USER_CONFIG_PATH = path.join(iEnv.path, 'config.js');

if (iEnv.config) {
  USER_CONFIG_PATH = path.resolve(iEnv.path, iEnv.config);
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
  output_folder: '_reports',
  custom_commands_path: commandsPaths,
  custom_assertions_path: assertionsPaths,

  page_objects_path : '',
  globals_path : '',
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
          ],
          binary: '/opt/google/chrome/google-chrome'
        }
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    },
    edge: {
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
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

const config = util.extend(true, DEFAULT_CONFIG, nwConfig);

// 路径纠正
config.src_folders = config.src_folders.map((iPath) => path.resolve(iEnv.path, iPath));
if (config.output_folder) {
  config.output_folder = path.resolve(iEnv.path, config.output_folder);
}

if (config.selenium && config.selenium.log_path) {
  config.selenium.log_path = path.resolve(iEnv.path, config.selenium.log_path);
}

module.exports = config;
