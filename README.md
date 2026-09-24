# Oh My Type

[![GitHub Repo stars](https://img.shields.io/github/stars/hwxStarry/ohMyType?style=social)](https://github.com/hwxStarry/ohMyType)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Oh My Type 是一个面向诗词、文章、拼音、单词和对话的打字练习页面。打开 `index.html` 即可使用。

在线体验：[https://ohmytype.mozhe.cc/](https://ohmytype.mozhe.cc/)

后续功能和已确认的迭代方向见 [ROADMAP.md](./ROADMAP.md)。

## 适合

- 拼音、键位和英文单词的日常练习。
- 诗词、短文、文言文等中文内容的逐字输入训练。
- 朋友、闺蜜、情侣、客户与客服、面试问答等对话式输入训练。
- 临时粘贴一段文本，快速生成自己的练习内容。
- 不想注册账号，只想在浏览器本地保存练习记录的用户。

## 功能

- 12 组拼音、完整 319 首《唐诗三百首》数据、14 组主题单词，以及 44 组 JavaScript、Python、HTML、CSS 编程词汇练习。
- 编程内容在侧边栏按语言分组，每个术语都附有简短中文释义。
- 左侧按分类展开/收缩，对话内容按场景放在二级菜单，支持侧边栏收起。
- 支持按标题、分类、正文和编程释义搜索，并可随机选择当前分类内容。
- 支持本地收藏和最近练习列表，收藏页与最近练习页均可随机开始。
- 隐藏输入框捕获键盘输入，练习区实时标记正确、错误和当前位置。
- 拼音练习使用无声调字母输入，并绕过中文输入法干扰。
- 对话练习按场景显示真实角色：工作管理使用老板与员工，客户和售后使用客户与客服，面试使用面试官与候选人，日常聊天覆盖朋友、闺蜜、同性朋友和情侣。
- 趣味练习提供独立玩法入口；剧情分支通过直接逐字输入回复推进故事，并实时高亮正确、错误和待输入的字符。
- 记忆闪打内置 48,755 条成语和 3,248 条唐诗诗句，并复用普通练习中的英语单词、JavaScript、Python、HTML、CSS 术语；每题自动显示 5、3、1 秒，输入后按 Enter 立即进入下一题。
- 记忆闪打可选择是否显示拼音；组末统计 CPM、WPM、平均用时，并与上一次成绩和历史最佳速度比较。
- 剧情分支和侦探解谜共用可展开的响应式键盘：桌面默认展开，小屏默认收起，且会高亮下一步可输入的按键。
- 内置一个可玩的侦探案件《雨夜画廊失窃案》：完整输入证词收集线索，再指认真相。
- 实时统计 WPM、准确率、用时和进度。
- 虚拟键盘高亮下一键。
- 支持自由练习、限时、限字和错字阻止等练习模式。
- 自定义练习内容，可选择分类、编辑、删除，并保存到 `localStorage`。
- 完成后显示成绩，并按实际按键尝试记录错字和练习历史到 `localStorage`。
- 成绩弹窗支持复习本次错字、重练当前内容或直接进入同分类的下一练习。
- 弱项复习会优先生成包含错字的原词或原句，连续正确练习后自动标记为已掌握。
- 打字游戏栏目收集可直接体验的练习页面，部分项目提供源码入口。
- 内置多种按键反馈音效，也支持自定义在线音频。

## 使用

直接用浏览器打开：

```bash
open index.html
```

也可以启动一个静态服务：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 项目结构

```text
.
├── index.html          # 页面结构和脚本加载顺序
├── app.js              # 应用入口，负责 DOM 装配和事件绑定
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── favicon.svg
│   └── sounds/         # 本地音效资源和来源说明
├── src/
│   ├── annotations.js  # 拼音和单词标注
│   ├── constants.js    # 常量、localStorage key、分类、键盘布局
│   ├── content-library.js # 内容搜索、收藏、最近练习和随机选择
│   ├── data.js         # 默认内容和游戏链接数据
│   ├── fun-data.js     # 趣味玩法和分支剧情数据
│   ├── fun-typing.js   # 趣味玩法的逐字输入、候选和下一键状态
│   ├── keyboard.js     # 虚拟键盘渲染
│   ├── memory-data.js  # 诗词、成语共享内容库（由脚本生成）
│   ├── memory-state.js # 共享内容装配、连续组、倒计时和判分
│   ├── pinyin.js       # 拼音转换库
│   ├── sounds.js       # 完成音效设置和播放
│   ├── storage.js      # localStorage 读写和历史记录
│   ├── typing-state.js # 打字状态、错误检测、完成检测
│   └── utils.js        # HTML 转义、拼音归一化等工具
├── styles.css          # CSS 聚合入口
├── scripts/
│   └── build-memory-data.js # 从开源数据生成共享题库
└── styles/
    ├── base.css
    ├── sidebar.css
    ├── topbar.css
    ├── practice.css
    ├── games.css
    ├── fun.css
    ├── history.css
    ├── library.css
    ├── dialogs.css
    └── responsive.css
```

## 参与开发

代码按页面区域和职责拆分，新增功能时建议放入对应文件：

- 数据内容放 `src/data.js`。
- 状态和输入检测放 `src/typing-state.js`。
- 本地持久化放 `src/storage.js`。
- 视图装配和事件绑定放 `app.js`。
- 样式按页面区域放入 `styles/` 对应文件。

## 本地数据

应用使用以下 `localStorage` key：

- `ohmytype_custom_contents`：用户自定义内容。
- `ohmytype_active_content`：当前选中的内容。
- `ohmytype_sidebar_collapsed`：侧边栏收起状态。
- `ohmytype_open_categories`：分类展开状态。
- `ohmytype_practice_mode`：练习模式。
- `ohmytype_favorite_contents`：收藏的练习内容 ID。
- `ohmytype_recent_contents`：最近打开的练习内容 ID。
- `ohmytype_memory_records`：记忆闪打各难度最高分和最佳连对。
- `ohmytype_memory_pinyin`：记忆闪打是否显示拼音。
- `typestart_history`：练习历史。
- `typestart_mistakes`：错字统计。
- `ohmytype_completion_sound`：完成音效设置。

## 测试

```bash
node tests/typing-state.test.js
node tests/storage.test.js
node tests/content-data.test.js
node tests/content-library.test.js
node tests/dialogue-data.test.js
node tests/fun-data.test.js
node tests/fun-typing.test.js
node tests/keyboard.test.js
node tests/memory-data.test.js
node tests/memory-state.test.js
node tests/detective-state.test.js
node tests/seo.test.js
```

## 许可

代码采用 [MIT License](./LICENSE)。本地音效素材来源见 [assets/sounds/SOURCES.md](./assets/sounds/SOURCES.md)。
