module.exports = {
  'test yy.com' : function (client) {
    client
      .url('http://www.yy.com')
      .maximizeWindow()
      .waitForElementVisible('#wHead', 1000)
      .assert.visible('#wHeadSearch')
      .waitFor(1000)
      .setValue('#wHeadSearch', '991')
      .waitForElementVisible('#wHeadSearchThinkDragCnt', 1000)
      .elements('css selector', '#wHeadSearchThinkDragCnt li', function (res) {
        this.assert.equal(res.value.length > 0, true);
      })
      .end();
  }
};
