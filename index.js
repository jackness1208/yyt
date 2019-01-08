const cmd = require('./lib/cmd.js');

const entry = {
  run: async (ctx, iEnv) => {
    if (!iEnv) {
      iEnv = {};
    }

    switch (ctx) {
      case '-v':
      case '--version':
        return await cmd.version(iEnv);

      case '-h':
      case '--help':
        return await cmd.help(iEnv);

      case 'init':
        return cmd.init(iEnv);

      default:
        return cmd.start(ctx, iEnv);
    }
  }
};

module.exports = entry;
