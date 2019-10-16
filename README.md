# h-player-v2 web版

## 关于 h-player-v2 web版

h-player-v2 web版 是基于 Quasar Framework 开发应用程序，实现hls视频流的在线播放。

## 功能特色

+ 支持视频源导入
+ 支持分类浏览与搜索
+ 特色多窗口播放模式
+ 历史记录及续播

## Get Started

一个chrom浏览器

```bash
# 安装依赖
yarn
# 启动开发服务器
yarn serve
# 编译二进制包
yarn build
```

> ### Note
>
> 1. 资源采集网的配置信息位于src\store\module\site.js

### Customize Configuration

See [Configuration Reference](https://quasar.dev/quasar-cli/quasar-conf-js).


## 使用方法:

1. 到release下载最新版本的压缩包 <a target="_blank" href ="https://raw.githubusercontent.com/ZyqGitHub1/h-player-v2/master/screenshot/download.gif">点击查看gif</a>
2. 解压文件到任意目录 <a target="_blank" href ="https://raw.githubusercontent.com/ZyqGitHub1/h-player-v2/master/screenshot/unzip.gif">点击查看gif</a>
3. 加入web服务器并打开相应的web url
4. 未导入视频源时会显示导入视频源界面
5. 点击`暂无视频源，点击选择文件导入`按钮
6. 选择视频源文件导入。 <a target="_blank" href ="https://raw.githubusercontent.com/ZyqGitHub1/h-player-v2/master/screenshot/import-source.gif">点击查看gif</a> ***示例文件位于[gist](https://gist.github.com/ZyqGitHub1/104becf19ebb84f601e3d32b59418944)*** <a target="_blank" href ="https://raw.githubusercontent.com/ZyqGitHub1/h-player-v2/master/screenshot/download-sorce.gif">点击查看gif</a>
7. have fun

> ### Note
>
> 1. 视频源只需导入一次，可以在设置界面重新导入或清空视频源
> 2. 如果下载示例视频源文件出现网络问题，请参考 [#14](https://github.com/ZyqGitHub1/h-player-v2/issues/14#issuecomment-517104860)

## TODO

- [x] 高亮当前分类
- [x] 页面缓存
- [x] 独立窗口播放
- [x] 持久化配置文件
- [x] 支持导入视频源
- [ ] http/https 功能优化
