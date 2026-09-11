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
    title: '老板：面试追问',
    category: '对话·面试问答',
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
    title: '老板：商务报价',
    category: '对话·客户沟通',
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
    category: '对话·面试问答',
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
    category: '对话·日常聊天',
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
