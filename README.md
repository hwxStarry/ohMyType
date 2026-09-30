# Oh My Type

[English](README.en.md) · [在线体验](https://ohmytype.mozhe.cc/) · [开发计划](ROADMAP.md)

一个在浏览器里使用的打字练习项目。可以练习拼音、诗词、英文单词、编程术语和对话，也可以粘贴自己的文本开始练习。

## 功能

- 实时显示输入位置、速度、准确率和错字。
- 提供自由、限时、限字等练习模式，以及虚拟键盘提示。
- 支持收藏、最近练习、错字复习和自定义内容。
- 包含记忆闪打、剧情分支和侦探解谜等趣味练习。
- 练习记录保存在当前浏览器，无需注册。

## 本地运行

直接打开 `index.html`，或在仓库目录启动静态服务：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080/`。项目使用原生 HTML、CSS 和 JavaScript，无需构建。

## 测试

```bash
node --test tests/*.test.js
```

代码采用 [MIT License](LICENSE)。内容和音效来源分别见 [CONTENT_SOURCES.md](CONTENT_SOURCES.md) 与 [assets/sounds/SOURCES.md](assets/sounds/SOURCES.md)。
