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

  function getSelectedFile(nextSettings = settings) {
    if (nextSettings.preset === 'custom' && nextSettings.customUrl) return nextSettings.customUrl
    const sound = completionSounds.find(item => item.id === nextSettings.preset) || completionSounds[0]
    return sound.file
  }

  function load(nextSettings = settings) {
    const file = getSelectedFile(nextSettings)
    if (audio.getAttribute('src') !== file) audio.src = file
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
    load()
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  function preview(nextSettings) {
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
