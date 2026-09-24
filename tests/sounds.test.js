const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const values = new Map()
const localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value))
}
let oscillatorCount = 0
const audioContext = {
  currentTime: 0,
  destination: {},
  state: 'running',
  createGain: () => ({
    connect() {},
    gain: {
      setValueAtTime() {},
      exponentialRampToValueAtTime() {}
    }
  }),
  createOscillator: () => {
    oscillatorCount++
    return {
      connect() {},
      frequency: { setValueAtTime() {} },
      start() {},
      stop() {}
    }
  },
  resume: () => Promise.resolve()
}
function Audio() {
  return {
    getAttribute: () => '',
    play: () => Promise.resolve(),
    setAttribute() {}
  }
}

const context = {
  Audio,
  localStorage,
  window: {
    AudioContext: function AudioContext() { return audioContext },
    OhMyType: {}
  }
}
vm.runInNewContext(fs.readFileSync('src/sounds.js', 'utf8'), context)

const { createMemoryAudio, MEMORY_SOUND_KEY } = context.window.OhMyType
const memoryAudio = createMemoryAudio()
assert.equal(memoryAudio.getEnabled(), true)
memoryAudio.playTick()
assert.equal(oscillatorCount, 1)

memoryAudio.setEnabled(false)
assert.equal(memoryAudio.getEnabled(), false)
assert.equal(localStorage.getItem(MEMORY_SOUND_KEY), '0')
memoryAudio.playTimeout()
assert.equal(oscillatorCount, 1)

memoryAudio.setEnabled(true)
assert.equal(memoryAudio.getEnabled(), true)
assert.equal(localStorage.getItem(MEMORY_SOUND_KEY), '1')
assert.equal(oscillatorCount, 3)
memoryAudio.playTimeout()
assert.equal(oscillatorCount, 5)

console.log('sounds tests passed')
