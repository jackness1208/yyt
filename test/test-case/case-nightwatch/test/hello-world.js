module.exports = {
  'test hello world': function(client) {
    return client
      .url('http://www.yy.com/')
      .end();
  }
};