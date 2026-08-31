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
    id: 'pinyin-initials',
    title: '声母练习',
    category: '拼音',
    body: 'b p m f d t n l g k h j q x\nzh ch sh r z c s y w'
  },
  {
    id: 'pinyin-finals',
    title: '韵母练习',
    category: '拼音',
    body: 'a o e i u v ai ei ui ao ou iu ie ve er\nan en in un vn ang eng ing ong'
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
    id: 'wenyan-loushiming',
    title: '陋室铭',
    category: '文言文',
    body: '山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。'
  },
  {
    id: 'wenyan-lunyu',
    title: '论语节选',
    category: '文言文',
    body: '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？温故而知新，可以为师矣。'
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
  },
  {
    id: 'words-cet4',
    title: '四级高频',
    category: '单词',
    body: 'ability achieve active benefit compare culture develop economy education environment improve knowledge method process require society',
    translations: ['能力', '实现', '积极的', '益处', '比较', '文化', '发展', '经济', '教育', '环境', '改善', '知识', '方法', '过程', '需要', '社会']
  }
]

const games = [
  {
    title: 'Monkeytype',
    description: '高自定义打字测试网站，支持多模式、实时 WPM、准确率、主题和账户历史。',
    href: 'https://monkeytype.com/',
    sourceHref: 'https://github.com/monkeytypegame/monkeytype'
  },
  {
    title: 'Qwerty Learner',
    description: '把单词记忆和键盘肌肉记忆结合起来，内置大量考试、程序员和语言词库。',
    href: 'https://qwerty.kaiyi.cool/',
    sourceHref: 'https://github.com/RealKai42/qwerty-learner'
  },
  {
    title: 'keybr.com',
    description: '根据按键表现生成针对性练习，适合补弱项、练节奏和盲打基础。',
    href: 'https://www.keybr.com/',
    sourceHref: 'https://github.com/aradzie/keybr.com'
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
  {
    title: 'ZType',
    description: '经典英文打字射击游戏，输入屏幕上的单词来击落敌人，节奏感强。',
    href: 'https://zty.pe/'
  },
  {
    title: 'RawType',
    description: '开源打字练习站，包含文章模式、单词模式、No-Mistake 和自定义练习。',
    href: 'https://rawtype.net/'
  },
  {
    title: 'CodeType',
    description: '面向开发者的 VS Code 打字游戏，使用真实代码片段训练符号和缩进。',
    href: 'https://codetype.ai/'
  },
  {
    title: 'Eletypes',
    description: '开源打字测试站，包含中文拼音、单词卡片、本地历史、主题和排行榜。',
    href: 'https://www.eletypes.com/',
    sourceHref: 'https://github.com/gamer-ai/eletypes-frontend'
  },
  {
    title: 'TYPE',
    description: '浏览器内自适应打字练习，根据表现解锁字母并提供基准测试。',
    href: 'https://type.review/',
    sourceHref: 'https://github.com/xiaolai/type-review'
  },
  {
    title: 'TypeQuest',
    description: '面向儿童的离线中文打字游戏，包含关卡、存档、成就和键位训练。',
    href: 'https://wingwangsz.github.io/TypeQuest/',
    sourceHref: 'https://github.com/wingwangsz/TypeQuest'
  },
  {
    title: 'Tux Typing',
    description: '经典 GPL 开源儿童打字游戏，包含 Fish Cascade 和 Comet Zap 等街机模式。',
    href: 'https://tuxtyping.org/',
    sourceHref: 'https://github.com/tux4kids/tuxtype'
  }
]

Object.assign(window.OhMyType, { defaultContents, games })

})()
