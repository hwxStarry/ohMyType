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
    status: 'soon'
  },
  {
    id: 'memory',
    icon: '◉',
    title: '记忆闪打',
    description: '文字短暂出现后消失，凭记忆完整输入。',
    status: 'soon'
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

Object.assign(window.OhMyType, { branchingStories, funModes })

})()
