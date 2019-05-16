# 版本变更
## 0.8.1(2019-05-16)
* [FIX] 修复 yyt help 报错问题

## 0.8.0(2019-04-19)
* [EDIT] 调整文档
* [EDIT] 更新内置的 `checkPageError` 方法
* [ADD] 新增运行时 显示 nightwatch 版本
* [ADD] 新增 `__config.userAgent` 配置项

## 0.7.2(2019-03-23)
* [ADD] 新增 输出 `driver args` logs
* [FIX] 修复 当脚本数量过多时会出现 `node warning， maxListener` 问题
* [EDIT] 更新 `yyl-print` `yyl-util` 组件

## 0.7.1-beta1(2019-02-28)
* [FIX] 修复 在 `docker` 中 运行报错还依然判断测试通过的问题

## 0.7.0 (2019-02-28)
* [ADD] 新增 `yyt check` 用于检查 yyt 可用性
* [FIX] yyt 适配 `linux`

## 0.6.1 (2019-02-25)
* [ADD] 新增 `yyt -p`

## 0.6.0 (2019-01-08)
* [ADD] 新增 `yyt --output`
* [ADD] 新增 `yyt --reporter`
* [ADD] 新增 `yyt --verbose`
* [ADD] 新增 `yyt --test`
* [ADD] 新增 `yyt --testcase`
* [ADD] 新增 `yyt --group`
* [ADD] 新增 `yyt --skipgroup`
* [ADD] 新增 `yyt --filter`
* [ADD] 新增 `yyt --tag`
* [ADD] 新增 `yyt --skiptags`
* [ADD] 新增 `yyt --retries`
* [ADD] 新增 `yyt --suiteRetries`
* 注 以上属性不保证能正常使用, 属于 nightwatch 本身自带的属性

## 0.5.0 (2019-01-07)
* [ADD] 新增 `yyt init` yyt 项目初始化功能
* [ADD] 新增 `yyt --proxy` 配置项
* [ADD] 新增 `yyt --headless` 配置项
* [ADD] 新增 `config.__extend.proxy` 配置项
* [ADD] 新增 `config.__extend.headless` 配置项
* [ADD] 新增 `config.__extend.html_report_folder` 配置项
* [EDIT] yyt 配置文件 改为 `yyt.config.js`, `config.js` 不再支持
* [DEL] 去掉 `config.html_report_folder` 配置项

## 0.4.0 (2018-12-24)
* [EDIT] 默认配置文件 改为 `yyt.config.js`
* [ADD] 新增 `yyt path/to/config` 方式

## 0.3.0 (2018-12-12)
* [ADD] 加入 `nightwatch-html-reporter`
* [ADD] 新增 `nightwatch.html_report_folder` 配置项
* [EDIT] 升级 `nightwatch` 到 `1.x` 版本

## 0.2.0 (2018-12-12)
* [ADD] 支持自定义 `custom_commands_path`, `custom_assertions_path`

## 0.1.0 (2018-12-10)
* 诞生

## 0.0.1 (2018-12-07)
* npm 占坑
