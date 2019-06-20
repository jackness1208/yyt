const yyt = require('../index');

yyt.run({ cmds: ['doctor'], env: {}, shortEnv: {}}).then((r) => {
  console.log(r)
});