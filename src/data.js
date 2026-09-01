(() => {
window.OhMyType = window.OhMyType || {}

function makeDialogueContent({ id, title, category, messages }) {
  return {
    id,
    title,
    category,
    body: messages.map(message => message.reply).join('\n'),
    messages
  }
}

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
  },
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
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-client-delay',
    title: '老板：客户延期',
    category: '对话·客户沟通',
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
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-client-requirement',
    title: '老板：需求确认',
    category: '对话·客户沟通',
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
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-interview',
    title: '老板：面试追问',
    category: '对话·面试问答',
    messages: [
      {
        incoming: '你这个项目里最难的问题是什么？',
        reply: '最难的是在功能增加以后保持结构简单，所以我把数据、状态和视图拆开处理。'
      },
      {
        incoming: '如果让你重做一遍，你会怎么改？',
        reply: '我会先补测试和边界场景，再考虑是否抽出更清晰的状态管理层。'
      },
      {
        incoming: '你怎么判断一个功能该不该做？',
        reply: '我会先看它是否解决真实流程里的阻塞，再评估维护成本和用户理解成本。'
      },
      {
        incoming: '遇到意见不一致怎么办？',
        reply: '先把分歧拆成事实、目标和取舍，再用最小可验证方案推进。'
      },
      {
        incoming: '你觉得自己最大的短板是什么？',
        reply: '我有时会过早进入实现细节，所以现在会先确认目标和验收标准。'
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-daily',
    title: '老板：日常聊天',
    category: '对话·日常聊天',
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
      }
    ]
  }),
  makeDialogueContent({
    id: 'dialogue-service-refund',
    title: '老板：售后处理',
    category: '对话·客服售后',
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
      }
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

Object.assign(window.OhMyType, { defaultContents, games })

})()
