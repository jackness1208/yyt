module.exports = {
  'simple test': function (client) {
    client
      .checkUrlError('http:/www.yy.com')
      .end();
  }
};