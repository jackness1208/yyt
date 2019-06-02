const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
module.exports = {
  src_folders: ['test'],
  output_folder: false,
  custom_commands_path: [],
  custom_assertions_path: [],
  page_objects_path : '',
  request_timeout_options: {
    timeout: 30000,
    retry_attempts: 5
  },
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    log_path: false,
    port: 9515,
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
      'webdriver.gecko.driver' : '',
      'webdriver.edge.driver' : ''
    }
  },
  test_settings: {
    default: {
      selenium_port: 9515,
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
          args: [
          ]
        }
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
    }
  }
};
