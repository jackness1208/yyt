#!/usr/bin/env node
const util = require('yyl-util');
const print = require('yyl-print');
const iArgv = process.argv.splice(2);

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:\n', err.stack);
});

const cmd = require('../index.js');
const handle = iArgv[0];
const iEnv = util.envPrase(iArgv);
cmd.run(handle, iEnv).catch((err) => {
  print.log.error(err.message);
});
