/* eslint node/no-extraneous-require: 0 */
const HtmlReporter = require('nightwatch-html-reporter');

if (global.html_report_folder) {
  const reporter = new HtmlReporter({
    openBrowser: true,
    reportsDirectory: global.html_report_folder,
    themeName: 'outlook'
  });
  module.exports.reporter = reporter.fn;
}
