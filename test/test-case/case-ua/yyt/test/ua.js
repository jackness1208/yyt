/* eslint prefer-arrow-callback: 0 */
const config = require('../../yyt.config.js');
const UA_STR = config.default.__extend.userAgent;
module.exports = {
  // '@disable': true,
  'ua-test': function (client) {
    return client
      .url('http://www.yy.com/')
      .executeAsync(function(done) {
        done(window.navigator.userAgent);
      }, function (result) {
        this.verify.ok(result.value === UA_STR, `check userAgent: browser[${result.value}] === config[${UA_STR}]`);
      })
      .end();
  }
};
