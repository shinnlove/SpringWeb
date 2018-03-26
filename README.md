# SpringWeb

项目简要说明：

# 一、克隆到本地

```shell
cd
git clone https://github.com/shinnlove/SpringWeb.git
```

# 二、安装依赖

```shell
tnpm install
```

# 三、运行项目

```shell
tnpm start
```

# 四、访问页面

提供了两种react写法，extends和createClass方法，仅供参考。

http://127.0.0.1:8000/?#/dynamic/view # extends

http://127.0.0.1:8000/?#/dynamic/fieldSet # createClass

# 五、安装node、tnpm/cnpm
访问https://npm.taobao.org/mirrors/node/v9.0.0/

下载压缩包。解压缩后更名文件夹为node。

安装tnpm/cnpm的命令：
```shell
sudo npm install -g tnpm --registry=https://registry.npm.taobao.org

sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
```

mac下配置环境变量
- .bash命令配置`~/.profile`
- .zsh命令下配置`~/.zshrc`

配置内容如下：

```shell

#path var

export NODE_HOME=你放置nodejs的目录/node

export PATH=$PATH:$NODE_HOME/bin

#npm and tnpm
alias npm='你放置nodejs的目录/node/bin/npm'
alias tnpm='你放置nodejs的目录/node/bin/tnpm'
alias cnpm='你放置nodejs的目录/node/bin/cnpm'

```

而后生效配置
.bash命令下：
```shell
source ~/.profile
```
.zsh命令下：
```shell
source ~/.zshrc
```