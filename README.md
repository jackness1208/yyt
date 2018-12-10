# yyt
* 基于 `nightwatch` ui 测试框架做出来的 一个 ui 测试 cli
* 已引入 `nightwatch-helpers`
* 支持 `nightwatch --env xxx` 写法

## 安装
```
$ npm install yyt -g
```

## 配置
在项目根目录配置 `config.js` 并且里面配置如下
```
module.exports = {
  nightwatch: {
    //nightwatch 配置项
  }
};
```

具体配置可参考 `nightwatch` 官网 [这里](http://nightwatchjs.org/gettingstarted#settings-file)

## 运行
在 config 所在目录执行：
```
$ yyt
```

带 env 写法
```
yyt --env ci-server
```
