(() => {
window.OhMyType = window.OhMyType || {}

const pinyinByChar = {
  一: 'yi', 上: 'shang', 下: 'xia', 不: 'bu', 专: 'zhuan', 东: 'dong', 严: 'yan', 个: 'ge', 中: 'zhong',
  为: 'wei', 也: 'ye', 了: 'le', 书: 'shu', 事: 'shi', 五: 'wu', 人: 'ren', 今: 'jin', 他: 'ta',
  习: 'xi', 依: 'yi', 信: 'xin', 准: 'zhun', 函: 'han', 切: 'qie', 到: 'dao',
  令: 'ling', 以: 'yi', 会: 'hui', 但: 'dan', 低: 'di', 何: 'he', 作: 'zuo', 你: 'ni', 像: 'xiang',
  光: 'guang', 入: 'ru', 写: 'xie', 农: 'nong', 几: 'ji', 出: 'chu', 分: 'fen', 到: 'dao',
  前: 'qian', 力: 'li', 动: 'dong', 单: 'dan', 去: 'qu', 可: 'ke', 叶: 'ye', 同: 'tong', 吗: 'ma',
  启: 'qi', 告: 'gao', 和: 'he', 响: 'xiang', 啼: 'ti', 处: 'chu', 备: 'bei', 多: 'duo', 头: 'tou',
  如: 'ru', 姿: 'zi', 字: 'zi', 学: 'xue', 定: 'ding', 客: 'ke', 家: 'jia', 宿: 'su', 少: 'shao',
  层: 'ceng', 山: 'shan', 岁: 'sui', 己: 'ji', 开: 'kai', 当: 'dang', 影: 'ying', 得: 'de',
  心: 'xin', 忆: 'yi', 思: 'si', 总: 'zong', 想: 'xiang', 感: 'gan', 成: 'cheng', 我: 'wo',
  或: 'huo', 打: 'da', 提: 'ti', 握: 'wo', 敲: 'qiao', 数: 'shu', 文: 'wen', 方: 'fang',
  旅: 'lv', 早: 'zao', 是: 'shi', 晨: 'chen', 晓: 'xiao', 暖: 'nuan', 更: 'geng', 月: 'yue',
  有: 'you', 木: 'mu', 来: 'lai', 林: 'lin', 案: 'an', 楼: 'lou', 次: 'ci', 此: 'ci',
  每: 'mei', 气: 'qi', 水: 'shui', 江: 'jiang', 河: 'he', 注: 'zhu', 流: 'liu', 润: 'run',
  清: 'qing', 物: 'wu', 窗: 'chuang', 端: 'duan', 稳: 'wen', 章: 'zhang', 笔: 'bi', 筋: 'jin',
  精: 'jing', 练: 'lian', 绿: 'lv', 翻: 'fan', 肩: 'jian', 能: 'neng', 背: 'bei', 草: 'cao',
  落: 'luo', 薄: 'bo', 虑: 'lv', 行: 'xing', 要: 'yao', 见: 'jian', 让: 'rang', 记: 'ji',
  床: 'chuang', 明: 'ming', 疑: 'yi', 地: 'di', 霜: 'shuang', 举: 'ju', 望: 'wang', 故: 'gu', 乡: 'xiang',
  春: 'chun', 眠: 'mian', 觉: 'jue', 夜: 'ye', 雨: 'yu', 声: 'sheng', 花: 'hua', 知: 'zhi',
  白: 'bai', 日: 'ri', 千: 'qian', 穷: 'qiong', 里: 'li', 目: 'mu', 的: 'de', 从: 'cong', 外: 'wai',
  带: 'dai', 着: 'zhe', 点: 'dian', 湿: 'shi', 息: 'xi', 页: 'ye', 在: 'zai', 醒: 'xing',
  天: 'tian', 慢: 'man', 纯: 'chun', 求: 'qiu', 度: 'du', 节: 'jie', 奏: 'zou', 确: 'que',
  放: 'fang', 松: 'song', 都: 'dou', 变: 'bian', 真: 'zhen', 正: 'zheng', 尽: 'jin', 海: 'hai', 欲: 'yu',
  词: 'ci', 该: 'gai', 说: 'shuo', 课: 'ke', 谁: 'shui', 走: 'zou', 起: 'qi', 身: 'shen',
  轻: 'qing', 进: 'jin', 追: 'zhui', 速: 'su', 道: 'dao', 重: 'chong', 键: 'jian', 间: 'jian',
  闻: 'wen', 阳: 'yang', 随: 'sui', 静: 'jing', 靠: 'kao', 风: 'feng', 鸟: 'niao', 黄: 'huang'
}

function getPinyin(char) {
  return pinyinByChar[char] || (/[\u4e00-\u9fff]/.test(char) ? '' : char)
}

function getWordTranslations(item) {
  if (Array.isArray(item.translations)) return item.translations
  return []
}

Object.assign(window.OhMyType, { getPinyin, getWordTranslations })

})()
