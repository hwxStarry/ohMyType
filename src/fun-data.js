(() => {
window.OhMyType = window.OhMyType || {}

const funModes = [
  {
    id: 'branching-story',
    icon: '◇',
    title: '剧情分支',
    description: '通过完整输入你选择的回复推动故事，不同决定会到达不同结局。',
    status: 'playable'
  },
  {
    id: 'detective',
    icon: '⌕',
    title: '侦探解谜',
    description: '输入证词收集线索，从矛盾中找出真相。',
    status: 'playable'
  },
  {
    id: 'memory',
    icon: '◉',
    title: '记忆闪打',
    description: '文字短暂出现后消失，凭记忆完整输入。',
    status: 'playable'
  },
  {
    id: 'idiom-chain',
    icon: '∞',
    title: '成语接龙',
    description: '根据上一个成语的尾字继续输入，挑战连击记录。',
    status: 'soon'
  }
]

const branchingStories = [
  {
    id: 'midnight-bookstore',
    title: '午夜书店的来信',
    description: '书店打烊前，一位浑身湿透的女孩来寻找一本不存在的书。',
    start: 'alarm',
    nodes: {
      alarm: {
        scene: '夜里十一点五十分，你正准备关闭书店。门铃突然响起，一位穿黄色雨衣的女孩走了进来。',
        speaker: '雨衣女孩',
        message: '书店要关门了吗？我只想找一本叫《没有名字的旅行》的书。',
        choices: [
          { text: '我可以陪你找十分钟，你还记得它在哪个书架吗？', next: 'rollback' },
          { text: '这本书听起来很特别，你为什么一定要今晚找到它？', next: 'investigate' }
        ]
      },
      rollback: {
        scene: '你们走到旅行文学区，最高层的书之间竟然夹着一封泛黄的信，信封上写着你的名字。',
        speaker: '雨衣女孩',
        message: '这封信为什么会写给你？你以前见过它吗？',
        choices: [
          { text: '既然信上写着我的名字，那就现在把它打开。', next: 'safe-ending' },
          { text: '先别打开，我想把它放回原处，继续找那本书。', next: 'phone-ending' }
        ]
      },
      investigate: {
        scene: '女孩说，母亲小时候每晚都会读这本书，并约定等她长大后一起来还。墙上的钟敲响十二下，女孩的身影开始变淡。',
        speaker: '雨衣女孩',
        message: '如果找不到它，我可能再也想不起那个故事的结局了。',
        choices: [
          { text: '我们分头找，你查书架，我去看橱窗和旧书箱。', next: 'late-ending' },
          { text: '先别找书了，你把还记得的故事讲给我听。', next: 'chaos-ending' }
        ]
      },
      'safe-ending': {
        ending: { title: '结局：写给未来的信', body: '信是十年前的你写的，信里提到了一个早已忘记的约定。当你读完最后一句，失踪的书从信封后面慢慢显现了出来。' }
      },
      'phone-ending': {
        ending: { title: '结局：书架的守密人', body: '你把信放回原处，书架却再也没有出现异常。女孩道谢后走入雨中。第二天早上，你发现柜台上多了一张写着“谢谢你保守秘密”的书签。' }
      },
      'late-ending': {
        ending: { title: '结局：找回的最后一页', body: '你在橱窗后的旧木箱里找到了那本书。女孩读完结局，身影在钟声中化成一片干燥的银杏叶，夹进了书的最后一页。' }
      },
      'chaos-ending': {
        ending: { title: '结局：被遗忘的读者', body: '女孩刚讲到故事的中间，门铃再次响起，她便消失了。借阅簿上显示，《没有名字的旅行》在二十年前就已由一位同名女孩归还。' }
      }
    }
  }
]

const detectiveCases = [
  {
    id: 'rain-gallery-theft',
    title: '雨夜画廊失窃案',
    description: '闭馆后的画廊停电数分钟，一幅小画从上锁展柜中消失。找出说谎的人和进入密室的证据。',
    statements: [
      {
        speaker: '周明',
        role: '保安',
        text: '晚上十点二十分画廊突然停电，我立刻把展厅门锁上，并把展柜钥匙封进值班室的信封。直到电力恢复，信封一直没有拆封。',
        clue: '展柜钥匙始终封存，没人能从外面打开展柜。'
      },
      {
        speaker: '林夏',
        role: '策展人',
        text: '停电时我在走廊等候，房间里一片漆黑。电力恢复前我进过展厅，还检查过画框旁的地面，确认那里当时是干的。',
        clue: '策展人声称在停电未恢复、展厅漆黑且上锁时检查过干燥地面。'
      },
      {
        speaker: '陈姨',
        role: '清洁员',
        text: '停电时我一直在后门清点拖把，没有进展厅。电力恢复后我才跟着保安进去，发现画框旁只在室内留下了一圈雨水。',
        clue: '清洁员证实雨水只在上锁展厅内出现，恢复供电后才有人能看见。'
      }
    ],
    question: '谁最可能是偷画的人，或者哪条关键证据能证明作案者进入过锁着的展厅？',
    acceptedAnswers: ['林夏', '展柜钥匙始终封存'],
    wrongHint: '再对照钥匙封存、房门上锁和雨水出现的时间，看看谁的证词不可能成立。',
    result: {
      title: '结案：雨夜里的破绽',
      reasoning: '钥匙一直封存，展厅在停电时上锁且漆黑，没人能从外面打开展厅。林夏却声称自己在断电、房门无法进入时检查过干燥地面；而雨水只出现在锁着的室内，这个时间与位置矛盾暴露了她。',
      closing: '林夏承认自己带着备用钥匙进过展厅，雨水正是她留下的脚印。失窃的小画最终在她的画筒夹层中被找回。'
    }
  }
]

Object.assign(window.OhMyType, { branchingStories, detectiveCases, funModes })

})()
