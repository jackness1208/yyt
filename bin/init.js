#!/usr/bin/env node
const util = require('yyl-util');
const print = require('yyl-print');

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:\n', err.stack);
});

const ctrl = require('../index.js');
const { cmds, env, shortEnv } = util.cmdParse(process.argv);
ctrl.run({ cmds: cmds.slice(1), env, shortEnv }).catch((err) => {
  print.log.error(err);
  process.exit(1);
});
