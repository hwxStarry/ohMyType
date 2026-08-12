# Oh My Type

Oh My Type is a typing practice page for poems, articles, pinyin, and vocabulary drills. Open `index.html` directly in a browser to use it.

## Features

- Built-in practice content for pinyin, poems, articles, and word drills.
- Category-based sidebar with expandable groups and a collapsible layout.
- Hidden input capture with live correct, incorrect, and current-character highlighting.
- Plain pinyin input without tone marks, with input-method-safe key capture.
- Live WPM, accuracy, elapsed time, and progress statistics.
- Virtual keyboard with next-key highlighting.
- Custom practice text with category selection, edit, delete, and `localStorage` persistence.
- Completion result modal with mistakes and practice history saved locally.
- Typing game section with open-source project links for gameplay reference.

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
├── src/
│   ├── constants.js    # Constants, localStorage keys, categories, keyboard layout
│   ├── data.js         # Built-in content and game links
│   ├── keyboard.js     # Virtual keyboard rendering
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
- `typestart_history`: practice history.
- `typestart_mistakes`: mistake statistics.
