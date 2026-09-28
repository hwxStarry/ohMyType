(() => {
window.OhMyType = window.OhMyType || {}

const HOME_TRACK_CATEGORIES = {
  basics: ['拼音', '诗词', '文章', '文言文'],
  english: ['单词', '英语'],
  programming: ['编程·JavaScript', '编程·Python', '编程·HTML', '编程·CSS'],
  dialogue: ['对话·工作管理', '对话·客户沟通', '对话·面试问答', '对话·日常聊天', '对话·客服售后']
}

function getHomeTrackContents(contents, trackId) {
  const categories = HOME_TRACK_CATEGORIES[trackId] || []
  return contents.filter(item => categories.includes(item.category))
}

function createHomeModel({ contents = [], recentIds = [], memoryPrompts = [], history = [] }) {
  const contentsById = new Map(contents.map(item => [item.id, item]))
  const continueItem = recentIds.map(id => contentsById.get(id)).find(Boolean) || null
  return {
    totalContents: contents.length,
    poemCount: contents.filter(item => item.category === '诗词').length,
    programmingCount: getHomeTrackContents(contents, 'programming').length,
    dialogueCount: getHomeTrackContents(contents, 'dialogue').length,
    memoryCount: memoryPrompts.length,
    continueItem,
    bestWpm: history.reduce((best, item) => Math.max(best, Number(item.wpm) || 0), 0)
  }
}

function escapeHomeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderHomeMarkup(model) {
  const continueTitle = model.continueItem ? `继续：${escapeHomeHtml(model.continueItem.title)}` : '挑一个方向开始'
  return `
    <div class="home-shell">
      <section class="home-hero" aria-labelledby="homeHeadline">
        <div class="home-hero-copy">
          <p class="home-kicker"><span></span> 打字，不止一种练法</p>
          <h2 id="homeHeadline"><span>从一行字开始，</span><br><em>练到真正想用的地方。</em></h2>
          <p class="home-lead">练拼音、诗词和英语，也练代码、聊天与临场反应。想专注就安静输入，想玩一点就进入故事。</p>
          <div class="home-hero-actions">
            <button class="home-primary-action" type="button" data-home-action="random">随机开始 <span>↗</span></button>
            <button class="home-secondary-action" type="button" data-home-action="continue" ${model.continueItem ? '' : 'disabled'}>${continueTitle}</button>
          </div>
          <div class="home-facts" aria-label="内容规模">
            <div><strong>${model.totalContents}</strong><span>项练习</span></div>
            <div><strong>${model.poemCount}</strong><span>首诗词</span></div>
            <div><strong>${model.memoryCount}</strong><span>道记忆题</span></div>
          </div>
        </div>
        <div class="home-live-stage" aria-label="内容预览">
          <div class="home-stage-bar"><span><i></i><i></i><i></i></span><small>LIVE INPUT</small></div>
          <div class="home-stage-body">
            <span class="home-stage-index">01 / 04</span>
            <p id="homeDemoText" class="home-demo-text">床前明月光</p><span class="home-demo-caret" aria-hidden="true"></span>
            <div class="home-demo-tags"><span>诗词</span><span>代码</span><span>对话</span><span>推理</span></div>
          </div>
          <div class="home-stage-foot">
            <span>今日最佳</span><strong>${model.bestWpm || '—'}${model.bestWpm ? ' WPM' : ''}</strong>
          </div>
        </div>
      </section>

      <section class="home-track" aria-labelledby="homeTrackTitle">
        <div class="home-section-heading">
          <div><p>TRAINING PATH</p><h2 id="homeTrackTitle">沿着一条轨道，找到今天的练习</h2></div>
          <span>点击任意站点直接开练</span>
        </div>
        <div class="home-track-line" aria-label="练习分类">
          <button type="button" data-home-track="basics"><i>01</i><strong>基础</strong><span>拼音 · 诗词 · 文言文</span></button>
          <button type="button" data-home-track="english"><i>02</i><strong>英语</strong><span>单词 · 常用表达</span></button>
          <button type="button" data-home-track="programming"><i>03</i><strong>编程</strong><span>${model.programmingCount} 组 · JS / Python / Web</span></button>
          <button type="button" data-home-track="dialogue"><i>04</i><strong>对话</strong><span>${model.dialogueCount} 组真实场景</span></button>
          <button type="button" data-home-action="custom"><i>05</i><strong>自定义</strong><span>粘贴任何想练的文字</span></button>
        </div>
      </section>

      <section class="home-playground" aria-labelledby="homePlayTitle">
        <div class="home-playground-title">
          <p>PLAYGROUND</p>
          <h2 id="homePlayTitle">今天，不只是抄完一段文字</h2>
          <button type="button" data-home-action="fun-hub">查看全部玩法 →</button>
        </div>
        <button class="home-game home-game-story" type="button" data-home-fun="story">
          <span class="home-game-number">01</span><span class="home-game-mark">◇</span>
          <div><small>故事由输入决定</small><strong>剧情分支</strong><p>输入你的选择，走向不同结局。</p></div><em>进入故事 ↗</em>
        </button>
        <button class="home-game home-game-detective" type="button" data-home-fun="detective">
          <span class="home-game-number">02</span><span class="home-game-mark">⌕</span>
          <div><small>从证词找到矛盾</small><strong>侦探解谜</strong><p>输入证词，收集线索并作出指认。</p></div><em>开始调查 ↗</em>
        </button>
        <button class="home-game home-game-memory" type="button" data-home-fun="memory">
          <span class="home-game-number">03</span><span class="home-game-mark">◉</span>
          <div><small>${model.memoryCount} 道挑战</small><strong>记忆闪打</strong><p>看清、隐藏、限时输入，挑战记忆与速度。</p></div><em>开始挑战 ↗</em>
        </button>
      </section>

      <section class="home-personal-strip" aria-label="我的练习">
        <div><span>YOUR PROGRESS</span><strong>${model.bestWpm ? `历史最佳 ${model.bestWpm} WPM` : '完成第一场练习后，这里会记录你的进步'}</strong></div>
        <button type="button" data-home-personal="recent">最近练习</button>
        <button type="button" data-home-personal="history">成绩记录</button>
      </section>
    </div>
  `
}

Object.assign(window.OhMyType, { HOME_TRACK_CATEGORIES, createHomeModel, getHomeTrackContents, renderHomeMarkup })
})()
