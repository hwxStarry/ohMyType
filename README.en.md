# Oh My Type

[中文](README.md) · [Live demo](https://ohmytype.mozhe.cc/) · [Roadmap](ROADMAP.md)

A browser-based typing practice project for pinyin, poetry, English vocabulary, programming terms, and dialogue. You can also paste your own text to practice.

## Features

- Live position, speed, accuracy, and mistake feedback.
- Free, timed, and character-limit modes with virtual keyboard hints.
- Favorites, recent practice, mistake review, and custom content.
- Memory drills, branching stories, and a detective typing game.
- Practice history saved in the current browser; no account needed.

## Run locally

Open `index.html` directly, or start a static server from the repository root:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`. The project uses plain HTML, CSS, and JavaScript with no build step.

## Tests

```bash
node --test tests/*.test.js
```

Code is available under the [MIT License](LICENSE). Content and sound credits are in [CONTENT_SOURCES.md](CONTENT_SOURCES.md) and [assets/sounds/SOURCES.md](assets/sounds/SOURCES.md).
