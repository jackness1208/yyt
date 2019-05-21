module.exports = {
  'simple test': function (client) {
    client
      .url('http:/www.yy.com')
      .end();
  }
};