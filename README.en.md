# Oh My Type

[![GitHub Repo stars](https://img.shields.io/github/stars/hwxStarry/ohMyType?style=social)](https://github.com/hwxStarry/ohMyType)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Oh My Type is a typing practice page for poems, articles, pinyin, vocabulary drills, and dialogue practice. Open `index.html` directly in a browser to use it.

Live demo: [https://ohmytype.mozhe.cc/](https://ohmytype.mozhe.cc/)

## Good For

- Daily practice for pinyin, keyboard positions, and English words.
- Character-by-character practice for poems, short articles, and classical Chinese.
- Dialogue-style practice for boss replies, client communication, interviews, and support.
- Quickly turning pasted text into a personal practice item.
- Local-first practice without an account.

## Features

- Built-in practice content for pinyin, poems, articles, word drills, and boss dialogue.
- Category-based sidebar with expandable groups, dialogue scenario subgroups, and a collapsible layout.
- Hidden input capture with live correct, incorrect, and current-character highlighting.
- Plain pinyin input without tone marks, with input-method-safe key capture.
- Dialogue practice uses the boss as the user role, with scenarios for management, clients, interviews, daily chat, and support.
- Live WPM, accuracy, elapsed time, and progress statistics.
- Virtual keyboard with next-key highlighting.
- Practice modes for free typing, timed sessions, character limits, and strict blocking.
- Custom practice text with category selection, edit, delete, and `localStorage` persistence.
- Completion result modal with mistakes and practice history saved locally.
- Weak review can generate a new practice item from locally recorded mistakes.
- Typing game section with directly playable practice pages, plus source links where available.
- Built-in feedback sounds with support for a custom online audio URL.

## Usage

Open the page directly:

```bash
open index.html
```

Or serve it as static files:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Project Structure

```text
.
├── index.html          # Markup and script loading order
├── app.js              # App entry, DOM wiring, and event binding
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── favicon.svg
│   └── sounds/         # Local sound files and source notes
├── src/
│   ├── annotations.js  # Pinyin and word annotations
│   ├── constants.js    # Constants, localStorage keys, categories, keyboard layout
│   ├── data.js         # Built-in content and game links
│   ├── keyboard.js     # Virtual keyboard rendering
│   ├── pinyin.js       # Pinyin conversion library
│   ├── sounds.js       # Completion sound settings and playback
│   ├── storage.js      # localStorage helpers and practice history
│   ├── typing-state.js # Typing state, error detection, completion handling
│   └── utils.js        # HTML escaping, pinyin normalization, and helpers
├── styles.css          # CSS import entry
└── styles/
    ├── base.css
    ├── sidebar.css
    ├── topbar.css
    ├── practice.css
    ├── games.css
    ├── history.css
    ├── dialogs.css
    └── responsive.css
```

## Development

The code is split by page area and responsibility. Suggested placement for future changes:

- Put content data in `src/data.js`.
- Put typing state and input detection in `src/typing-state.js`.
- Put local persistence in `src/storage.js`.
- Put DOM wiring and event binding in `app.js`.
- Put styles into the matching file under `styles/`.

## Local Data

The app uses these `localStorage` keys:

- `ohmytype_custom_contents`: custom user content.
- `ohmytype_active_content`: selected content id.
- `ohmytype_sidebar_collapsed`: sidebar collapsed state.
- `ohmytype_open_categories`: expanded category state.
- `ohmytype_practice_mode`: selected practice mode.
- `typestart_history`: practice history.
- `typestart_mistakes`: mistake statistics.
- `ohmytype_completion_sound`: completion sound settings.

## License

Code is released under the [MIT License](./LICENSE). Local sound asset sources are listed in [assets/sounds/SOURCES.md](./assets/sounds/SOURCES.md).
