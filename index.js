const cmd = require('./lib/cmd.js');

const entry = {
  run: async (ctx, iEnv) => {
    switch (ctx) {
      case '-v':
      case '--version':
        await cmd.version(iEnv);
        break;

      case '-h':
      case '--help':
        await cmd.help(iEnv);
        break;

      default:
        await cmd.start(iEnv);
        break;
    }
  }
};

module.exports = entry;
