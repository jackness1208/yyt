# yyt
* 基于 `nightwatch` ui 测试框架做出来的 一个 ui 测试 cli
* 已引入 `nightwatch-helpers`
* 支持 `nightwatch --env xxx` 写法

## 安装
```
$ npm install yyt -g
```

## 配置
在项目根目录配置 `yyt.config.js` 并且里面配置如下
```
module.exports = {
  //nightwatch 配置项
};
```

具体配置可参考 `nightwatch` 官网 [这里](http://nightwatchjs.org/gettingstarted#settings-file)

### 例子
```
module.exports = {
  src_folders: ['nightwatch/test'],
  custom_commands_path: ['nightwatch/commands'],
  output_folder: false
};
```

### 额外的配置项
除了 `nightwatch` 的 配置项外， 本组件还额外实现了:

```
module.exports = {
  __extend: {
    // 用于配置生成 html report 的 路径
    html_report_path : './reports',
    // 用于配置测试浏览器代理端口
    proxy: 8887,
    // 用于配置测试浏览器是否使用 headless 模式
    headless: true
  }
};

```

### 额外的 cmd 变量
```
yyt --proxy 8887
yyt --headless
yyt --headless false
```


## 运行
在 config 所在目录执行：
```
$ yyt
```

带 env 写法
```
yyt --env ci-server
```
