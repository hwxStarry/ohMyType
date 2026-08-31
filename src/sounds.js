(() => {
window.OhMyType = window.OhMyType || {}

const completionSounds = [
  {
    id: 'keyboard-single',
    title: '键盘单击',
    file: './assets/sounds/keyboard-single.mp3',
    source: 'https://mixkit.co/free-sound-effects/keyboard/'
  },
  {
    id: 'keyboard-hard',
    title: '键盘重击',
    file: './assets/sounds/keyboard-hard.mp3',
    source: 'https://mixkit.co/free-sound-effects/keyboard/'
  },
  {
    id: 'metal-hammer',
    title: '金属碰撞',
    file: './assets/sounds/metal-hammer.mp3',
    source: 'https://mixkit.co/free-sound-effects/metal/'
  },
  {
    id: 'metal-sword',
    title: '金属划击',
    file: './assets/sounds/metal-sword.mp3',
    source: 'https://mixkit.co/free-sound-effects/metal/'
  },
  {
    id: 'explosion-short',
    title: '短爆炸',
    file: './assets/sounds/explosion-short.mp3',
    source: 'https://mixkit.co/free-sound-effects/explosion/'
  },
  {
    id: 'impact-plate',
    title: '撞击声',
    file: './assets/sounds/impact-plate.mp3',
    source: 'https://mixkit.co/free-sound-effects/metal/'
  },
  {
    id: 'kenney-click-001',
    title: 'CC0 点击',
    file: './assets/sounds/kenney-click-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'kenney-select-001',
    title: 'CC0 选择',
    file: './assets/sounds/kenney-select-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'kenney-confirmation-001',
    title: 'CC0 确认',
    file: './assets/sounds/kenney-confirmation-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'kenney-pluck-001',
    title: 'CC0 弹拨',
    file: './assets/sounds/kenney-pluck-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'kenney-tick-001',
    title: 'CC0 滴答',
    file: './assets/sounds/kenney-tick-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'kenney-switch-001',
    title: 'CC0 开关',
    file: './assets/sounds/kenney-switch-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'kenney-bong-001',
    title: 'CC0 低音',
    file: './assets/sounds/kenney-bong-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'kenney-glitch-001',
    title: 'CC0 故障',
    file: './assets/sounds/kenney-glitch-001.ogg',
    source: 'https://kenney.nl/assets/interface-sounds'
  },
  {
    id: 'retro-coin',
    title: '复古金币',
    type: 'synth',
    source: 'Web Audio generated'
  },
  {
    id: 'retro-jump',
    title: '复古跳跃',
    type: 'synth',
    source: 'Web Audio generated'
  },
  {
    id: 'retro-power',
    title: '复古过关',
    type: 'synth',
    source: 'Web Audio generated'
  },
  {
    id: 'retro-hit',
    title: '复古受击',
    type: 'synth',
    source: 'Web Audio generated'
  },
  {
    id: 'retro-laser',
    title: '像素激光',
    type: 'synth',
    source: 'Web Audio generated'
  }
]

const SOUND_KEY = 'ohmytype_completion_sound'
const DEFAULT_SOUND_ID = 'keyboard-single'

function readSoundSettings() {
  try {
    return {
      preset: DEFAULT_SOUND_ID,
      customUrl: '',
      ...JSON.parse(localStorage.getItem(SOUND_KEY) || '{}')
    }
  } catch {
    return { preset: DEFAULT_SOUND_ID, customUrl: '' }
  }
}

function writeSoundSettings(settings) {
  localStorage.setItem(SOUND_KEY, JSON.stringify({
    preset: settings.preset || DEFAULT_SOUND_ID,
    customUrl: settings.customUrl || ''
  }))
}

function createCompletionAudio() {
  let settings = readSoundSettings()
  const audio = new Audio()
  audio.preload = 'auto'
  audio.volume = 0.38
  let audioContext = null

  function getSelectedSound(nextSettings = settings) {
    return completionSounds.find(item => item.id === nextSettings.preset) || completionSounds[0]
  }

  function getSelectedFile(nextSettings = settings) {
    if (nextSettings.preset === 'custom' && nextSettings.customUrl) return nextSettings.customUrl
    const sound = getSelectedSound(nextSettings)
    if (sound.type === 'synth') return ''
    return sound.file
  }

  function load(nextSettings = settings) {
    const file = getSelectedFile(nextSettings)
    if (!file) return
    if (audio.getAttribute('src') !== file) audio.src = file
  }

  function getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    if (!audioContext) audioContext = new AudioContext()
    return audioContext
  }

  function playTone(context, start, duration, frequency, type, gainValue) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
  }

  function playSlide(context, start, duration, fromFrequency, toFrequency, type, gainValue) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(fromFrequency, start)
    oscillator.frequency.exponentialRampToValueAtTime(toFrequency, start + duration)
    gain.gain.setValueAtTime(gainValue, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
  }

  function playSynth(id) {
    const context = getAudioContext()
    if (!context) return
    if (context.state === 'suspended') context.resume()
    const now = context.currentTime

    if (id === 'retro-coin') {
      playTone(context, now, 0.06, 988, 'square', 0.08)
      playTone(context, now + 0.07, 0.1, 1568, 'square', 0.07)
      return
    }

    if (id === 'retro-jump') {
      playSlide(context, now, 0.18, 330, 880, 'square', 0.07)
      return
    }

    if (id === 'retro-power') {
      const frequencies = [523, 659, 784, 1047]
      frequencies.forEach((frequency, index) => {
        playTone(context, now + index * 0.06, 0.08, frequency, 'triangle', 0.07)
      })
      return
    }

    if (id === 'retro-hit') {
      playSlide(context, now, 0.16, 220, 80, 'sawtooth', 0.08)
      return
    }

    if (id === 'retro-laser') {
      playSlide(context, now, 0.12, 1200, 240, 'square', 0.06)
      playTone(context, now + 0.03, 0.06, 1800, 'square', 0.035)
    }
  }

  function getSettings() {
    return { ...settings }
  }

  function setSettings(nextSettings) {
    settings = {
      preset: nextSettings.preset || DEFAULT_SOUND_ID,
      customUrl: (nextSettings.customUrl || '').trim()
    }
    writeSoundSettings(settings)
    load()
  }

  function play() {
    const sound = getSelectedSound()
    if (sound.type === 'synth') {
      playSynth(sound.id)
      return
    }
    load()
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  function preview(nextSettings) {
    const sound = getSelectedSound({
      preset: nextSettings.preset || DEFAULT_SOUND_ID,
      customUrl: (nextSettings.customUrl || '').trim()
    })
    if (sound.type === 'synth') {
      playSynth(sound.id)
      return
    }
    const previewAudio = new Audio(getSelectedFile({
      preset: nextSettings.preset || DEFAULT_SOUND_ID,
      customUrl: (nextSettings.customUrl || '').trim()
    }))
    previewAudio.volume = audio.volume
    previewAudio.play().catch(() => {})
  }

  load()

  return { getSettings, play, preview, setSettings }
}

Object.assign(window.OhMyType, {
  DEFAULT_SOUND_ID,
  SOUND_KEY,
  completionSounds,
  createCompletionAudio,
  readSoundSettings,
  writeSoundSettings
})

})()
