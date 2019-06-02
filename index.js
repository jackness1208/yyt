const ctrl = require('./lib/cmd.js');
const path = require('path');
const fs = require('fs');


const isPath = function(ctx) {
  if (typeof ctx === 'string') {
    const rPath = path.resolve(process.cwd(), ctx);
    if (fs.existsSync(rPath)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const entry = {
  run: async ({ cmds, env, shortEnv }) => {
    const PROJECT_PATH = process.cwd();
    let iCmds = cmds || [];
    const iEnv = env || {};
    const sEnv = shortEnv || {};

    let cmd = '';
    iCmds = iCmds.filter((str) => str !== 'yyt');

    // 有句柄
    if (!isPath(iCmds[0])) {
      cmd = iCmds[0] || '';
      iCmds.splice(0, 1);
    }

    // config 转换
    if (iEnv.config) {
      iEnv.extConfig = iEnv.config;
      delete iEnv.config;
    }

    // yyt xx.js xx/ 模式
    if (cmd === '' && iCmds.length) {
      if (iCmds.length) {
        // 这里的 cmds 里面装的都是 src_folders or yyt.config.js
        iCmds = iCmds.filter((ctx) => {
          if (isPath(ctx)) {
            const fPath = path.resolve(PROJECT_PATH, ctx);
            const iStat = fs.statSync(fPath);
            if (iStat.isDirectory()) { //
              const yConfig = path.join(fPath, 'yyt.config.js');
              if (fs.existsSync(yConfig)) {
                iEnv.extConfig = yConfig;
                return false;
              } else { // 是 src_floders
                iEnv.extBasePath = PROJECT_PATH;
                return true;
              }
            } else if (fPath.match(/yyt\.config\.?\w*\.js$/)) { // must be config file
              iEnv.extConfig = fPath;
            } else { // 是 src_floders
              iEnv.extBasePath = PROJECT_PATH;
              return true;
            }
            ctx = '';
          } else {
            throw `yyt run fail, path not exists: ${ctx}`;
          }
        });
      } else { // 检查当前目录下是否有 yyt.config.js
        const yConfig = path.join(PROJECT_PATH, 'yyt.config.js');
        if (fs.existsSync(yConfig)) {
          iEnv.extConfig = yConfig;
        } else {
          iEnv.help = true;
        }
      }
    }

    switch (cmd) {
      case 'init':
        return await ctrl.init({ env: iEnv, shortEnv: sEnv, cmds: iCmds });

      case 'check':
        return await ctrl.check({ env: iEnv, shortEnv: sEnv, cmds: iCmds });

      case 'doctor':
        return await ctrl.doctor({ env: iEnv, shortEnv: sEnv, cmds: iCmds });

      case 'nightwatch':
        return await ctrl.nightwatch({ env: iEnv, shortEnv: sEnv, cmds: iCmds });

      case 'chromedriver':
        return await ctrl.chromedriver({ env: iEnv, shortEnv: sEnv, cmds: iCmds });

      case '':
        if (iEnv.version || sEnv.v) {
          return await ctrl.version(iEnv);
        } else if (sEnv.p) {
          return await ctrl.path(iEnv);
        } else if (iEnv.help || sEnv.h) {
          return await ctrl.help(iEnv);
        } else {
          return await ctrl.start({
            env: iEnv,
            shortEnv: sEnv,
            cmds: iCmds
          });
        }

      default:
        return await ctrl.help({ cmds: iCmds, env: iEnv, shortEnv: sEnv });
    }
  }
};

module.exports = entry;
