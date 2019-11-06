# 版本变更
## 0.11.0(2019-10-23)
* feat: `yyt doctor` 支持 检测 chrome > 76.0.0 版本 自动下载 chromedriver

## 0.11.0-beta3(2019-08-13)
* feat: 升级 `nightwatch` 到 `1.2.1`
* feat: log 优化

## 0.11.0-beta2(2019-08-05)
* feat: 兼容 chrome `75.0.0` 版本浏览器

## 0.11.0-beta1(2019-06-20)
* feat: 新增 `config.__extend.platform` 参数， 默认为 pc
* feat: 新增 `yyt --platform` 参数， 默认为 pc

## 0.10.1(2019-06-01)
* fix: 修复 `linux` 下 yyt doctor chrome 版本获取失败的问题

## 0.10.0(2019-06-01)
* feat: 新增 `yyt doctor`
* feat: 新增 `yyt nightwatch`
* del: yyt 去 `se` 化
* del: 删除 `yyt install`
* del: 删除 `yyt se`
* del: 去掉默认配置中的 `config.test_settings.chrome` 配置项

## 0.9.2(2019-06-01)
* feat: 修复 `yyt --verbose path/to/a.js` 运行不符合预期问题

## 0.9.2-beta1
* feat: 新增 `yyt se` 命令
* feat: 新增 `yyt install` 命令
* feat: 新增 `yyt chromedriver` 命令

## 0.9.0
* feat: 新增 `client.checkUrlError(url)` 方法

## 0.8.6
* feat: 新增 `yyt path/to/test.js` 模式
* feat: 新增 `yyt path/to/folder` 模式

## 0.8.5-beta2(2019-05-17)
* fix: 好像 `nightwatch@1.1.9` 在linux 机器上运行有点问题, 先降级为 `1.0.19`

## 0.8.5-beta1(2019-05-17)
* fix: 调整兼容性

## 0.8.4(2019-05-17)
* fix: 修复 yyt 在 window 上运行 env 错误问题
* feat: 升级 nightwatch 到 `1.1.9`

## 0.8.3(2019-05-16)
* fix: 修复 yyt 在 linux 上不能跑的问题

## 0.8.2(2019-05-16)
* feat: 新增 yyt 运行时  会将 env 传到 test 文件里面， 文件通过 process.env.xxx 即可获取

## 0.8.1(2019-05-16)
* fix: 修复 yyt help 报错问题

## 0.8.0(2019-04-19)
* feat: 调整文档
* feat: 更新内置的 `checkPageError` 方法
* feat: 新增运行时 显示 nightwatch 版本
* feat: 新增 `__config.userAgent` 配置项

## 0.7.2(2019-03-23)
* feat: 新增 输出 `driver args` logs
* fix: 修复 当脚本数量过多时会出现 `node warning， maxListener` 问题
* feat: 更新 `yyl-print` `yyl-util` 组件

## 0.7.1-beta1(2019-02-28)
* fix: 修复 在 `docker` 中 运行报错还依然判断测试通过的问题

## 0.7.0 (2019-02-28)
* feat: 新增 `yyt check` 用于检查 yyt 可用性
* fix: yyt 适配 `linux`

## 0.6.1 (2019-02-25)
* feat: 新增 `yyt -p`

## 0.6.0 (2019-01-08)
* feat: 新增 `yyt --output`
* feat: 新增 `yyt --reporter`
* feat: 新增 `yyt --verbose`
* feat: 新增 `yyt --test`
* feat: 新增 `yyt --testcase`
* feat: 新增 `yyt --group`
* feat: 新增 `yyt --skipgroup`
* feat: 新增 `yyt --filter`
* feat: 新增 `yyt --tag`
* feat: 新增 `yyt --skiptags`
* feat: 新增 `yyt --retries`
* feat: 新增 `yyt --suiteRetries`
* 注 以上属性不保证能正常使用, 属于 nightwatch 本身自带的属性

## 0.5.0 (2019-01-07)
* feat: 新增 `yyt init` yyt 项目初始化功能
* feat: 新增 `yyt --proxy` 配置项
* feat: 新增 `yyt --headless` 配置项
* feat: 新增 `config.__extend.proxy` 配置项
* feat: 新增 `config.__extend.headless` 配置项
* feat: 新增 `config.__extend.html_report_folder` 配置项
* feat: yyt 配置文件 改为 `yyt.config.js`, `config.js` 不再支持
* del: 去掉 `config.html_report_folder` 配置项

## 0.4.0 (2018-12-24)
* feat: 默认配置文件 改为 `yyt.config.js`
* feat: 新增 `yyt path/to/config` 方式

## 0.3.0 (2018-12-12)
* feat: 加入 `nightwatch-html-reporter`
* feat: 新增 `nightwatch.html_report_folder` 配置项
* feat: 升级 `nightwatch` 到 `1.x` 版本

## 0.2.0 (2018-12-12)
* feat: 支持自定义 `custom_commands_path`, `custom_assertions_path`

## 0.1.0 (2018-12-10)
* 诞生

## 0.0.1 (2018-12-07)
* npm 占坑
