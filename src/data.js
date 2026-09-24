(() => {
window.OhMyType = window.OhMyType || {}
const { poetryPracticeContents = [] } = window.OhMyType

function makeDialogueContent({ id, title, category, incomingRole = '员工', replyRole = '老板', messages }) {
  return {
    id,
    title,
    category,
    incomingRole,
    replyRole,
    body: messages.map(message => message.reply).join('\n'),
    messages
  }
}

function makeProgrammingContent({ id, title, language, items }) {
  return {
    id,
    title,
    category: `编程·${language}`,
    body: items.map(([name]) => name).join(' '),
    translations: items.map(([, description]) => description)
  }
}

function makeDialogueScenario({ pairs, ...options }) {
  return makeDialogueContent({
    ...options,
    messages: pairs.map(([incoming, reply]) => ({ incoming, reply }))
  })
}

const baseContents = [
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
    id: 'pinyin-whole-syllables',
    title: '整体认读音节',
    category: '拼音',
    body: 'zhi chi shi ri zi ci si yi wu yu\nye yue yuan yin yun ying'
  },
  {
    id: 'pinyin-bpmf',
    title: '声母组合：b p m f',
    category: '拼音',
    body: 'ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu\npa pai pan pang pao pei pen peng pi pian piao pie pin ping po pu\nma mai man mang mao mei men meng mi mian miao mie min ming mo mou mu\nfa fan fang fei fen feng fo fou fu'
  },
  {
    id: 'pinyin-dtnl',
    title: '声母组合：d t n l',
    category: '拼音',
    body: 'da dai dan dang dao de dei deng di dia dian diao die ding diu dong dou du duan dui dun duo\nta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo\nna nai nan nang nao ne nei nen neng ni nian niang niao nie nin ning niu nong nou nu nv nuan nue nuo\nla lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu long lou lu lv luan lue lun luo'
  },
  {
    id: 'pinyin-gkh',
    title: '声母组合：g k h',
    category: '拼音',
    body: 'ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo\nka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo\nha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo'
  },
  {
    id: 'pinyin-jqx',
    title: '声母组合：j q x',
    category: '拼音',
    body: 'ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun\nqi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun\nxi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun'
  },
  {
    id: 'pinyin-zhchshr',
    title: '翘舌音组合',
    category: '拼音',
    body: 'zha zhai zhan zhang zhao zhe zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo\ncha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo\nsha shai shan shang shao she shei shen sheng shi shou shu shua shuai shuan shuang shui shun shuo\nran rang rao re ren reng ri rong rou ru rua ruan rui run ruo'
  },
  {
    id: 'pinyin-zcs',
    title: '平舌音组合',
    category: '拼音',
    body: 'za zai zan zang zao ze zei zen zeng zi zong zou zu zuan zui zun zuo\nca cai can cang cao ce cen ceng ci cong cou cu cuan cui cun cuo\nsa sai san sang sao se sen seng si song sou su suan sui sun suo'
  },
  {
    id: 'pinyin-compound-finals',
    title: '复韵母强化',
    category: '拼音',
    body: 'ai ei ui ao ou iu ie ve er\nbai bei bao bie pou pei mou mei fou fei\ndai dui dao dou die diu tai tui tao tou tie\ngai gei gui gao gou kai kei kui kao kou\nhai hei hui hao hou zai zei zui zao zou'
  },
  {
    id: 'pinyin-nasal-finals',
    title: '鼻韵母强化',
    category: '拼音',
    body: 'an en in un vn ang eng ing ong\nban ben bin bang beng bing pan pen pin pang peng ping\ndan deng ding dong tan teng ting tong nan nen nin nang neng ning nong\ngan gen gang geng gong kan ken kang keng kong han hen hang heng hong'
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
    id: 'poem-xiangsi',
    title: '相思',
    category: '诗词',
    body: '红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。'
  },
  {
    id: 'poem-luzhai',
    title: '鹿柴',
    category: '诗词',
    body: '空山不见人，但闻人语响。\n返景入深林，复照青苔上。'
  },
  {
    id: 'poem-zhuliguan',
    title: '竹里馆',
    category: '诗词',
    body: '独坐幽篁里，弹琴复长啸。\n深林人不知，明月来相照。'
  },
  {
    id: 'poem-jiangxue',
    title: '江雪',
    category: '诗词',
    body: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。'
  },
  {
    id: 'poem-xunyinzhebuyu',
    title: '寻隐者不遇',
    category: '诗词',
    body: '松下问童子，言师采药去。\n只在此山中，云深不知处。'
  },
  {
    id: 'poem-minnong',
    title: '悯农',
    category: '诗词',
    body: '锄禾日当午，汗滴禾下土。\n谁知盘中餐，粒粒皆辛苦。'
  },
  {
    id: 'poem-yong-e',
    title: '咏鹅',
    category: '诗词',
    body: '鹅，鹅，鹅，曲项向天歌。\n白毛浮绿水，红掌拨清波。'
  },
  {
    id: 'poem-feng',
    title: '风',
    category: '诗词',
    body: '解落三秋叶，能开二月花。\n过江千尺浪，入竹万竿斜。'
  },
  {
    id: 'poem-wanglushanpubu',
    title: '望庐山瀑布',
    category: '诗词',
    body: '日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。'
  },
  {
    id: 'poem-zaofabaidicheng',
    title: '早发白帝城',
    category: '诗词',
    body: '朝辞白帝彩云间，千里江陵一日还。\n两岸猿声啼不住，轻舟已过万重山。'
  },
  {
    id: 'poem-zengwanglun',
    title: '赠汪伦',
    category: '诗词',
    body: '李白乘舟将欲行，忽闻岸上踏歌声。\n桃花潭水深千尺，不及汪伦送我情。'
  },
  {
    id: 'poem-jueju-dufu',
    title: '绝句',
    category: '诗词',
    body: '两个黄鹂鸣翠柳，一行白鹭上青天。\n窗含西岭千秋雪，门泊东吴万里船。'
  },
  {
    id: 'poem-fengqiaoyebo',
    title: '枫桥夜泊',
    category: '诗词',
    body: '月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。'
  },
  {
    id: 'poem-bochuanguazhou',
    title: '泊船瓜洲',
    category: '诗词',
    body: '京口瓜洲一水间，钟山只隔数重山。\n春风又绿江南岸，明月何时照我还。'
  },
  {
    id: 'poem-tixilinbi',
    title: '题西林壁',
    category: '诗词',
    body: '横看成岭侧成峰，远近高低各不同。\n不识庐山真面目，只缘身在此山中。'
  },
  {
    id: 'poem-yinhushang',
    title: '饮湖上初晴后雨',
    category: '诗词',
    body: '水光潋滟晴方好，山色空蒙雨亦奇。\n欲把西湖比西子，淡妆浓抹总相宜。'
  },
  {
    id: 'poem-shanxing',
    title: '山行',
    category: '诗词',
    body: '远上寒山石径斜，白云生处有人家。\n停车坐爱枫林晚，霜叶红于二月花。'
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
  },
  {
    id: 'words-daily-life',
    title: '日常生活',
    category: '单词',
    body: 'morning breakfast shower clothes wallet bottle phone umbrella market dinner evening sleep',
    translations: ['早晨', '早餐', '淋浴', '衣服', '钱包', '瓶子', '电话', '雨伞', '市场', '晚餐', '晚上', '睡觉']
  },
  {
    id: 'words-food',
    title: '食物餐饮',
    category: '单词',
    body: 'bread rice noodle vegetable fruit chicken beef coffee tea sugar salt kitchen restaurant',
    translations: ['面包', '米饭', '面条', '蔬菜', '水果', '鸡肉', '牛肉', '咖啡', '茶', '糖', '盐', '厨房', '餐厅']
  },
  {
    id: 'words-travel',
    title: '交通旅行',
    category: '单词',
    body: 'airport station ticket passport luggage hotel journey flight train subway bicycle direction',
    translations: ['机场', '车站', '票', '护照', '行李', '酒店', '旅程', '航班', '火车', '地铁', '自行车', '方向']
  },
  {
    id: 'words-nature',
    title: '自然环境',
    category: '单词',
    body: 'mountain ocean forest desert valley cloud thunder sunlight season climate planet energy',
    translations: ['山', '海洋', '森林', '沙漠', '山谷', '云', '雷', '阳光', '季节', '气候', '行星', '能源']
  },
  {
    id: 'words-emotions',
    title: '情绪感受',
    category: '单词',
    body: 'calm excited nervous proud lonely curious worried relaxed surprised grateful confident patient',
    translations: ['平静的', '兴奋的', '紧张的', '自豪的', '孤独的', '好奇的', '担心的', '放松的', '惊讶的', '感激的', '自信的', '耐心的']
  },
  {
    id: 'words-common-verbs',
    title: '常用动词',
    category: '单词',
    body: 'accept build choose create decide explain follow happen include learn manage notice prepare remember share understand',
    translations: ['接受', '建造', '选择', '创造', '决定', '解释', '跟随', '发生', '包含', '学习', '管理', '注意', '准备', '记住', '分享', '理解']
  },
  {
    id: 'words-adjectives',
    title: '常用形容词',
    category: '单词',
    body: 'available careful common different effective familiar important modern possible public simple useful valuable',
    translations: ['可用的', '仔细的', '常见的', '不同的', '有效的', '熟悉的', '重要的', '现代的', '可能的', '公共的', '简单的', '有用的', '有价值的']
  },
  {
    id: 'words-business',
    title: '职场商务',
    category: '单词',
    body: 'agenda budget client contract deadline feedback meeting project report schedule strategy target teamwork update',
    translations: ['议程', '预算', '客户', '合同', '截止日期', '反馈', '会议', '项目', '报告', '日程', '策略', '目标', '团队合作', '更新']
  },
  {
    id: 'words-academic',
    title: '学术阅读',
    category: '单词',
    body: 'analysis approach concept evidence factor issue principle research result source theory variable conclusion',
    translations: ['分析', '方法', '概念', '证据', '因素', '问题', '原则', '研究', '结果', '来源', '理论', '变量', '结论']
  },
  {
    id: 'words-internet',
    title: '互联网词汇',
    category: '单词',
    body: 'account browser cache cookie download interface login password privacy search security upload website',
    translations: ['账户', '浏览器', '缓存', 'Cookie', '下载', '界面', '登录', '密码', '隐私', '搜索', '安全', '上传', '网站']
  },
  makeProgrammingContent({
    id: 'programming-js-types', title: '基础类型', language: 'JavaScript',
    items: [['undefined', '未定义'], ['null', '空值'], ['boolean', '布尔值'], ['number', '数字'], ['bigint', '大整数'], ['string', '字符串'], ['symbol', '唯一标识'], ['object', '对象'], ['function', '函数']]
  }),
  makeProgrammingContent({
    id: 'programming-js-declarations', title: '声明与模块', language: 'JavaScript',
    items: [['const', '常量声明'], ['let', '块级变量'], ['var', '函数级变量'], ['function', '函数声明'], ['class', '类声明'], ['import', '导入模块'], ['export', '导出模块'], ['default', '默认导出'], ['extends', '继承'], ['static', '静态成员']]
  }),
  makeProgrammingContent({
    id: 'programming-js-control', title: '流程控制', language: 'JavaScript',
    items: [['if', '条件判断'], ['else', '否则分支'], ['switch', '多路选择'], ['case', '匹配分支'], ['for', '循环'], ['while', '条件循环'], ['do', '先执行循环'], ['break', '跳出'], ['continue', '继续下轮'], ['return', '返回结果'], ['try', '尝试执行'], ['catch', '捕获错误'], ['finally', '最终执行'], ['throw', '抛出错误']]
  }),
  makeProgrammingContent({
    id: 'programming-js-operators', title: '常用运算关键字', language: 'JavaScript',
    items: [['typeof', '检查类型'], ['instanceof', '检查实例'], ['in', '检查属性'], ['delete', '删除属性'], ['new', '创建实例'], ['this', '当前上下文'], ['super', '父类引用'], ['void', '返回未定义'], ['yield', '生成器暂停'], ['await', '等待异步']]
  }),
  makeProgrammingContent({
    id: 'programming-js-array-mutate', title: '数组增删', language: 'JavaScript',
    items: [['push', '末尾添加'], ['pop', '末尾移除'], ['shift', '开头移除'], ['unshift', '开头添加'], ['splice', '原位增删'], ['fill', '填充元素'], ['copyWithin', '内部复制'], ['reverse', '原位反转'], ['sort', '原位排序']]
  }),
  makeProgrammingContent({
    id: 'programming-js-array-copy', title: '数组复制与组合', language: 'JavaScript',
    items: [['slice', '截取副本'], ['concat', '连接数组'], ['join', '连接字符串'], ['flat', '数组扁平化'], ['flatMap', '映射并扁平'], ['toReversed', '反转副本'], ['toSorted', '排序副本'], ['toSpliced', '增删副本'], ['with', '替换副本']]
  }),
  makeProgrammingContent({
    id: 'programming-js-array-iterate', title: '数组遍历', language: 'JavaScript',
    items: [['forEach', '逐项执行'], ['map', '映射新数组'], ['filter', '筛选元素'], ['reduce', '累计结果'], ['reduceRight', '反向累计'], ['some', '是否部分满足'], ['every', '是否全部满足'], ['entries', '键值迭代器'], ['keys', '索引迭代器'], ['values', '值迭代器']]
  }),
  makeProgrammingContent({
    id: 'programming-js-array-search', title: '数组查找', language: 'JavaScript',
    items: [['find', '查找元素'], ['findIndex', '查找索引'], ['findLast', '反向查找'], ['findLastIndex', '反向查索引'], ['includes', '是否包含'], ['indexOf', '首次位置'], ['lastIndexOf', '末次位置'], ['at', '按位置访问']]
  }),
  makeProgrammingContent({
    id: 'programming-js-string-search', title: '字符串查找', language: 'JavaScript',
    items: [['length', '字符长度'], ['at', '按位置访问'], ['charAt', '获取字符'], ['includes', '是否包含'], ['indexOf', '首次位置'], ['lastIndexOf', '末次位置'], ['startsWith', '是否开头'], ['endsWith', '是否结尾'], ['search', '正则查找'], ['match', '正则匹配'], ['matchAll', '全部匹配']]
  }),
  makeProgrammingContent({
    id: 'programming-js-string-transform', title: '字符串转换', language: 'JavaScript',
    items: [['slice', '截取字符串'], ['substring', '截取区间'], ['split', '分割字符串'], ['replace', '替换一次'], ['replaceAll', '全部替换'], ['trim', '去两端空白'], ['trimStart', '去开头空白'], ['trimEnd', '去结尾空白'], ['toLowerCase', '转小写'], ['toUpperCase', '转大写'], ['repeat', '重复字符串'], ['padStart', '开头填充'], ['padEnd', '结尾填充']]
  }),
  makeProgrammingContent({
    id: 'programming-js-object', title: '对象方法', language: 'JavaScript',
    items: [['keys', '属性名数组'], ['values', '属性值数组'], ['entries', '键值对数组'], ['fromEntries', '键值对转对象'], ['assign', '合并对象'], ['create', '指定原型创建'], ['freeze', '冻结对象'], ['seal', '密封对象'], ['hasOwn', '检查自有属性'], ['getPrototypeOf', '获取原型'], ['setPrototypeOf', '设置原型']]
  }),
  makeProgrammingContent({
    id: 'programming-js-number-math', title: '数字与数学', language: 'JavaScript',
    items: [['parseInt', '解析整数'], ['parseFloat', '解析小数'], ['isNaN', '判断非数字'], ['isFinite', '判断有限数'], ['toFixed', '固定小数位'], ['round', '四舍五入'], ['floor', '向下取整'], ['ceil', '向上取整'], ['trunc', '截去小数'], ['abs', '绝对值'], ['min', '最小值'], ['max', '最大值'], ['random', '随机数'], ['pow', '幂运算'], ['sqrt', '平方根']]
  }),
  makeProgrammingContent({
    id: 'programming-js-async', title: '异步与 Promise', language: 'JavaScript',
    items: [['Promise', '异步结果'], ['async', '异步函数'], ['await', '等待结果'], ['then', '成功回调'], ['catch', '失败回调'], ['finally', '结束回调'], ['resolve', '创建成功结果'], ['reject', '创建失败结果'], ['all', '等待全部'], ['allSettled', '等待全部结束'], ['race', '等待最先结果'], ['any', '等待首个成功'], ['fetch', '网络请求']]
  }),
  makeProgrammingContent({
    id: 'programming-js-json-console', title: 'JSON 与调试', language: 'JavaScript',
    items: [['stringify', '转为 JSON'], ['parse', '解析 JSON'], ['log', '打印日志'], ['info', '信息日志'], ['warn', '警告日志'], ['error', '错误日志'], ['table', '表格展示'], ['time', '开始计时'], ['timeEnd', '结束计时'], ['assert', '条件断言'], ['debugger', '调试断点']]
  }),
  makeProgrammingContent({
    id: 'programming-python-types', title: '基础类型', language: 'Python',
    items: [['None', '空值'], ['bool', '布尔值'], ['int', '整数'], ['float', '浮点数'], ['complex', '复数'], ['str', '字符串'], ['list', '列表'], ['tuple', '元组'], ['range', '范围'], ['dict', '字典'], ['set', '集合'], ['frozenset', '不可变集合'], ['bytes', '字节串'], ['bytearray', '可变字节串']]
  }),
  makeProgrammingContent({
    id: 'programming-python-keywords', title: '流程关键字', language: 'Python',
    items: [['if', '条件判断'], ['elif', '追加条件'], ['else', '否则分支'], ['for', '遍历循环'], ['while', '条件循环'], ['break', '跳出循环'], ['continue', '继续下轮'], ['pass', '空语句'], ['match', '模式匹配'], ['case', '匹配分支'], ['return', '返回结果'], ['yield', '生成器产出']]
  }),
  makeProgrammingContent({
    id: 'programming-python-declarations', title: '定义与导入', language: 'Python',
    items: [['def', '定义函数'], ['class', '定义类'], ['lambda', '匿名函数'], ['import', '导入模块'], ['from', '指定来源'], ['as', '设置别名'], ['global', '全局变量'], ['nonlocal', '外层变量'], ['async', '异步定义'], ['await', '等待异步'], ['del', '删除引用']]
  }),
  makeProgrammingContent({
    id: 'programming-python-builtins-basic', title: '常用内置函数', language: 'Python',
    items: [['print', '输出内容'], ['input', '读取输入'], ['len', '获取长度'], ['type', '获取类型'], ['isinstance', '检查类型'], ['id', '对象标识'], ['help', '查看帮助'], ['dir', '查看属性'], ['repr', '正式字符串'], ['format', '格式化'], ['callable', '是否可调用']]
  }),
  makeProgrammingContent({
    id: 'programming-python-builtins-number', title: '数值内置函数', language: 'Python',
    items: [['abs', '绝对值'], ['round', '四舍五入'], ['pow', '幂运算'], ['divmod', '商和余数'], ['min', '最小值'], ['max', '最大值'], ['sum', '求和'], ['bin', '二进制字符串'], ['oct', '八进制字符串'], ['hex', '十六进制字符串'], ['int', '转整数'], ['float', '转浮点数'], ['complex', '创建复数']]
  }),
  makeProgrammingContent({
    id: 'programming-python-builtins-iterate', title: '迭代内置函数', language: 'Python',
    items: [['range', '生成范围'], ['enumerate', '索引和值'], ['zip', '并行组合'], ['iter', '获取迭代器'], ['next', '获取下一项'], ['reversed', '反向迭代'], ['sorted', '排序列表'], ['map', '逐项映射'], ['filter', '逐项筛选'], ['all', '是否全部为真'], ['any', '是否任一为真']]
  }),
  makeProgrammingContent({
    id: 'programming-python-list', title: '列表方法', language: 'Python',
    items: [['append', '末尾添加'], ['extend', '追加多个'], ['insert', '指定位置插入'], ['remove', '按值移除'], ['pop', '移除并返回'], ['clear', '清空列表'], ['index', '查找位置'], ['count', '统计次数'], ['sort', '原位排序'], ['reverse', '原位反转'], ['copy', '浅复制']]
  }),
  makeProgrammingContent({
    id: 'programming-python-string-query', title: '字符串判断', language: 'Python',
    items: [['count', '统计次数'], ['find', '查找位置'], ['index', '查找或报错'], ['startswith', '是否开头'], ['endswith', '是否结尾'], ['isalnum', '是否字母数字'], ['isalpha', '是否字母'], ['isdigit', '是否数字'], ['islower', '是否小写'], ['isupper', '是否大写'], ['isspace', '是否空白']]
  }),
  makeProgrammingContent({
    id: 'programming-python-string-transform', title: '字符串转换', language: 'Python',
    items: [['capitalize', '首字母大写'], ['casefold', '强制小写'], ['lower', '转小写'], ['upper', '转大写'], ['title', '标题格式'], ['strip', '去两端空白'], ['lstrip', '去左侧空白'], ['rstrip', '去右侧空白'], ['replace', '替换文本'], ['split', '分割字符串'], ['join', '连接字符串'], ['partition', '分成三段'], ['zfill', '零填充']]
  }),
  makeProgrammingContent({
    id: 'programming-python-dict', title: '字典方法', language: 'Python',
    items: [['get', '安全取值'], ['keys', '键视图'], ['values', '值视图'], ['items', '键值视图'], ['update', '更新字典'], ['setdefault', '取值或设置'], ['pop', '移除指定键'], ['popitem', '移除末项'], ['clear', '清空字典'], ['copy', '浅复制'], ['fromkeys', '按键创建']]
  }),
  makeProgrammingContent({
    id: 'programming-python-set', title: '集合方法', language: 'Python',
    items: [['add', '添加元素'], ['remove', '移除或报错'], ['discard', '安全移除'], ['pop', '移除任一项'], ['clear', '清空集合'], ['union', '并集'], ['intersection', '交集'], ['difference', '差集'], ['symmetric_difference', '对称差集'], ['issubset', '是否子集'], ['issuperset', '是否超集'], ['isdisjoint', '是否无交集'], ['update', '原位更新']]
  }),
  makeProgrammingContent({
    id: 'programming-python-exceptions', title: '异常与上下文', language: 'Python',
    items: [['try', '尝试执行'], ['except', '捕获异常'], ['else', '无异常执行'], ['finally', '最终执行'], ['raise', '抛出异常'], ['assert', '条件断言'], ['with', '上下文管理'], ['open', '打开文件'], ['close', '关闭资源'], ['read', '读取内容'], ['write', '写入内容']]
  }),
  makeProgrammingContent({
    id: 'programming-html-document', title: '文档结构标签', language: 'HTML',
    items: [['html', '文档根元素'], ['head', '文档信息'], ['body', '页面主体'], ['title', '页面标题'], ['meta', '元数据'], ['link', '外部资源'], ['style', '内嵌样式'], ['script', '脚本'], ['base', '基础地址'], ['noscript', '无脚本内容']]
  }),
  makeProgrammingContent({
    id: 'programming-html-semantic', title: '语义布局标签', language: 'HTML',
    items: [['header', '页眉'], ['nav', '导航'], ['main', '主要内容'], ['section', '章节'], ['article', '独立文章'], ['aside', '附属内容'], ['footer', '页脚'], ['address', '联系信息'], ['div', '通用块容器'], ['span', '通用行内容器']]
  }),
  makeProgrammingContent({
    id: 'programming-html-text', title: '文本标签', language: 'HTML',
    items: [['h1', '一级标题'], ['h2', '二级标题'], ['h3', '三级标题'], ['p', '段落'], ['br', '换行'], ['hr', '主题分隔'], ['strong', '重要文本'], ['em', '强调文本'], ['small', '附注文本'], ['mark', '高亮文本'], ['blockquote', '块引用'], ['q', '行内引用'], ['code', '代码'], ['pre', '预格式文本']]
  }),
  makeProgrammingContent({
    id: 'programming-html-list-table', title: '列表与表格标签', language: 'HTML',
    items: [['ul', '无序列表'], ['ol', '有序列表'], ['li', '列表项'], ['dl', '描述列表'], ['dt', '描述术语'], ['dd', '描述内容'], ['table', '表格'], ['caption', '表格标题'], ['thead', '表头区域'], ['tbody', '表体区域'], ['tfoot', '表尾区域'], ['tr', '表格行'], ['th', '表头单元格'], ['td', '数据单元格']]
  }),
  makeProgrammingContent({
    id: 'programming-html-form', title: '表单标签', language: 'HTML',
    items: [['form', '表单'], ['label', '字段标签'], ['input', '输入控件'], ['textarea', '多行输入'], ['button', '按钮'], ['select', '选择菜单'], ['option', '选择项'], ['optgroup', '选项分组'], ['fieldset', '字段分组'], ['legend', '分组标题'], ['datalist', '输入建议'], ['output', '计算结果'], ['progress', '进度'], ['meter', '度量值']]
  }),
  makeProgrammingContent({
    id: 'programming-html-media', title: '链接与媒体标签', language: 'HTML',
    items: [['a', '超链接'], ['img', '图片'], ['picture', '响应式图片'], ['source', '媒体来源'], ['audio', '音频'], ['video', '视频'], ['track', '字幕轨道'], ['figure', '独立内容'], ['figcaption', '内容说明'], ['iframe', '嵌入页面'], ['canvas', '画布'], ['svg', '矢量图']]
  }),
  makeProgrammingContent({
    id: 'programming-html-global-attributes', title: '全局属性', language: 'HTML',
    items: [['id', '唯一标识'], ['class', '类名'], ['style', '行内样式'], ['title', '补充信息'], ['lang', '内容语言'], ['dir', '文字方向'], ['hidden', '隐藏元素'], ['tabindex', '焦点顺序'], ['contenteditable', '允许编辑'], ['draggable', '允许拖动'], ['spellcheck', '拼写检查'], ['role', '无障碍角色']]
  }),
  makeProgrammingContent({
    id: 'programming-html-form-attributes', title: '表单属性', language: 'HTML',
    items: [['name', '字段名称'], ['value', '字段值'], ['type', '控件类型'], ['placeholder', '占位提示'], ['required', '必填'], ['disabled', '禁用'], ['readonly', '只读'], ['checked', '已选中'], ['selected', '已选择'], ['multiple', '允许多个'], ['min', '最小值'], ['max', '最大值'], ['maxlength', '最大长度'], ['autocomplete', '自动完成']]
  }),
  makeProgrammingContent({
    id: 'programming-html-link-media-attributes', title: '链接媒体属性', language: 'HTML',
    items: [['href', '链接地址'], ['target', '打开目标'], ['rel', '链接关系'], ['download', '下载文件'], ['src', '资源地址'], ['alt', '替代文本'], ['width', '宽度'], ['height', '高度'], ['loading', '加载策略'], ['controls', '播放控件'], ['autoplay', '自动播放'], ['loop', '循环播放'], ['muted', '静音'], ['poster', '视频封面']]
  }),
  makeProgrammingContent({
    id: 'programming-css-selectors', title: '选择器与状态', language: 'CSS',
    items: [['class', '类选择器'], ['id', 'ID 选择器'], ['attribute', '属性选择器'], ['hover', '悬停状态'], ['focus', '焦点状态'], ['active', '激活状态'], ['checked', '选中状态'], ['disabled', '禁用状态'], ['first-child', '第一个子项'], ['last-child', '最后子项'], ['nth-child', '指定子项'], ['not', '排除匹配']]
  }),
  makeProgrammingContent({
    id: 'programming-css-box', title: '盒模型', language: 'CSS',
    items: [['width', '宽度'], ['height', '高度'], ['min-width', '最小宽度'], ['max-width', '最大宽度'], ['margin', '外边距'], ['padding', '内边距'], ['border', '边框'], ['box-sizing', '尺寸计算'], ['overflow', '溢出处理'], ['visibility', '可见性'], ['opacity', '透明度'], ['box-shadow', '盒阴影']]
  }),
  makeProgrammingContent({
    id: 'programming-css-display-position', title: '显示与定位', language: 'CSS',
    items: [['display', '显示类型'], ['block', '块级显示'], ['inline', '行内显示'], ['none', '不显示'], ['position', '定位方式'], ['relative', '相对定位'], ['absolute', '绝对定位'], ['fixed', '视口固定'], ['sticky', '粘性定位'], ['top', '顶部偏移'], ['right', '右侧偏移'], ['bottom', '底部偏移'], ['left', '左侧偏移'], ['z-index', '层叠顺序']]
  }),
  makeProgrammingContent({
    id: 'programming-css-flex', title: 'Flex 布局', language: 'CSS',
    items: [['flex', '弹性布局'], ['flex-direction', '主轴方向'], ['flex-wrap', '是否换行'], ['flex-flow', '方向与换行'], ['justify-content', '主轴对齐'], ['align-items', '交叉轴对齐'], ['align-content', '多行对齐'], ['gap', '项目间距'], ['order', '排列顺序'], ['flex-grow', '放大比例'], ['flex-shrink', '缩小比例'], ['flex-basis', '基础尺寸'], ['align-self', '单项对齐']]
  }),
  makeProgrammingContent({
    id: 'programming-css-grid', title: 'Grid 布局', language: 'CSS',
    items: [['grid', '网格布局'], ['grid-template-columns', '列轨道'], ['grid-template-rows', '行轨道'], ['grid-template-areas', '命名区域'], ['grid-column', '列位置'], ['grid-row', '行位置'], ['grid-area', '区域位置'], ['gap', '网格间距'], ['place-items', '项目对齐'], ['place-content', '整体对齐'], ['minmax', '尺寸范围'], ['repeat', '重复轨道'], ['fr', '剩余空间单位']]
  }),
  makeProgrammingContent({
    id: 'programming-css-text', title: '字体与文本', language: 'CSS',
    items: [['color', '文字颜色'], ['font-family', '字体族'], ['font-size', '字号'], ['font-weight', '字重'], ['font-style', '字体样式'], ['line-height', '行高'], ['letter-spacing', '字间距'], ['text-align', '水平对齐'], ['text-decoration', '文本装饰'], ['text-transform', '大小写转换'], ['white-space', '空白处理'], ['word-break', '换行规则'], ['text-overflow', '溢出文本']]
  }),
  makeProgrammingContent({
    id: 'programming-css-background', title: '背景与边框', language: 'CSS',
    items: [['background', '背景简写'], ['background-color', '背景颜色'], ['background-image', '背景图片'], ['background-size', '背景尺寸'], ['background-position', '背景位置'], ['background-repeat', '背景重复'], ['border-width', '边框宽度'], ['border-style', '边框样式'], ['border-color', '边框颜色'], ['border-radius', '圆角'], ['outline', '轮廓线'], ['linear-gradient', '线性渐变'], ['radial-gradient', '径向渐变']]
  }),
  makeProgrammingContent({
    id: 'programming-css-motion', title: '变换与动画', language: 'CSS',
    items: [['transform', '元素变换'], ['translate', '平移'], ['rotate', '旋转'], ['scale', '缩放'], ['transition', '过渡'], ['transition-duration', '过渡时长'], ['animation', '动画简写'], ['animation-name', '动画名称'], ['animation-duration', '动画时长'], ['animation-delay', '动画延迟'], ['animation-iteration-count', '播放次数'], ['keyframes', '关键帧'], ['will-change', '变化提示']]
  }),
  makeProgrammingContent({
    id: 'programming-css-responsive', title: '响应式与变量', language: 'CSS',
    items: [['media', '媒体查询'], ['supports', '特性查询'], ['container', '容器查询'], ['orientation', '屏幕方向'], ['prefers-color-scheme', '颜色偏好'], ['prefers-reduced-motion', '减少动效偏好'], ['var', '读取变量'], ['calc', '计算表达式'], ['clamp', '限制范围'], ['min', '取最小值'], ['max', '取最大值'], ['rem', '根字号单位'], ['vw', '视口宽度单位'], ['vh', '视口高度单位']]
  }),
  makeDialogueContent({
    id: 'dialogue-progress',
    title: '老板：进度沟通',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '老板，这个需求今天能不能发版？',
        reply: '先把影响上线的问题列出来，今天下午三点前给我一个明确结论。'
      },
      {
        incoming: '还有一个展示问题，优先级要不要往后放？',
        reply: '这个可以延后，但客户反馈的问题先不要拖，处理完再同步结果。'
      },
      {
        incoming: '如果测试那边还没回，我要不要继续等？',
        reply: '辛苦你先推进，有阻塞直接说，不要等到最后一分钟。'
      },
      {
        incoming: '研发说还有一个接口没联调完，今晚可能要加班。',
        reply: '先判断它是不是主流程，如果影响用户下单，就把联调排到最高优先级。'
      },
      {
        incoming: '那我需要同步给客户吗？',
        reply: '需要，但不要只说延期。把当前进度、风险和新的确认时间一起发过去。'
      },
      {
        incoming: '如果客户继续催呢？',
        reply: '你先稳住预期，告诉对方我们正在处理关键问题，避免上线后再返工。'
      },
      {
        incoming: '明天早会我要怎么汇报这件事？',
        reply: '按完成项、未完成项、风险和下一步四部分讲，重点说明今天能关闭哪些问题。'
      },
      {
        incoming: '版本上线以后还需要继续跟吗？',
        reply: '需要，至少观察一个完整业务高峰，确认数据和用户反馈正常后再宣布结束。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-feedback',
    title: '老板：反馈调整',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '老板，我把首页文案改了一版，您看方向可以吗？',
        reply: '方向是对的，但表达还可以再直接一点，先把结论放在第一句。'
      },
      {
        incoming: '那我要不要顺手把设置页也重做一下？',
        reply: '这版先不用加新功能，重点把已有流程做顺，减少用户理解成本。'
      },
      {
        incoming: '好的，那我什么时候再给您看？',
        reply: '你明天上午给我看一个调整后的版本，我们再定最终方案。'
      },
      {
        incoming: '这次要不要把竞品截图也放进去？',
        reply: '可以放，但不要堆太多。只保留能说明差异的两三张截图。'
      },
      {
        incoming: '我担心页面看起来太空。',
        reply: '空不是问题，信息不清楚才是问题。先保证用户一眼知道能做什么。'
      },
      {
        incoming: '调整以后需要找用户再看一次吗？',
        reply: '需要，找两三个第一次接触产品的人，让他们说出看到页面后的第一反应。'
      },
      {
        incoming: '如果他们的意见彼此矛盾怎么办？',
        reply: '先看意见背后的使用目标，不要按人数投票，优先解决反复出现的理解障碍。'
      },
      {
        incoming: '最终版本由谁来确认比较合适？',
        reply: '你整理修改前后的差异和验证结果，我看完关键取舍后给最终确认。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-meeting',
    title: '老板：会议安排',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '老板，下午的会需要准备哪些内容？',
        reply: '会议控制在半小时内，先讲结论，再讲风险和需要我拍板的点。'
      },
      {
        incoming: '需要把整个项目组都拉进来吗？',
        reply: '不用所有人都参加，研发、产品和测试各来一个能定事的人就行。'
      },
      {
        incoming: '会议纪要有什么要求？',
        reply: '会后把待办、负责人和时间点发出来，今天内同步到群里。'
      },
      {
        incoming: '如果会上又开始讨论细节怎么办？',
        reply: '你提醒大家先定方向，细节会后拉小群解决，不要占用所有人的时间。'
      },
      {
        incoming: '需要提前发材料吗？',
        reply: '需要，至少提前一小时发。让大家带着问题来，不要现场才开始看。'
      },
      {
        incoming: '有人临时不能参加应该怎么办？',
        reply: '请他提前留下意见并指定代替人，不能因为一个人缺席就让所有决策停下来。'
      },
      {
        incoming: '会上有两个方案一直定不下来。',
        reply: '把成本、收益和风险摆在同一张表里，今天先定可逆的部分，争议项单独跟进。'
      },
      {
        incoming: '会后发现结论理解不一致呢？',
        reply: '马上在纪要里写清最终结论和不做什么，让所有负责人逐项确认，不要靠口头回忆。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-client-delay',
    title: '老板：延期应对',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '客户问为什么这次交付又推迟了。',
        reply: '先向客户说明原因，再给出新的时间点和我们正在做的补救措施。'
      },
      {
        incoming: '要不要把技术细节都解释清楚？',
        reply: '不用讲太细。客户关心的是影响、时间和结果，不是内部实现过程。'
      },
      {
        incoming: '对方语气比较着急，我怎么回更合适？',
        reply: '语气要稳，先承认影响，再说明我们会每天同步一次处理进展。'
      },
      {
        incoming: '如果客户要求赔偿呢？',
        reply: '不要当场承诺。先记录诉求，我来评估合同条款和可接受范围。'
      },
      {
        incoming: '那今天下班前我要发什么？',
        reply: '发一版简短进度，包含已完成事项、剩余风险、负责人和下一次更新时间。'
      },
      {
        incoming: '客户要求我们每天开一次进度会。',
        reply: '可以先执行三天，但会议只处理决策问题，常规进度用书面方式同步。'
      },
      {
        incoming: '内部团队觉得客户要求不合理。',
        reply: '先把情绪和事实分开，明确哪些要求超出合同，再带着替代方案去沟通。'
      },
      {
        incoming: '这次延期结束后需要复盘吗？',
        reply: '需要，重点找最早出现却没被处理的信号，并把预警时间写进后续计划。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-client-requirement',
    title: '老板：需求管理',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '客户临时加了一个需求，说最好这周一起做完。',
        reply: '先不要直接答应。让客户确认这是新增需求，还是原需求的必要条件。'
      },
      {
        incoming: '他们说这个功能很简单。',
        reply: '你先拆成页面、接口、测试和上线四部分，告诉对方简单不等于没有成本。'
      },
      {
        incoming: '那我应该怎么安排优先级？',
        reply: '先保住原计划。如果新增需求必须做，就同步会影响哪些交付内容。'
      },
      {
        incoming: '需要开会确认吗？',
        reply: '需要，十五分钟就够。会后把变更范围和时间影响写成文字确认。'
      },
      {
        incoming: '如果客户不愿意签确认呢？',
        reply: '那就不要排进本周版本，口头需求不能直接进入开发。'
      },
      {
        incoming: '客户说竞品已经有这个功能了。',
        reply: '先确认他们真正需要的结果，不要因为竞品有就直接照搬它的实现方式。'
      },
      {
        incoming: '需求确认后又有人提出不同意见。',
        reply: '把新意见记录成下一次变更，不要悄悄改掉已经确认的范围和验收标准。'
      },
      {
        incoming: '怎样才算这次需求沟通结束？',
        reply: '目标、范围、负责人、交付时间和验收方式都有书面结论，才算真正结束。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-interview',
    title: '面试官：经历追问',
    category: '对话·面试问答',
    incomingRole: '候选人',
    replyRole: '面试官',
    messages: [
      {
        incoming: '我上一份工作主要负责团队日常运营，也参与过几个重要项目。',
        reply: '你提到参与过重要项目，能具体说说你负责哪一部分，以及最后取得了什么结果吗？'
      },
      {
        incoming: '我负责协调进度，项目最后按时完成，客户也比较满意。',
        reply: '如果去掉团队共同完成的部分，你个人做出的关键判断是什么，依据又是什么？'
      },
      {
        incoming: '有一次合作部门迟迟没有反馈，我主动联系负责人推动了进度。',
        reply: '当时双方的优先级有什么冲突，你采取了哪些动作，又如何确认问题真正解决了？'
      },
      {
        incoming: '遇到意见不一致时，我一般会先听完大家的想法再决定。',
        reply: '请讲一个你没有采纳多数意见的例子，你承担了什么风险，结果怎么样？'
      },
      {
        incoming: '我最大的不足是有时太关注细节，现在已经在调整。',
        reply: '这个不足最近一次影响工作是什么时候，你具体用了什么办法避免再次发生？'
      },
      {
        incoming: '没有经验的任务我也愿意尝试，我的学习能力比较强。',
        reply: '请用一个实际案例说明你如何拆解陌生任务，以及多久拿出了第一个可验证结果。'
      },
      {
        incoming: '我曾经有个目标没有完成，后来通过加班把差距补了回来。',
        reply: '除了增加工作时间，你从那次失败中改变了哪个工作方法，后续效果如何？'
      },
      {
        incoming: '我希望下一份工作能有成长空间，也能接触更有挑战的事情。',
        reply: '如果加入团队，你希望半年后能独立承担什么责任，又准备如何证明自己做到了？'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-daily',
    title: '老板：状态关心',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '今天状态怎么样？',
        reply: '还可以，上午先把重要的事情处理完，下午再看剩下的细节。'
      },
      {
        incoming: '最近是不是有点累？',
        reply: '确实有点累，不过问题不大，我会把节奏调慢一点，先保证质量。'
      },
      {
        incoming: '晚上还要继续看吗？',
        reply: '不用太晚，今天把关键结论定下来就行，剩下的明天继续。'
      },
      {
        incoming: '要不要一起点杯咖啡？',
        reply: '可以，正好休息十分钟，回来再把最后一段收尾。'
      },
      {
        incoming: '那今天辛苦了。',
        reply: '不辛苦，今天进展还不错，明天我再把结果整理一下。'
      },
      {
        incoming: '周末有什么放松的安排吗？',
        reply: '准备出去走走，也留一点时间看书，先让注意力从工作里彻底离开。'
      },
      {
        incoming: '最近天气变化大，你要注意休息。',
        reply: '谢谢提醒，我会早点收工，也提醒大家别为了不紧急的事情连续熬夜。'
      },
      {
        incoming: '下周事情很多，会不会太赶？',
        reply: '先把最重要的两件事排好，其他任务留出余量，节奏稳定比排满更重要。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-service-refund',
    title: '老板：售后管理',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '用户说用了以后没有效果，要求退款。',
        reply: '先确认用户遇到的具体问题，再判断是使用方式问题还是产品本身问题。'
      },
      {
        incoming: '如果用户一直情绪很激动怎么办？',
        reply: '先不要争辩，明确告诉用户我们会处理，并把可选方案列出来。'
      },
      {
        incoming: '需要马上同意退款吗？',
        reply: '按规则来。符合条件就快速处理，不符合条件就解释原因和替代方案。'
      },
      {
        incoming: '用户说要发差评。',
        reply: '不要被威胁带节奏，继续保持礼貌，把问题、证据和处理结果记录完整。'
      },
      {
        incoming: '处理完以后还要跟进吗？',
        reply: '要跟进一次，确认用户是否还需要帮助，也方便我们复盘问题来源。'
      },
      {
        incoming: '同类问题今天已经出现三次了。',
        reply: '先建立统一回复，再把案例交给产品排查，不要让每个客服重复摸索。'
      },
      {
        incoming: '用户接受方案以后还需要记录什么？',
        reply: '记录问题原因、采用的方案和用户最终反馈，后面才能判断问题有没有真正减少。'
      },
      {
        incoming: '这类问题要不要主动通知其他用户？',
        reply: '先确认影响范围，如果会造成损失就主动通知，并把处理方法说清楚。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-retrospective',
    title: '老板：项目复盘',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '老板，这次项目已经上线了，复盘从哪里开始？',
        reply: '先回到最初目标，看结果是否达成，再讨论过程，不要一开始就追究个人责任。'
      },
      {
        incoming: '数据基本达标，但上线时间晚了三天。',
        reply: '把延期原因按决策、协作和执行拆开，找出最早可以发现问题的那个节点。'
      },
      {
        incoming: '有些同事担心复盘会变成批评会。',
        reply: '提前说明复盘针对流程和事实，每个问题都要落到下一次可以改变的动作上。'
      },
      {
        incoming: '做得好的部分也需要专门记录吗？',
        reply: '当然需要，稳定有效的方法要保留下来，还要说明它在什么条件下可以复用。'
      },
      {
        incoming: '问题很多，会议时间可能不够。',
        reply: '先按影响大小排序，只讨论前三个关键问题，其余内容放进后续行动清单。'
      },
      {
        incoming: '负责人应该在会上直接确定吗？',
        reply: '能确定的当场确定，每个行动都要有负责人、完成时间和可以检查的结果。'
      },
      {
        incoming: '如果大家对原因判断不一致呢？',
        reply: '回到时间线和原始记录，用事实验证假设，暂时无法确认的就标成待调查。'
      },
      {
        incoming: '复盘结束以后怎样避免不了了之？',
        reply: '两周后安排一次短检查，只看行动是否完成，以及同类问题有没有再次出现。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-cross-team',
    title: '老板：跨部门协作',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '另一个部门一直没有回复，我们的计划被卡住了。',
        reply: '先把需要对方提供的内容、截止时间和影响写清楚，再发一次正式同步。'
      },
      {
        incoming: '我已经在群里提醒过两次了。',
        reply: '不要只发提醒，直接找到对应负责人，确认他是否理解任务和优先级。'
      },
      {
        incoming: '对方说他们也有更紧急的事情。',
        reply: '请双方列出业务影响，如果优先级仍有冲突，就把选择带给共同负责人决定。'
      },
      {
        incoming: '要不要先绕开他们自己做一版？',
        reply: '可以准备临时方案，但先评估重复成本，别让短期绕行变成长期维护负担。'
      },
      {
        incoming: '沟通过程里双方语气有点僵。',
        reply: '先停止在群里争论，约十分钟直接沟通目标，把对人的判断换成对问题的描述。'
      },
      {
        incoming: '责任边界一直说不清楚怎么办？',
        reply: '把输入、输出和交接条件写成清单，双方确认以后作为这次协作的边界。'
      },
      {
        incoming: '这次解决后还需要建立固定流程吗？',
        reply: '如果同类协作会重复发生，就固定联系人、响应时间和升级路径。'
      },
      {
        incoming: '我应该怎么向团队同步最终结果？',
        reply: '说明达成了什么、谁负责下一步以及还有哪些风险，不需要复述争论过程。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-client-quotation',
    title: '老板：报价管理',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '客户让我们今天就给出最终报价。',
        reply: '先确认范围、交付时间和服务边界，没有这些条件，数字看起来再快也不可靠。'
      },
      {
        incoming: '对方只想先知道一个大概区间。',
        reply: '可以给区间，但要写明估算依据和不包含的部分，避免它被当成正式承诺。'
      },
      {
        incoming: '客户说我们的价格比另一家高。',
        reply: '不要马上降价，先比较交付内容、质量标准和后续服务是不是同一个范围。'
      },
      {
        incoming: '如果预算确实不够，可以删哪些内容？',
        reply: '先保留解决核心问题的部分，把装饰性需求和低频场景放到后续阶段。'
      },
      {
        incoming: '付款方式需要在报价里写吗？',
        reply: '需要，付款节点、税费、有效期和变更规则都要写清楚，减少后续争议。'
      },
      {
        incoming: '客户希望我们承诺额外的免费修改。',
        reply: '可以约定合理次数，但必须定义修改范围，新增目标不能算在免费调整里。'
      },
      {
        incoming: '报价发出以后多久跟进合适？',
        reply: '第二个工作日确认对方是否收到，并询问阻碍决策的问题，不要只问考虑得怎么样。'
      },
      {
        incoming: '客户口头同意了，可以马上开始吗？',
        reply: '先拿到书面确认和约定的首付款，再安排正式启动和交付资源。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-recruiting',
    title: '老板：招聘沟通',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '这个岗位的招聘要求要怎么写？',
        reply: '先写入职后要解决的问题，再列真正必需的能力，不要把所有优点都写成门槛。'
      },
      {
        incoming: '工作年限是不是越高越合适？',
        reply: '年限只能参考，更重要的是候选人处理过多复杂的问题，以及结果是否可信。'
      },
      {
        incoming: '简历很多，我应该先筛什么？',
        reply: '先看经历是否与岗位目标相关，再看他能不能清楚说明自己的责任和贡献。'
      },
      {
        incoming: '面试问题需要统一吗？',
        reply: '核心问题要统一，方便公平比较；追问可以根据候选人的真实经历展开。'
      },
      {
        incoming: '候选人回答得很好，但比较紧张。',
        reply: '紧张不代表能力不足，给他一点思考时间，继续用具体案例验证判断。'
      },
      {
        incoming: '两位候选人各有优点，很难选择。',
        reply: '回到岗位最重要的三项任务，比较谁能更快独立承担，而不是比较谁更会表达。'
      },
      {
        incoming: '需要向没有通过的人说明原因吗？',
        reply: '可以给简洁、尊重且与岗位相关的反馈，不评价性格，也不要做无法兑现的承诺。'
      },
      {
        incoming: '候选人接受邀请后还要做什么？',
        reply: '及时确认入职材料、报到安排和第一周计划，让对方在入职前就知道下一步。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-leave',
    title: '老板：请假安排',
    category: '对话·工作管理',
    messages: [
      {
        incoming: '老板，我下周需要请两天假。',
        reply: '可以，先告诉我具体日期和当前任务情况，我们一起把交接安排好。'
      },
      {
        incoming: '有一项工作刚好会在请假期间到期。',
        reply: '先看能否提前完成，不能的话就明确交给谁，并把背景和进度整理完整。'
      },
      {
        incoming: '我需要一直保持在线吗？',
        reply: '正常休假不用一直在线，只留下真正紧急事项的联系方式和判断标准。'
      },
      {
        incoming: '同事最近也比较忙，交接给谁合适？',
        reply: '不要只看谁有空，要找最了解上下文的人，同时减少他这两天的其他任务。'
      },
      {
        incoming: '交接文档需要写到多详细？',
        reply: '写清当前状态、下一步、风险和相关联系人，让接手的人不用反复找你确认。'
      },
      {
        incoming: '如果临时出现问题怎么办？',
        reply: '先由交接人按预案处理，只有涉及重大损失且无法判断时再联系你。'
      },
      {
        incoming: '回来以后需要专门开会同步吗？',
        reply: '先看交接记录，重要变化再用十分钟同步，不必为了形式额外开长会。'
      },
      {
        incoming: '那我今天就把请假申请提交。',
        reply: '好，提交后把交接清单发给相关同事，确认无遗漏就安心休息。'
      }
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-friends-weekend', title: '朋友：周末约饭', category: '对话·日常聊天', incomingRole: '朋友', replyRole: '我',
    pairs: [
      ['这周末有空吗？好久没一起吃饭了。', '有空呀，我也正想找你聊聊，周六晚上怎么样？'],
      ['周六可以，你最近有没有特别想吃的？', '我想吃点清淡的，你知道那家新开的云南菜吗？'],
      ['听说过，不过好像要提前排队，我们几点去？', '那就五点半见吧，早点过去应该不用等太久。'],
      ['行，要不要再叫上小林和阿杰一起？', '可以，你在群里问一声，看他们当天有没有安排。'],
      ['小林说能来，阿杰晚上可能要加班。', '那我们先订三个人的位置，他下班早的话再过来。'],
      ['吃完饭之后要不要顺便去附近逛逛？', '好啊，附近正好有个夜市，我们可以过去走一圈。'],
      ['你还记得上次夜市买的那个奇怪摆件吗？', '当然记得，现在还放在我桌上，每次看到都想笑。'],
      ['那就这么定了，周六出发前我再联系你。', '没问题，我会提前到，到时候在餐厅门口等你们。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-besties-hearttalk', title: '闺蜜：烦恼倾诉', category: '对话·日常聊天', incomingRole: '闺蜜', replyRole: '我',
    pairs: [
      ['我今天心情特别差，感觉做什么都不顺。', '先别一个人憋着，你慢慢说，我现在有时间听你讲。'],
      ['上午被领导批评了，明明不全是我的问题。', '被误解确实很难受，你当时有没有机会把情况说清楚？'],
      ['我一紧张就没说出来，回来以后越想越委屈。', '那就先把事实写下来，等情绪稳一点再找合适机会沟通。'],
      ['可我怕再提这件事，会显得自己特别计较。', '说明事实不等于计较，语气平和、重点清楚就可以了。'],
      ['你每次都能把我从情绪里拉出来一点。', '因为我知道你不是没能力，只是今天刚好遇到了难题。'],
      ['晚上能陪我出去走走吗？我不想待在家里。', '当然可以，我去找你，我们边走边聊，不着急做决定。'],
      ['那我请你喝奶茶，算是今天的情绪补偿。', '奶茶可以喝，不过你不用补偿我，陪你本来就是应该的。'],
      ['谢谢你，跟你说完以后感觉轻松多了。', '这就对了，今晚先好好休息，明天再处理明天的事情。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-guys-game', title: '男生朋友：约球开黑', category: '对话·日常聊天', incomingRole: '哥们', replyRole: '我',
    pairs: [
      ['晚上有空没？我们准备去球场打一会儿。', '有空，我吃完饭就过去，你们大概几点开始打？'],
      ['七点左右，还是上次那个室外球场。', '行，我带两瓶水过去，顺便把篮球也拿上。'],
      ['今天人不多，估计只能打半场三对三。', '三对三也挺好，正好少跑一点，先活动开再打。'],
      ['你上次扭到的脚怎么样了，能正常跑吗？', '已经没事了，不过我今天会控制一下，不做太猛的动作。'],
      ['打完要不要去我家开两局游戏？', '可以，不过别玩得太晚，我明天早上还有事情。'],
      ['放心，十一点前结束，输了的人请夜宵。', '你先别急着立规矩，上次说请客的人好像也是你。'],
      ['上次那是意外，今天我肯定能赢回来。', '行，那就看你表现，输了可别又找网络当借口。'],
      ['就这么说定了，你出门的时候在群里说一声。', '收到，我换好衣服就走，大概二十分钟以后到。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-girls-trip', title: '女生朋友：旅行计划', category: '对话·日常聊天', incomingRole: '朋友', replyRole: '我',
    pairs: [
      ['下个月的小长假，要不要一起出去玩几天？', '可以呀，我正想换个地方放松一下，你有想去的城市吗？'],
      ['我在海边和古城之间犹豫，你更喜欢哪个？', '如果只有三天，我更想去古城，路上花的时间会少一点。'],
      ['我也是这么想的，而且那边最近天气正舒服。', '那我们先看看车票和住宿，再决定具体哪一天出发。'],
      ['住宿想住安静一点的，离景点远点也没关系。', '好，我筛几家评价稳定的民宿，晚上把链接发给你。'],
      ['行程不要排太满，我不想每天都早起赶景点。', '赞同，每天安排一两个地方，剩下时间随便逛逛就好。'],
      ['要不要专门找一天拍照？我想带几套衣服。', '可以，我们挑光线好的傍晚，其他时候轻装出门更方便。'],
      ['预算先定一下吧，免得到时候花得没数。', '每人先按两千左右准备，车票和住宿确定后再调整。'],
      ['好期待，我今晚就开始整理想去的店。', '你负责收藏吃的，我负责路线，周末我们一起把计划定下来。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-couple-dinner', title: '情侣：晚餐与沟通', category: '对话·日常聊天', incomingRole: '恋人', replyRole: '我',
    pairs: [
      ['今晚想吃什么？我下班以后可以顺路买菜。', '想吃你上次做的番茄牛腩，我可以提前回去准备配菜。'],
      ['可以，不过牛腩要炖很久，可能会晚一点吃饭。', '没关系，我们慢慢做，饿了就先吃点水果垫一下。'],
      ['你今天工作顺利吗？中午看你消息有点少。', '下午一直在开会，不是故意不回你，现在已经处理完了。'],
      ['我知道，只是有时候等不到消息会有一点担心。', '以后忙之前我先告诉你一声，免得你不知道我在做什么。'],
      ['好，我也会少一点胡思乱想，有事直接问你。', '这样最好，我们把感受说出来，比互相猜来猜去轻松。'],
      ['周末要不要回去看看爸妈，他们昨天问起你了。', '可以，我们周六上午过去，顺便带点他们喜欢的水果。'],
      ['那周日就不安排事情了，在家休息一天。', '好啊，最近都挺忙的，留一天什么都不做也很好。'],
      ['听起来很舒服，我买好菜就早点回家。', '路上慢一点，不着急，我先回去把米饭和配菜准备好。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-client-product', title: '客户：产品功能咨询', category: '对话·客户沟通', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['你好，我想了解一下你们这个产品主要能做什么？', '您好，这款产品主要用于记录、整理和同步日常工作资料。'],
      ['手机和电脑可以同时使用吗？数据会同步吗？', '可以，同一账户登录后会自动同步，您也可以手动刷新。'],
      ['如果没有网络，还能继续查看以前的内容吗？', '已经缓存的内容可以查看，新修改会在恢复网络后同步。'],
      ['我可以把现有文件一次性导入进去吗？', '支持常见文档批量导入，单次文件数量和大小会有限制。'],
      ['团队里不同成员能设置不一样的权限吗？', '可以设置管理员、编辑者和只读成员，并单独调整权限。'],
      ['以后不使用了，里面的数据能全部导出来吗？', '可以在设置中导出数据，我们也提供账户注销和删除功能。'],
      ['你们有没有试用期？我想先让团队体验一下。', '目前提供十四天试用，试用期间可以体验主要协作功能。'],
      ['好的，那我先注册试用，有问题再来咨询。', '好的，注册过程中遇到任何问题，都可以随时联系我们。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-client-account', title: '客户：账户登录问题', category: '对话·客户沟通', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['我换了手机以后登录不上，一直提示验证失败。', '您好，我先帮您确认账户，请问登录使用的是手机号吗？'],
      ['对，就是现在这个手机号，但收不到验证码。', '请先检查短信拦截记录，并确认手机信号和号码状态正常。'],
      ['拦截记录里没有，其他平台的验证码可以收到。', '了解，我为您重新发送一次，请在一分钟内留意新的短信。'],
      ['这次收到了，但是输入以后提示验证码已过期。', '可能使用了上一条验证码，请输入最新短信中的六位数字。'],
      ['现在可以登录了，不过原来的资料没有显示。', '请确认登录方式与旧设备一致，微信登录和手机号是不同账户。'],
      ['我以前好像是用微信登录的，那要怎么合并？', '您可以先退出当前账户，再使用微信登录后绑定这个手机号。'],
      ['绑定以后，手机号登录也能看到同一份资料吗？', '是的，绑定成功后两种方式都会进入同一个账户。'],
      ['明白了，谢谢，我现在按照这个步骤操作。', '不客气，如果资料仍未恢复，请把页面截图发给我们核查。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-client-plan', title: '客户：套餐价格咨询', category: '对话·客户沟通', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['个人版和团队版有什么区别，应该怎么选择？', '个人版适合独立使用，团队版增加成员管理和协作权限。'],
      ['团队版是按照账户数量收费，还是统一价格？', '团队版按照实际成员数量计费，管理员可以随时增减席位。'],
      ['如果中途增加成员，费用从什么时候开始计算？', '新增席位会按剩余周期折算，不会重复收取已过去的费用。'],
      ['年付是否有优惠？可以先月付再转年付吗？', '年付价格更优惠，月付用户也可以随时升级为年付方案。'],
      ['升级后，之前月付剩下的时间会不会浪费？', '不会，未使用金额会自动抵扣升级后的订单费用。'],
      ['公司付款需要发票，你们支持开专票吗？', '支持电子普票和增值税专票，付款后可提交开票信息。'],
      ['如果使用一段时间不合适，可以申请退款吗？', '退款范围与使用时长有关，下单前页面会展示具体规则。'],
      ['了解了，我先申请试用，再决定购买哪种套餐。', '好的，试用期间有任何选型问题，我们都可以协助评估。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-client-feature', title: '客户：功能使用指导', category: '对话·客户沟通', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['我找不到批量导出的入口，是不是取消了？', '入口还在，请进入内容列表，先勾选需要导出的项目。'],
      ['我已经勾选了，但页面上还是没有导出按钮。', '请点击右上角的更多操作，批量导出就在展开菜单中。'],
      ['看到了，导出的文件可以选择不同格式吗？', '可以选择文档、表格或压缩包，具体选项取决于内容类型。'],
      ['图片也会一起下载吗？我需要完整保存资料。', '选择压缩包时会包含原始图片，文档格式会嵌入可用图片。'],
      ['导出过程中能关闭页面吗？内容比较多。', '建议保持页面打开，任务完成后浏览器会自动开始下载。'],
      ['如果导出失败，会不会影响原来的内容？', '不会，导出操作只读取数据，不会修改或删除原始内容。'],
      ['刚才提示有两个文件无法导出，该怎么处理？', '请查看失败列表，通常是文件损坏或当前账户没有查看权限。'],
      ['好的，我先检查权限，不行再联系你们。', '可以，若仍然失败，请提供任务编号，我们会继续为您排查。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-client-security', title: '客户：隐私安全咨询', category: '对话·客户沟通', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['我们准备存放内部资料，想确认数据是否安全。', '您好，数据传输和存储都会加密，并有严格的访问控制。'],
      ['平台员工能直接看到我们上传的文件内容吗？', '普通员工无法查看，只有授权排障且经审批后才能有限访问。'],
      ['管理员可以查看团队成员的哪些操作记录？', '管理员可查看登录、共享和权限变更等必要的安全日志。'],
      ['如果成员离职，怎样确保他不能继续访问？', '管理员移除成员后，其团队权限会立即失效并退出相关设备。'],
      ['是否支持双重验证，避免密码泄露后被登录？', '支持，您可以在安全设置中开启验证器或短信二次验证。'],
      ['我们删除文件以后，服务器还会保留多久？', '文件先进入回收站，彻底删除后会按备份周期逐步清除。'],
      ['能否下载你们的安全说明，给公司内部评估？', '可以，我稍后发送安全白皮书和常见合规问题说明。'],
      ['好的，收到资料后我们再联系你们确认。', '没问题，如需填写安全问卷，也可以发送给我们协助处理。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-support-refund', title: '售后：退款申请', category: '对话·客服售后', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['我昨天买的商品不合适，想申请退货退款。', '您好，可以的，请问商品是否使用过，包装和配件完整吗？'],
      ['只打开看了一下，没有使用，包装也都还在。', '好的，这种情况可以申请七天无理由退货，我来发起流程。'],
      ['退货运费需要我自己承担吗？怎么寄回去？', '无质量问题时需要您承担运费，页面会提供退货地址。'],
      ['我可以自己选择快递吗？需要购买保价吗？', '普通快递都可以，贵重商品建议保价并保留寄件凭证。'],
      ['寄出以后在哪里填写快递单号？', '进入退款详情，点击填写物流信息，提交快递公司和单号。'],
      ['你们收到货以后，大概多久可以退款？', '仓库验收通过后通常二十四小时内退款，原路退回账户。'],
      ['如果包装在运输中损坏，会影响退款吗？', '请妥善加固包装，运输损坏需要结合签收照片进一步确认。'],
      ['明白了，我今天寄出，之后再关注退款进度。', '好的，请及时填写物流单号，有异常我们会在订单里通知您。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-support-damaged', title: '售后：商品破损', category: '对话·客服售后', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['快递刚送到，但我打开以后发现商品已经破了。', '非常抱歉给您带来不便，请先不要丢弃包装和快递面单。'],
      ['我需要拍哪些照片，才能证明收到时就是坏的？', '请拍商品破损处、完整外包装、填充物和快递面单照片。'],
      ['已经拍好了，是直接在聊天窗口里发给你吗？', '可以，请把照片依次上传，我核实后为您提供处理方案。'],
      ['我比较着急使用，可以直接给我补发一个吗？', '可以优先申请补发，审核通过后我们会尽快安排新商品。'],
      ['坏掉的这个还需要寄回去吗？运费谁承担？', '是否寄回要看审核结果，如需寄回，运费会由商家承担。'],
      ['补发的商品大概什么时候可以发出？', '资料确认无误后预计今天发出，物流单号会同步到订单。'],
      ['如果第二次收到还是破损，我该怎么办？', '请再次联系我们，我们会升级处理并检查包装和运输环节。'],
      ['好的，照片已经全部上传，麻烦尽快处理。', '已经收到，我现在提交审核，预计一小时内给您明确回复。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-support-wrong-item', title: '售后：错发漏发', category: '对话·客服售后', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['我的订单买了两件商品，包裹里只有一件。', '您好，我先核对订单，请确认外包装有没有破损或拆封痕迹。'],
      ['包装是完整的，里面确实只放了一件商品。', '了解，请拍一下包裹内物品、包装和快递面单给我核实。'],
      ['照片发过去了，我买的是蓝色，收到的还是黑色。', '很抱歉，这个订单同时存在漏发和错发，我会优先处理。'],
      ['我不想退款，能不能把正确的两件重新发来？', '可以，我们核实后为您补发，并提供错发商品的退回方式。'],
      ['退回商品需要我先垫付快递费吗？', '不需要，我们会提供退货码，您到指定快递点直接寄回。'],
      ['补发会使用原来的收货地址吗？', '默认使用原地址，发货前我可以帮助您再次确认或修改。'],
      ['地址不用改，希望这次发货前仔细检查一下。', '已经为订单添加复核备注，仓库打包时会核对颜色和数量。'],
      ['好的，有物流信息以后麻烦通知我。', '没问题，补发出库后系统会自动发送物流信息和预计时间。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-support-repair', title: '售后：保修维修', category: '对话·客服售后', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['设备用了半年突然无法开机，还在保修期内吗？', '您好，请提供订单号或设备序列号，我先查询保修状态。'],
      ['订单号已经发给你了，是去年十二月购买的。', '查询到了，设备仍在一年保修期内，可以申请检测维修。'],
      ['送修之前有什么方法可以自己先检查吗？', '请先更换电源并长按开机键十秒，确认指示灯是否亮起。'],
      ['试过以后还是没有反应，指示灯也不亮。', '了解，建议寄回检测，我现在为您创建售后维修单。'],
      ['设备里的个人数据会不会在维修时丢失？', '维修可能需要重置设备，请尽量提前备份，工程师也会先评估。'],
      ['来回寄送的运费怎么处理？需要带哪些配件？', '保修故障由我们承担运费，只需寄送主机和必要的电源。'],
      ['一般检测和维修需要多长时间？', '签收后预计三个工作日完成检测，维修时间会另行通知。'],
      ['好的，请把寄送地址和注意事项发给我。', '售后单已经创建，地址、包装要求和寄件方式都在详情页。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-support-subscription', title: '售后：取消续费', category: '对话·客服售后', incomingRole: '客户', replyRole: '客服',
    pairs: [
      ['我发现账户开了自动续费，想把它关闭。', '您好，可以关闭，请问您是通过应用商店还是网页购买的？'],
      ['我是直接在网页上付款的，用的是支付宝。', '请进入账户设置里的订阅管理，点击关闭自动续费即可。'],
      ['关闭以后，已经支付的这个月还能继续使用吗？', '可以，关闭只影响下次扣费，当前权益会保留到到期日。'],
      ['我刚才找了一圈，没有看到订阅管理入口。', '请先确认登录的是付款账户，然后在设置中选择账单与订阅。'],
      ['现在看到了，页面提示下个月三号到期。', '是的，关闭成功后，三号之前仍然可以正常使用全部功能。'],
      ['到期以后我的历史数据会被删除吗？', '不会立即删除，账户会转为免费版，超出部分暂时只读保存。'],
      ['以后重新订阅，原来的设置还能恢复吗？', '可以，使用同一账户重新订阅后，原有数据和设置仍会保留。'],
      ['好的，我已经关闭了，谢谢你的说明。', '不客气，页面显示已关闭就不会再次扣费，您可以放心使用。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-interview-introduction', title: '面试：自我介绍', category: '对话·面试问答', incomingRole: '面试官', replyRole: '候选人',
    pairs: [
      ['请先用两三分钟简单介绍一下你自己。', '您好，我有三年产品运营经验，主要负责用户增长和活动策划。'],
      ['你为什么想从上一家公司离开？', '原岗位成长趋于稳定，我希望承担更完整的业务目标和项目责任。'],
      ['你对我们公司和这个岗位了解多少？', '我重点研究了产品用户和近期业务，也对岗位职责做了对应梳理。'],
      ['你认为自己最适合这个岗位的优势是什么？', '我的优势是能把复杂目标拆成行动，并持续用数据验证和调整。'],
      ['有没有哪项岗位要求是你目前不够熟悉的？', '行业经验还需要补充，但我已经开始整理资料并访谈相关从业者。'],
      ['如果入职，你希望前三个月完成什么？', '先理解业务和团队协作方式，再独立负责一个可衡量的小项目。'],
      ['你选择下一份工作时最看重哪些因素？', '我看重目标是否清晰、团队是否坦诚，以及个人能否持续成长。'],
      ['好的，自我介绍部分差不多了，你还有补充吗？', '暂时没有，感谢您的时间，我可以继续回答具体经历方面的问题。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-interview-project', title: '面试：项目经验', category: '对话·面试问答', incomingRole: '面试官', replyRole: '候选人',
    pairs: [
      ['请介绍一个你认为最有代表性的项目。', '我曾负责新用户激活项目，目标是在两个月内提高首周留存率。'],
      ['你在项目里具体负责哪些工作？', '我负责问题分析、方案设计、跨团队推进，以及上线后的数据复盘。'],
      ['项目开始时，你们遇到的核心问题是什么？', '用户注册后不知道下一步做什么，关键功能的首次使用率很低。'],
      ['你是怎样判断这个问题最值得优先解决的？', '我们结合行为数据和用户访谈，确认流失集中在首次使用阶段。'],
      ['你提出了什么方案，为什么选择这个方案？', '我设计了分步引导和示例任务，因为它能较低成本验证假设。'],
      ['推进过程中最大的阻力是什么？', '研发资源紧张，我把方案拆成两期，先上线最关键的验证部分。'],
      ['项目最后取得了怎样的结果？', '首周留存率提升八个百分点，关键功能使用率也明显提高。'],
      ['如果重新做一次，你会改变什么？', '我会更早定义分群指标，避免平均数据掩盖不同用户的差异。']
    ]
  }),
  makeDialogueScenario({
    id: 'dialogue-interview-career', title: '面试：职业规划', category: '对话·面试问答', incomingRole: '面试官', replyRole: '候选人',
    pairs: [
      ['你对未来三年的职业发展有什么规划？', '我希望先独立负责核心项目，再逐步形成可复用的方法和影响力。'],
      ['你更希望走专业路线还是管理路线？', '目前更偏专业路线，但也愿意承担项目协作和新人指导责任。'],
      ['你怎样判断自己是否取得了真正的成长？', '我会看能否解决更复杂的问题，并让成果不再依赖个人经验。'],
      ['如果工作内容和预期不完全一致怎么办？', '我会先理解业务需要，主动沟通目标，再寻找可以发挥价值的切入点。'],
      ['你能接受一段时间内重复性较高的工作吗？', '可以，但我也会观察流程，尝试通过工具和规范减少重复成本。'],
      ['什么情况会让你考虑再次更换工作？', '如果长期缺乏明确目标和反馈，并且沟通后仍没有改善，我会评估。'],
      ['你希望直属主管以什么方式和你合作？', '我希望目标和边界清楚，关键节点及时反馈，执行中保留自主空间。'],
      ['你还有什么想了解这个岗位的吗？', '我想了解团队当前最重要的目标，以及这个岗位半年后的成功标准。']
    ]
  })
]

const games = [
  {
    title: 'TypeRacer',
    group: '竞速类',
    description: '多人实时打字赛车，输入文章片段推动赛车，适合练压力下的连续输入。',
    href: 'https://play.typeracer.com/'
  },
  {
    title: 'Nitro Type',
    group: '竞速类',
    description: '更游戏化的打字赛车，有车辆、等级、任务和排行榜，适合持续刷速度。',
    href: 'https://www.nitrotype.com/'
  },
  {
    title: 'TypeBlast',
    group: '射击防守类',
    description: '街机式掉落单词射击游戏，主打连击、动态难度和排行榜。',
    href: 'https://typeblastgame.com/'
  },
  {
    title: 'Typing Attack',
    group: '射击防守类',
    description: '单词从上方落下，输入并按 Enter 或 Space 摧毁，支持不同难度。',
    href: 'https://oneyfy.com/games/typing-attack/'
  },
  {
    title: 'Typing Attack Zombie',
    group: '射击防守类',
    description: '僵尸携带单词向基地移动，输入目标单词完成防守，节奏压力更强。',
    href: 'https://typinggameshub.com/typing-attack/'
  },
  {
    title: 'Type Fighter',
    group: '格斗类',
    description: '把打字做成格斗游戏，输入单词攻击、连击、打 Boss，也有多人模式。',
    href: 'https://typefighter.net/'
  },
  {
    title: 'KeyStrike',
    group: '格斗类',
    description: '浏览器打字格斗，输入单词出招，防御词出现时快速输入即可格挡。',
    href: 'https://multi-toolkit.com/type-fighter/'
  },
  {
    title: 'Typing Fighter',
    group: '格斗类',
    description: '横版格斗打字游戏，输入屏幕句子蓄力攻击，适合短时间娱乐练习。',
    href: 'https://poki.com/en/g/typing-fighter'
  },
  {
    title: 'Monkeytype',
    group: '练习工具',
    description: '高自定义打字测试网站，支持多模式、实时 WPM、准确率、主题和账户历史。',
    href: 'https://monkeytype.com/',
    sourceHref: 'https://github.com/monkeytypegame/monkeytype'
  },
  {
    title: 'Qwerty Learner',
    group: '练习工具',
    description: '把单词记忆和键盘肌肉记忆结合起来，内置大量考试、程序员和语言词库。',
    href: 'https://qwerty.kaiyi.cool/',
    sourceHref: 'https://github.com/RealKai42/qwerty-learner'
  },
  {
    title: 'keybr.com',
    group: '练习工具',
    description: '根据按键表现生成针对性练习，适合补弱项、练节奏和盲打基础。',
    href: 'https://www.keybr.com/',
    sourceHref: 'https://github.com/aradzie/keybr.com'
  },
  {
    title: 'TypeWords',
    group: '练习工具',
    description: '中文开发者维护的开源单词与文章练习工具，覆盖背词、文章默写和错词复习。',
    href: 'https://typewords.cc/'
  },
  {
    title: 'Word Hopper',
    group: '儿童轻量类',
    description: '浏览器横版跳跃打字游戏，输入障碍物上的单词并把握空格跳跃时机。',
    href: 'https://wordhopper.wingedge777.com/'
  },
  {
    title: 'ZType',
    group: '射击防守类',
    description: '经典英文打字射击游戏，输入屏幕上的单词来击落敌人，节奏感强。',
    href: 'https://zty.pe/'
  },
  {
    title: 'RawType',
    group: '练习工具',
    description: '开源打字练习站，包含文章模式、单词模式、No-Mistake 和自定义练习。',
    href: 'https://rawtype.net/'
  },
  {
    title: 'CodeType',
    group: '练习工具',
    description: '面向开发者的 VS Code 打字游戏，使用真实代码片段训练符号和缩进。',
    href: 'https://codetype.ai/'
  },
  {
    title: 'Eletypes',
    group: '练习工具',
    description: '开源打字测试站，包含中文拼音、单词卡片、本地历史、主题和排行榜。',
    href: 'https://www.eletypes.com/',
    sourceHref: 'https://github.com/gamer-ai/eletypes-frontend'
  },
  {
    title: 'TYPE',
    group: '练习工具',
    description: '浏览器内自适应打字练习，根据表现解锁字母并提供基准测试。',
    href: 'https://type.review/',
    sourceHref: 'https://github.com/xiaolai/type-review'
  },
  {
    title: 'TypeQuest',
    group: '儿童轻量类',
    description: '面向儿童的离线中文打字游戏，包含关卡、存档、成就和键位训练。',
    href: 'https://wingwangsz.github.io/TypeQuest/',
    sourceHref: 'https://github.com/wingwangsz/TypeQuest'
  },
  {
    title: 'Tux Typing',
    group: '儿童轻量类',
    description: '经典 GPL 开源儿童打字游戏，包含 Fish Cascade 和 Comet Zap 等街机模式。',
    href: 'https://tuxtyping.org/',
    sourceHref: 'https://github.com/tux4kids/tuxtype'
  },
  {
    title: 'Typing Ninja',
    group: '儿童轻量类',
    description: '轻量忍者打字小游戏，选择单词长度后限时输入，适合入门和热身。',
    href: 'https://brush.ninja/play/typing/'
  },
  {
    title: 'Keyboard Ninja',
    group: '儿童轻量类',
    description: 'Typing.com 的切水果式键盘游戏，适合基础键位和儿童练习。',
    href: 'https://dev.typing.com/student/game/keyboard-ninja'
  },
  {
    title: 'Typing Rally',
    group: '游戏合集',
    description: '免费浏览器打字游戏合集，包含街机、节奏、创意和儿童类短局游戏。',
    href: 'https://typingrally.com/'
  },
  {
    title: 'FastFingers Games',
    group: '游戏合集',
    description: '打字小游戏集合，有 Falling Words、Keyboard Jump 等多种玩法。',
    href: 'https://www.fastfingers.in/game'
  },
  {
    title: 'The Typing Games',
    group: '游戏合集',
    description: '免费浏览器打字游戏目录，覆盖速度、动作、射击和轻量休闲玩法。',
    href: 'https://thetypinggames.com/free-typing-games'
  }
]

const defaultContents = [
  ...baseContents.filter(item => item.category !== '诗词'),
  ...poetryPracticeContents
]

Object.assign(window.OhMyType, { defaultContents, games })

})()
