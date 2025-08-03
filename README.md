
## 说明


## 社区


## 安装依赖
- [安装 Node.js](https://nodejs.org/en/download/)
``` bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.17.1".
nvm current # Should print "v22.17.1".

# Verify npm version:
npm -v # Should print "10.9.2".
```

- [安装 vant weapp 组件](https://vant-ui.github.io/vant-weapp/#/quickstart)
``` bash
npm i @vant/weapp -S --production
```

## 运行小程序

在微信开发者工具中导入本项目即可运行。


## QA

- 新环境 npm 包编译错误如何解决？
  ``` bash
  cd miniprogram 
  npm init
  npm i @vant/weapp -S --production
  ```
  然后在IDE中点击 <button>工具</button>-><button>构建 npm</button> 即可。


## 功能点
1. 课程表，提醒
2. 土味情话
3. 圈圈

