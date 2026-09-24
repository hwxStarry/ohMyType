# 内置题库来源

## 唐诗

- 《唐诗三百首》结构化数据：[xuchunyang/300](https://github.com/xuchunyang/300)
- 原始诗词均为公版古典文学作品。
- 项目构建脚本将 319 首诗生成普通诗词练习，并把诗句拆分、去重后用于记忆闪打。

## 成语

- 汉语成语数据库：[Li1Fan/chinese-idiom](https://github.com/Li1Fan/chinese-idiom)
- 原数据库收录 50,920 条成语，采用 MIT License。
- 许可证副本见 [`LICENSE-chinese-idiom`](./LICENSE-chinese-idiom)。
- 项目保留其中 4–8 个汉字组成的去重词条，用于记忆闪打，并供后续成语玩法共用。

题库生成方式：

```bash
node scripts/build-memory-data.js /path/to/300.json /path/to/idiom.json
```
