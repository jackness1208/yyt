module.exports = {
  'test yy.com' : function (client) {
    client
      .url('http://www.yy.com')
      .waitForElementVisible('#wHead', 1000)
      .assert.visible('#wHeadSearch')
      .waitFor(1000)
      .setValue('#wHeadSearch', '991')
      .waitForElementVisible('#wHeadSearchThinkDragCnt', 1000)
      .getAttribute('#wHeadSearchThinkDragCnt', 'children', function (children) {
        this.assert.equal(children().length > 0, true);
      })
      .end();
  }
};
