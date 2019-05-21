module.exports = {
  'simple test': function (client) {
    client
      .checkPageError('http:/www.yy.com')
      .end();
  }
};