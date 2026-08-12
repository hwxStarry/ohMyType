# Oh My Type

Oh My Type 是一个面向诗词、文章、拼音和单词的打字练习页面。打开 `index.html` 即可使用。

## 功能

- 拼音、诗词、文章、单词等默认练习内容。
- 左侧按分类展开/收缩，支持侧边栏收起。
- 隐藏输入框捕获键盘输入，练习区实时标记正确、错误和当前位置。
- 拼音练习使用无声调字母输入，并绕过中文输入法干扰。
- 实时统计 WPM、准确率、用时和进度。
- 虚拟键盘高亮下一键。
- 自定义练习内容，可选择分类、编辑、删除，并保存到 `localStorage`。
- 完成后显示成绩，并记录错字和练习历史到 `localStorage`。
- 打字游戏栏目收集开源项目链接，可作为玩法参考。

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
├── src/
│   ├── constants.js    # 常量、localStorage key、分类、键盘布局
│   ├── data.js         # 默认内容和游戏链接数据
│   ├── keyboard.js     # 虚拟键盘渲染
│   ├── storage.js      # localStorage 读写和历史记录
│   ├── typing-state.js # 打字状态、错误检测、完成检测
│   └── utils.js        # HTML 转义、拼音归一化等工具
├── styles.css          # CSS 聚合入口
└── styles/
    ├── base.css
    ├── sidebar.css
    ├── topbar.css
    ├── practice.css
    ├── games.css
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
- `typestart_history`：练习历史。
- `typestart_mistakes`：错字统计。
