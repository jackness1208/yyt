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
    let iCmds = cmds.filter((str) => str !== 'yyt');
    let cmd = '';

    // 有句柄
    if (!isPath(iCmds[0])) {
      cmd = iCmds[0];
      iCmds.splice(0, 1);
    }

    // config 转换
    if (env.config) {
      env.extConfig = env.config;
      delete env.config;
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
                env.extConfig = yConfig;
                return false;
              } else { // 是 src_floders
                env.extBasePath = PROJECT_PATH;
                return true;
              }
            } else if (fPath.match(/yyt\.config\.?\w*\.js$/)) { // must be config file
              env.extConfig = fPath;
            } else { // 是 src_floders
              env.extBasePath = PROJECT_PATH;
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
          env.extConfig = yConfig;
        } else {
          env.help = true;
        }
      }
    }

    switch (cmd) {
      case 'init':
        return await ctrl.init(env);

      case 'check':
        return await ctrl.check(env);

      case '':
        if (env.help || shortEnv.h) {
          return await ctrl.help(env);
        } else if (env.version || shortEnv.v) {
          return await ctrl.version(env);
        } else if (shortEnv.p) {
          return await ctrl.path(env);
        } else {
          return await ctrl.start({ env, shortEnv, cmds: iCmds });
        }

      default:
        return await ctrl.help(env);
    }
  }
};

module.exports = entry;
