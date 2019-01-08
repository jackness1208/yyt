module.exports = {
  // '@disable': true,
  'hello-world-test': function (client) {
    return client
      .checkPageError('http://www.yy.com')
      .end();
  }
};
