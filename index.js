const cmd = require('./lib/cmd.js');
const path = require('path');
const fs = require('fs');

const IS_OPTION = /^[-]{1,2}\w/;
const IS_PATH = /^[.]{1,2}\//;

const entry = {
  run: async (ctx, iEnv) => {
    if (!iEnv) {
      iEnv = {};
    }

    if (!ctx) {
      ctx = '';
    }

    const PROJECT_PATH = process.cwd();

    if (ctx.match(IS_OPTION)) {
      switch (ctx) {
        case '-v':
        case '--version':
          iEnv.version = true;
          ctx = '';
          break;

        case '--config': // nightwatch 已有字段 换一个
          iEnv.extConfig = iEnv.config;
          delete iEnv.config;
          ctx = '';
          break;

        case '-h':
        case '--help':
          iEnv.help = true;
          ctx = '';
          break;


        case '-p':
          ctx = '-p';
          break;

        // nightwatch 固有属性
        case '--env':
        case '--output':
        case '--reporter':
        case '--verbose':
        case '--test':
        case '--testcase':
        case '--group':
        case '--skipgroup':
        case '--filter':
        case '--tag':
        case '--skiptags':
        case '--retries':
        case '--suiteRetries':

        // 自定义属性
        case '--headless':
        case '--proxy':
        case '--path':
        case '--mode':
          ctx = '';
          break;

        default:
          iEnv.help = true;
          ctx = '';
          break;
      }
    } else if (ctx.match(IS_PATH)) { // 考虑 路径
      const fPath = path.resolve(PROJECT_PATH, ctx);
      if (fs.existsSync(fPath)) {
        const iStat = fs.statSync(fPath);
        if (iStat.isDirectory()) { //
          iEnv.path = fPath;
        } else { // must be config file
          iEnv.extConfig = fPath;
        }
        ctx = '';
      } else {
        throw `yyt run fail, path not exists: ${fPath}`;
      }
    } else { // 考虑 路径
      const ifPath = path.resolve(PROJECT_PATH, ctx);

      if (fs.existsSync(ifPath)) {
        const iStat = fs.statSync(ifPath);
        if (iStat.isDirectory()) { //
          iEnv.path = ifPath;
        } else { // must be config file
          iEnv.extConfig = ifPath;
        }
        ctx = '';
      }
    }

    switch (ctx) {
      case 'init':
        return await cmd.init(iEnv);

      case 'check':
        return await cmd.check(iEnv);

      case '-p':
        return await cmd.path(iEnv);

      case '':
        if (iEnv.help) {
          return await cmd.help(iEnv);
        } else if (iEnv.version) {
          return await cmd.version(iEnv);
        } else {
          return await cmd.start(iEnv);
        }

      default:
        return await cmd.help(iEnv);
    }
  }
};

module.exports = entry;
