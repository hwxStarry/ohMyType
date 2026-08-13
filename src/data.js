(() => {
window.OhMyType = window.OhMyType || {}

const defaultContents = [
  {
    id: 'pinyin-basic',
    title: '拼音入门',
    category: '拼音',
    body: 'ba bo bi bu pa po pi pu ma mo mi mu fa fo fu\nda de di du ta te ti tu na ne ni nu la le li lu'
  },
  {
    id: 'poem-jingyesi',
    title: '静夜思',
    category: '诗词',
    body: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。'
  },
  {
    id: 'poem-chunxiao',
    title: '春晓',
    category: '诗词',
    body: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。'
  },
  {
    id: 'poem-dengguanquelou',
    title: '登鹳雀楼',
    category: '诗词',
    body: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。'
  },
  {
    id: 'article-spring',
    title: '春日短章',
    category: '文章',
    body: '清晨的风从窗外进来，带着一点湿润的草木气息。案上的书页轻轻翻动，像有人在提醒我，今天也该慢慢写下几行字。'
  },
  {
    id: 'article-focus',
    title: '专注练习',
    category: '文章',
    body: '打字不是单纯追求速度。稳定的节奏、准确的落键、放松的肩背，都会在一次次练习里变成真正可靠的能力。'
  },
  {
    id: 'words-basic',
    title: '基础单词',
    category: '单词',
    body: 'apple book city desk early family green happy island journey kitchen letter music nature orange people quiet river school travel window',
    translations: ['苹果', '书', '城市', '书桌', '早的', '家庭', '绿色', '快乐', '岛屿', '旅程', '厨房', '信件', '音乐', '自然', '橙子', '人们', '安静', '河流', '学校', '旅行', '窗户']
  },
  {
    id: 'words-school',
    title: '校园单词',
    category: '单词',
    body: 'classroom homework teacher student pencil eraser ruler textbook library lesson subject science history English notebook exam grade',
    translations: ['教室', '作业', '老师', '学生', '铅笔', '橡皮', '尺子', '课本', '图书馆', '课程', '科目', '科学', '历史', '英语', '笔记本', '考试', '年级']
  },
  {
    id: 'words-tech',
    title: '科技单词',
    category: '单词',
    body: 'computer keyboard monitor browser network server client function object module storage script style database terminal',
    translations: ['电脑', '键盘', '显示器', '浏览器', '网络', '服务器', '客户端', '函数', '对象', '模块', '存储', '脚本', '样式', '数据库', '终端']
  }
]

const games = [
  {
    title: 'Monkeytype',
    description: '高自定义打字测试网站，支持多模式、实时 WPM、准确率、主题和账户历史。',
    href: 'https://monkeytype.com/'
  },
  {
    title: 'TypeWords',
    description: '中文开发者维护的开源单词与文章练习工具，覆盖背词、文章默写和错词复习。',
    href: 'https://typewords.cc/'
  },
  {
    title: 'Word Hopper',
    description: '浏览器横版跳跃打字游戏，输入障碍物上的单词并把握空格跳跃时机。',
    href: 'https://wordhopper.wingedge777.com/'
  },
  // {
  //   title: 'GuerillaType',
  //   description: '自托管打字训练站，含课程、练习、挑战、公开文本库和本地统计。',
  //   href: 'https://github.com/jonajinga/GuerillaType'
  // },
  {
    title: 'CodeType',
    description: '面向开发者的 VS Code 打字游戏，使用真实代码片段训练符号和缩进。',
    href: 'https://codetype.ai/'
  },
  {
    title: 'Tux Typing',
    description: '经典 GPL 开源儿童打字游戏，包含 Fish Cascade 和 Comet Zap 等街机模式。',
    href: 'https://tuxtyping.org/'
  }
]

Object.assign(window.OhMyType, { defaultContents, games })

})()
