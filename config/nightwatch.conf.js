
console.log(process.argv.splice(2))

const port = 4444;
const config = {
  'src_folders': ['test'],
  'output_folder': 'reports',
  // 'globals_path': 'test/e2e/global.js',
  'selenium': {
    'start_process': true,
    'server_path': require('selenium-server').path,
    'port': port,
    'cli_args': {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

  'test_settings': {
    'default': {
      'selenium_port': port,
      'selenium_host': 'localhost',
      'silent': true,
      'globals': {
        'productListUrl': 'http://localhost:' + 9003 + '/productlist.html'
      }
    },

    'chrome': {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'chromeOptions': {
          'args': [
            '--headless',
            '--disable-gpu'
          ],
          'binary': '/opt/google/chrome/google-chrome'
        }
      }
    },

    'globals': {
      'productListUrl': 'http://localhost:' + 9003 + '/productlist.html',
    }
  }
}

module.exports = config;
