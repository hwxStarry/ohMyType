const assert = require('node:assert/strict')
const fs = require('node:fs')

const html = fs.readFileSync('index.html', 'utf8')
const manifest = fs.readFileSync('manifest.webmanifest', 'utf8')

const requiredChineseTerms = [
  '中文打字练习',
  '拼音打字练习',
  '键盘指法练习',
  '古诗词打字',
  '文言文打字',
  '对话打字练习',
  '剧情打字练习',
  '侦探解谜打字',
  '打字速度测试',
  '弱项复习',
  '电脑打字练习',
  '新手打字练习',
  '一分钟打字测试',
  '提高打字速度',
  '中文打字速度测试',
  '汉语拼音打字练习',
  '诗词默写打字',
  '英语四级单词打字',
  '职场对话打字练习',
  '文字冒险打字游戏',
  '侦探推理打字游戏',
  '无需登录打字练习'
]

for (const term of requiredChineseTerms) {
  assert.ok(html.includes(term), `index.html should include SEO term: ${term}`)
}

assert.match(html, /<meta name="description"[^>]+剧情分支[^>]+侦探解谜/)
assert.match(html, /<meta property="og:locale" content="zh_CN"/)
assert.match(html, /"featureList"\s*:/)
assert.ok(manifest.includes('侦探解谜'))

console.log('seo tests passed')
