(() => {
window.OhMyType = window.OhMyType || {}

function searchContents(contents, query) {
  const normalizedQuery = String(query || '').trim().toLowerCase()
  if (!normalizedQuery) return contents.slice()

  return contents.filter(item => [
    item.title,
    item.category,
    item.body,
    ...(Array.isArray(item.translations) ? item.translations : [])
  ].some(value => String(value || '').toLowerCase().includes(normalizedQuery)))
}

function createContentLibrary({ storage, favoritesKey, recentsKey, recentLimit = 12 }) {
  function readIds(key) {
    try {
      const value = JSON.parse(storage.getItem(key) || '[]')
      if (!Array.isArray(value)) return []
      return [...new Set(value.filter(id => typeof id === 'string' && id))]
    } catch {
      return []
    }
  }

  function writeIds(key, ids) {
    storage.setItem(key, JSON.stringify(ids))
  }

  function readFavoriteIds() {
    return readIds(favoritesKey)
  }

  function toggleFavorite(id) {
    const ids = readFavoriteIds()
    const index = ids.indexOf(id)
    if (index >= 0) ids.splice(index, 1)
    else ids.push(id)
    writeIds(favoritesKey, ids)
    return index < 0
  }

  function readRecentIds() {
    return readIds(recentsKey).slice(0, recentLimit)
  }

  function recordRecent(id) {
    const ids = readRecentIds().filter(item => item !== id)
    ids.unshift(id)
    writeIds(recentsKey, ids.slice(0, recentLimit))
  }

  function pickRandom(contents, currentId, random = Math.random) {
    if (!contents.length) return null
    const candidates = contents.length > 1
      ? contents.filter(item => item.id !== currentId)
      : contents
    return candidates[Math.floor(random() * candidates.length)] || candidates[0]
  }

  return { pickRandom, readFavoriteIds, readRecentIds, recordRecent, toggleFavorite }
}

Object.assign(window.OhMyType, { createContentLibrary, searchContents })

})()
