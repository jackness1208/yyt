# yyt
* 基于 `nightwatch` ui 测试框架做出来的 一个 ui 测试 cli
* 已引入 `nightwatch-helpers`
* 支持 `nightwatch --env xxx` 写法

## 安装
### 1. 环境安装，需要 java 支持
#### windows
下载 [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html), 7 以上

#### linux
```
add-apt-repository ppa:webupd8team/java -y
apt-get install openjdk-8-jre-headless -y
```

### 2. node 包安装
```
$ npm install yyt -g
```


## 配置
在项目根目录配置 `yyt.config.js` 并且里面配置如下
```
module.exports = {
  default: {
    //nightwatch 配置项
  }
};
```

具体配置可参考 `nightwatch` 官网 [这里](http://nightwatchjs.org/gettingstarted#settings-file)

### 例子
```
module.exports = {
  default: {
    src_folders: ['nightwatch/test'],
    custom_commands_path: ['nightwatch/commands'],
    output_folder: false
  }
};
```

### 额外的配置项
除了 `nightwatch` 的 配置项外， 本组件还额外实现了:

```
module.exports = {
  default: {
    __extend: {
      // 用于配置生成 html report 的 路径
      html_report_path : './reports',
      // 用于配置测试浏览器代理端口
      proxy: 8887,
      // 用于配置测试浏览器是否使用 headless 模式
      headless: true
    }
  }
};

```

### 额外的 cmd 变量
```
# 定义 代理端口
yyt --proxy 8887

# 激活 headless 模式
yyt --headless

# 关掉 headless 模式
yyt --headless false

# 设置 运行 config.dev 配置
yyt --mode dev
```


## 运行
在 config 所在目录执行：
```
# 执行当前项目配置
$ yyt

# 执行 指定路径下的 yyt.config.js 配置
$ yyt path/to/project

# 执行 指定配置文件
$ yyt path/to/config
```

## 初始化项目
```
yyt init
```

## 帮助
```
yyt -h
yyt --help
```

## 版本信息
```
yyt -v
yyt --version
```

带 env 写法
```
yyt --env ci-server
```

## 选择模式 测试
如果 在 `yyt.config.js` 设置了 `dev` 模式配置
```
// yyt.config.js
module.exports = {
  default: {
    // setting
  },
  dev: {
    // setting
  }
};
```
则可以通过 `--mode` 进行模式切换

```
yyt --mode dev
```

## 常见错误
* 如果运行时出现 `cannot read property 'reduce' of null`, 请检查 测试目录中是否夹带其他 东西 如 html

