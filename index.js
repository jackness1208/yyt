const cmd = require('./lib/cmd.js');

const entry = {
  run: async (ctx, iEnv) => {
    switch (ctx) {
      case '-v':
      case '--version':
        await cmd.version(iEnv);
        break;

      case 'start':
        await cmd.start(iEnv);
        break;

      case 'abort':
        await cmd.abort(iEnv);
        break;

      default:
        await cmd.help(iEnv);
        break;
    }
  }
};

module.exports = entry;
