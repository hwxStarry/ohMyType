# Detective Practice and Immersive Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the branching story textarea with direct character highlighting and ship one complete detective case using the same input engine and a responsive virtual keyboard.

**Architecture:** Add a pure `fun-typing` module that derives candidate, character, completion, and next-key state from text input. Keep story and detective content in `fun-data.js`, while `app.js` owns view transitions, hidden-input events, and rendering; both modes consume the same pure state. Extend the existing keyboard renderer to accept one or more possible next keys without changing ordinary practice behavior.

**Tech Stack:** Browser JavaScript IIFEs, HTML, CSS, `localStorage`, Node built-in `assert`/`vm` tests; no packages or build step.

**Spec:** `docs/superpowers/specs/2026-09-11-detective-and-immersive-input-design.md`

## Global Constraints

- Keep the application pure frontend, local-first, login-free, and dependency-free.
- Remove the visible branching-story textarea; typing must update characters inside the displayed choices.
- Respect `compositionstart` and `compositionend` for Chinese IME input.
- Desktop fun-mode keyboard defaults open; widths at or below 980px default closed and remain user-toggleable.
- Ship exactly one detective case in this increment.
- Do not implement timers, rankings, case saves, ending collections, memory typing, or idiom chains.
- All new behavior must follow red-green-refactor; run the failing test before production edits.

---

## File Map

- Create `src/fun-typing.js`: pure candidate matching and per-character state derivation.
- Create `tests/fun-typing.test.js`: behavior tests for the shared input engine.
- Modify `src/keyboard.js`: allow one or multiple expected characters.
- Create `tests/keyboard.test.js`: keyboard rendering regression and multiple-next-key tests.
- Create `src/detective-state.js`: pure detective phase and clue progression state.
- Create `tests/detective-state.test.js`: detective progression, retry, and reset tests.
- Modify `src/fun-data.js`: add the first detective case and mark detective playable.
- Modify `tests/fun-data.test.js`: validate detective content and answers.
- Modify `index.html`: load the input module and expose an enabled detective menu button.
- Modify `app.js`: shared hidden-input controller, story renderer migration, detective state machine, keyboard toggle.
- Modify `styles/fun.css`: character states, hidden input, fun keyboard, detective cards and responsive behavior.
- Modify `README.md`, `README.en.md`, and `ROADMAP.md`: document delivered behavior and update roadmap status.

---

### Task 1: Pure Fun-Typing State Engine

**Files:**
- Create: `tests/fun-typing.test.js`
- Create: `src/fun-typing.js`
- Modify: `index.html` script list

**Interfaces:**
- Produces: `window.OhMyType.getFunTypingState(candidates: string[], typedValue: string)`.
- Returns: `{ typedValue, completedIndex, bestIndexes, nextChars, candidates }`.
- Each returned candidate is `{ text, prefixLength, isBest, chars }`; each char is `{ char, status }` where status is `pending | current | correct | wrong`.

- [ ] **Step 1: Write the failing state-engine test**

Create `tests/fun-typing.test.js` with assertions for empty input, candidate narrowing, wrong input, completion, backspace recomputation, and Unicode:

```js
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/fun-typing.js', 'utf8'), context)
const { getFunTypingState } = context.window.OhMyType

let state = getFunTypingState(['打开那封信', '放回那封信'], '')
assert.deepEqual(Array.from(state.bestIndexes), [0, 1])
assert.equal(state.candidates[0].chars[0].status, 'current')
assert.equal(state.candidates[1].chars[0].status, 'current')

state = getFunTypingState(['打开那封信', '放回那封信'], '打开')
assert.equal(state.candidates[0].chars[0].status, 'correct')
assert.equal(state.candidates[0].chars[1].status, 'correct')
assert.deepEqual(Array.from(state.bestIndexes), [0])
assert.deepEqual(Array.from(state.nextChars), ['那'])

const wrong = getFunTypingState(['打开那封信', '放回那封信'], '打错')
assert.equal(wrong.candidates[0].chars[1].status, 'wrong')
assert.equal(wrong.completedIndex, -1)

const corrected = getFunTypingState(['打开那封信'], '打')
assert.equal(corrected.candidates[0].chars[0].status, 'correct')
assert.equal(corrected.candidates[0].chars[1].status, 'current')

const completed = getFunTypingState(['打开那封信', '放回那封信'], '打开那封信')
assert.equal(completed.completedIndex, 0)

const unicode = getFunTypingState(['去看𠮷'], '去看')
assert.equal(unicode.candidates[0].chars[2].char, '𠮷')
console.log('fun-typing tests passed')
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node tests/fun-typing.test.js`

Expected: FAIL because `src/fun-typing.js` does not exist.

- [ ] **Step 3: Implement the pure state engine**

Create `src/fun-typing.js` as an IIFE. Use `Array.from` consistently. Compute prefix length per candidate, the maximum prefix length, best indexes, character states, unique next characters, and exact completion:

```js
(() => {
window.OhMyType = window.OhMyType || {}

function getPrefixLength(target, typed) {
  const targetChars = Array.from(target)
  const typedChars = Array.from(typed)
  let index = 0
  while (index < typedChars.length && typedChars[index] === targetChars[index]) index++
  return index
}

function getFunTypingState(candidates, typedValue) {
  const texts = candidates.map(String)
  const typedChars = Array.from(typedValue)
  const prefixLengths = texts.map(text => getPrefixLength(text, typedValue))
  const bestLength = Math.max(0, ...prefixLengths)
  const bestIndexes = texts.map((_, index) => index).filter(index => prefixLengths[index] === bestLength)
  const completedIndex = texts.findIndex(text => text === typedValue)
  const candidateStates = texts.map((text, candidateIndex) => {
    const targetChars = Array.from(text)
    return {
      text,
      prefixLength: prefixLengths[candidateIndex],
      isBest: bestIndexes.includes(candidateIndex),
      chars: targetChars.map((char, index) => ({
        char,
        status: index < typedChars.length
          ? (typedChars[index] === char ? 'correct' : 'wrong')
          : (index === typedChars.length ? 'current' : 'pending')
      }))
    }
  })
  const nextChars = [...new Set(bestIndexes
    .map(index => Array.from(texts[index])[typedChars.length])
    .filter(Boolean))]
  return { typedValue, completedIndex, bestIndexes, nextChars, candidates: candidateStates }
}

Object.assign(window.OhMyType, { getFunTypingState })
})()
```

- [ ] **Step 4: Load the module and verify GREEN**

Add `<script src="./src/fun-typing.js"></script>` after `utils.js` and before `app.js` in `index.html`.

Run: `node tests/fun-typing.test.js && node --check src/fun-typing.js`

Expected: PASS and no syntax errors.

- [ ] **Step 5: Commit the engine**

```bash
git add src/fun-typing.js tests/fun-typing.test.js index.html
git commit -m "Add shared fun typing state engine"
```

---

### Task 2: Multiple Expected Keys and Responsive Fun Keyboard

**Files:**
- Create: `tests/keyboard.test.js`
- Modify: `src/keyboard.js`
- Modify: `app.js`
- Modify: `styles/fun.css`

**Interfaces:**
- Consumes: `renderKeyboard(container, expected)` and `getFunTypingState(...).nextChars`.
- Changes: `renderKeyboard` accepts `string | string[]`; existing string calls remain valid.
- Produces: `renderFunKeyboard(nextChars: string[])` and `toggleFunKeyboard()` in `app.js`.

- [ ] **Step 1: Write the failing keyboard test**

Create `tests/keyboard.test.js`:

```js
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = {
  window: {
    OhMyType: {
      keyboardRows: [['a', 'b', '1', 'Shift']],
      homeKeys: new Set(),
      dotKeys: new Set(),
      escapeHtml: value => String(value)
    }
  }
}
vm.runInNewContext(fs.readFileSync('src/keyboard.js', 'utf8'), context)
const container = { innerHTML: '' }

context.window.OhMyType.renderKeyboard(container, ['a', 'b'])
assert.match(container.innerHTML, /key expected[^>]*>a</)
assert.match(container.innerHTML, /key expected[^>]*>b</)

context.window.OhMyType.renderKeyboard(container, '!')
assert.match(container.innerHTML, /key expected[^>]*>1</)
console.log('keyboard tests passed')
```

Append this responsive-default assertion to `tests/fun-typing.test.js` before changing application code:

```js
const { getDefaultFunKeyboardOpen } = context.window.OhMyType
assert.equal(getDefaultFunKeyboardOpen(1200), true)
assert.equal(getDefaultFunKeyboardOpen(980), false)
```

- [ ] **Step 2: Run the keyboard test and verify RED**

Run: `node tests/keyboard.test.js && node tests/fun-typing.test.js`

Expected: FAIL because array input reaches `toLowerCase` and `getDefaultFunKeyboardOpen` is not defined.

- [ ] **Step 3: Add array support without changing string behavior**

In `src/keyboard.js`, normalize the expected argument at the start of `renderKeyboard`:

```js
const expectedKeys = Array.isArray(expected) ? expected : [expected]
```

Change the expected class condition to:

```js
if (expectedKeys.some(value => keyMatchesExpected(key, value))) classes.push('expected')
```

In `src/fun-typing.js`, export a deterministic responsive helper:

```js
function getDefaultFunKeyboardOpen(viewportWidth) {
  return viewportWidth > 980
}
```

Use `getDefaultFunKeyboardOpen(window.innerWidth)` when initializing the application state.

- [ ] **Step 4: Add the fun keyboard renderer and responsive state**

In `app.js`, introduce `let funKeyboardOpen = !window.matchMedia('(max-width: 980px)').matches` and render this block below active story/detective typing content:

```html
<section class="fun-keyboard-card">
  <button class="fun-keyboard-toggle" type="button" data-toggle-fun-keyboard aria-expanded="true">
    <span>键盘指法</span><span>收起键盘</span>
  </button>
  <div id="funKeyboard" class="virtual-keyboard"></div>
</section>
```

Implement `renderFunKeyboard(nextChars)` to update `aria-expanded`, hide/show the keyboard body, filter Chinese characters from `nextChars`, and call `renderKeyboard` with the remaining keys. Add click delegation for `[data-toggle-fun-keyboard]`.

- [ ] **Step 5: Add keyboard styles**

In `styles/fun.css`, add `.fun-keyboard-card`, `.fun-keyboard-toggle`, and collapsed-state rules. Under `@media (max-width: 980px)`, keep the body hidden when `funKeyboardOpen` is false; do not remove the toggle.

- [ ] **Step 6: Verify GREEN and regressions**

Run:

```bash
node tests/keyboard.test.js
node tests/fun-typing.test.js
node --check app.js
node --check src/keyboard.js
```

Expected: all pass.

- [ ] **Step 7: Commit keyboard support**

```bash
git add src/keyboard.js tests/keyboard.test.js app.js styles/fun.css
git commit -m "Add responsive keyboard to fun practice"
```

---

### Task 3: Migrate Branching Story to Direct Character Typing

**Files:**
- Modify: `app.js:779-868`
- Modify: `styles/fun.css:148-228`
- Modify: `tests/fun-typing.test.js`

**Interfaces:**
- Consumes: `getFunTypingState(node.choices.map(choice => choice.text), funTypedValue)`.
- Consumes: `renderFunKeyboard(state.nextChars)`.
- Produces: shared controller functions `resetFunInput(candidates)`, `handleFunInput(value)`, and `renderFunCharacters(candidateState)` for later detective use.

- [ ] **Step 1: Add a failing ambiguity-and-limit test**

Append to `tests/fun-typing.test.js`:

```js
const shared = getFunTypingState(['我们去左边', '我们去右边'], '我们去')
assert.deepEqual(Array.from(shared.bestIndexes), [0, 1])
assert.deepEqual(Array.from(shared.nextChars), ['左', '右'])

const limited = getFunTypingState(['短句'], '短句多余内容')
assert.equal(limited.typedValue, '短句')
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node tests/fun-typing.test.js`

Expected: FAIL because the state engine does not clamp input length.

- [ ] **Step 3: Clamp input and add reusable rendering helpers**

Update `getFunTypingState` to clamp `typedValue` to the longest candidate length before deriving state. In `app.js`, add:

```js
let funTypedValue = ''
let funCandidates = []

function resetFunInput(candidates) {
  funTypedValue = ''
  funCandidates = candidates
}

function renderFunCharacters(candidate) {
  return candidate.chars.map(item =>
    `<span class="fun-char ${item.status}">${escapeHtml(item.char)}</span>`
  ).join('')
}
```

The controller must update `funTypedValue` only outside IME composition and expose completion through the returned state.

- [ ] **Step 4: Replace the story textarea markup**

In `renderStory`, replace `.story-input-wrap` with:

```html
<p id="funTypingHint" class="fun-typing-hint" aria-live="polite">直接输入你选择的回复</p>
<textarea id="funTypingInput" class="hidden-input" aria-label="输入选择的回复"></textarea>
```

Render each option's `<p>` with `renderFunCharacters(state.candidates[index])`, add `.matching` for best candidates, and add `.dimmed` for non-best candidates once input is non-empty.

- [ ] **Step 5: Wire IME-safe hidden input events**

Use delegated `input`, `compositionstart`, and `compositionend` handlers on `el.funContent`. During composition set `data-composing="1"`; on completion clear it and process the committed value. Clicking `.story-shell` focuses `#funTypingInput` without scrolling.

When `completedIndex >= 0`, use that index to choose `node.choices[completedIndex]`, append to `storyPath`, clear fun input, play completion audio, and render the next node.

- [ ] **Step 6: Replace textarea styles with character-state styles**

Remove `.story-input-wrap textarea` rules. Add `.fun-char.pending`, `.fun-char.current`, `.fun-char.correct`, `.fun-char.wrong`, `.story-choice.dimmed`, and `.fun-typing-hint`. Use the existing practice colors: green `#4ade80`, red `var(--red)`, current background `rgba(255,255,255,.08)`.

- [ ] **Step 7: Verify story behavior**

Run:

```bash
node tests/fun-typing.test.js
node tests/fun-data.test.js
node tests/keyboard.test.js
node --check app.js
git diff --check
```

Manual checks in `index.html`:

1. Open 剧情分支 and confirm no visible textarea appears.
2. Type a valid reply and confirm characters turn green.
3. Type a wrong character and confirm it turns red; backspace restores state.
4. Complete both decisions and reach an ending.
5. At desktop width the keyboard is visible; at narrow width it starts collapsed and can expand.

- [ ] **Step 8: Commit story migration**

```bash
git add app.js styles/fun.css src/fun-typing.js tests/fun-typing.test.js
git commit -m "Use direct character typing in stories"
```

---

### Task 4: Detective Case Data and Validation

**Files:**
- Modify: `src/fun-data.js`
- Modify: `tests/fun-data.test.js`

**Interfaces:**
- Produces: `window.OhMyType.detectiveCases`.
- Case shape: `{ id, title, description, statements, question, acceptedAnswers, wrongHint, result }`.
- Statement shape: `{ speaker, role, text, clue }`.
- Result shape: `{ title, reasoning, closing }`.

- [ ] **Step 1: Write the failing detective-data test**

Append to `tests/fun-data.test.js`:

```js
const { detectiveCases } = context.window.OhMyType
assert.ok(Array.isArray(detectiveCases) && detectiveCases.length === 1)
assert.ok(funModes.some(mode => mode.id === 'detective' && mode.status === 'playable'))

detectiveCases.forEach(caseItem => {
  assert.ok(caseItem.id && caseItem.title && caseItem.description)
  assert.ok(caseItem.statements.length >= 3)
  caseItem.statements.forEach(statement => {
    assert.ok(statement.speaker && statement.role)
    assert.ok(statement.text.length >= 20)
    assert.ok(statement.clue.length >= 8)
  })
  assert.ok(caseItem.question)
  assert.ok(caseItem.acceptedAnswers.length >= 2)
  assert.ok(caseItem.acceptedAnswers.every(Boolean))
  assert.ok(caseItem.wrongHint)
  assert.ok(caseItem.result.title && caseItem.result.reasoning && caseItem.result.closing)
})
```

- [ ] **Step 2: Run the data test and verify RED**

Run: `node tests/fun-data.test.js`

Expected: FAIL because `detectiveCases` is undefined and detective is still `soon`.

- [ ] **Step 3: Add the single case**

In `src/fun-data.js`, change detective status to `playable` and add `detectiveCases` with exactly one case, “雨夜画廊失窃案”. Include three statements from the security guard, curator, and cleaner. The contradiction must be solvable from these facts: the display case key remained sealed, rainwater appears only inside the locked room, and one witness claims to have inspected the dry floor before power returned despite the room being dark and inaccessible. Accept both the suspect's name and the configured key-evidence phrase.

Export with:

```js
Object.assign(window.OhMyType, { branchingStories, detectiveCases, funModes })
```

- [ ] **Step 4: Verify GREEN**

Run: `node tests/fun-data.test.js && node --check src/fun-data.js`

Expected: PASS.

- [ ] **Step 5: Commit detective data**

```bash
git add src/fun-data.js tests/fun-data.test.js
git commit -m "Add rain gallery detective case"
```

---

### Task 5: Detective View and State Machine

**Files:**
- Modify: `index.html:50-72`
- Modify: `app.js` element map, view router, event binding, and fun rendering functions
- Modify: `styles/fun.css`
- Create: `src/detective-state.js`
- Create: `tests/detective-state.test.js`

**Interfaces:**
- Consumes: `detectiveCases[0]`, `getFunTypingState`, `renderFunCharacters`, `renderFunKeyboard`.
- Produces: `window.OhMyType.createDetectiveState(caseItem)` with `start()`, `completeStatement()`, `submitAnswer(value)`, `reset()`, and `getState()`.
- Produces: detective intro, statement, accusation, and result render states represented by `activeView === 'detective'` plus `detectiveState.getState().phase`.

- [ ] **Step 1: Write the failing detective progression test**

Create `tests/detective-state.test.js`:

```js
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/detective-state.js', 'utf8'), context)
const { createDetectiveState } = context.window.OhMyType
const caseItem = {
  statements: [
    { text: '证词一内容', clue: '线索一' },
    { text: '证词二内容', clue: '线索二' },
    { text: '证词三内容', clue: '线索三' }
  ],
  acceptedAnswers: ['林夏', '地面的雨水']
}

const detective = createDetectiveState(caseItem)
assert.equal(detective.getState().phase, 'intro')
detective.start()
assert.equal(detective.getState().phase, 'statement')

detective.completeStatement()
assert.deepEqual(Array.from(detective.getState().clues), ['线索一'])
detective.completeStatement()
detective.completeStatement()
assert.equal(detective.getState().phase, 'accusation')
assert.deepEqual(Array.from(detective.getState().clues), ['线索一', '线索二', '线索三'])

assert.equal(detective.submitAnswer('错误答案'), false)
assert.equal(detective.getState().phase, 'accusation')
assert.equal(detective.getState().wrongAttempts, 1)
assert.equal(detective.submitAnswer('林夏'), true)
assert.equal(detective.getState().phase, 'result')

detective.reset()
assert.equal(detective.getState().phase, 'intro')
assert.equal(detective.getState().clues.length, 0)
console.log('detective-state tests passed')
```

- [ ] **Step 2: Run the state test and verify RED**

Run: `node tests/detective-state.test.js`

Expected: FAIL because `src/detective-state.js` does not exist.

- [ ] **Step 3: Implement the pure detective state**

Create `src/detective-state.js` as an IIFE. Keep phase, statement index, clues, and wrong-attempt count private. `completeStatement()` must append only the current statement's clue and must be a no-op outside `statement`. After the last statement it changes phase to `accusation`. `submitAnswer(value)` trims the value, compares it to `acceptedAnswers`, advances only correct answers to `result`, and increments `wrongAttempts` for non-empty wrong answers. `reset()` restores the intro state.

Load it in `index.html` after `fun-typing.js` and before `app.js`.

- [ ] **Step 4: Verify detective state GREEN**

Run: `node tests/detective-state.test.js && node --check src/detective-state.js`

Expected: PASS.

- [ ] **Step 5: Enable the menu entry**

In `index.html`, give the detective button `id="detectiveTab"`, remove `disabled`, change its badge to `玩`, and expose it in the `el` map. In `renderContentList`, toggle its active class when `activeView === 'detective'`.

- [ ] **Step 6: Add detective view state and renderers**

Add:

```js
let activeDetectiveCase = detectiveCases[0]
let detectiveState = createDetectiveState(activeDetectiveCase)
```

Implement `startDetective()`, `renderDetective()`, `completeDetectiveStatement()`, and `submitDetectiveAnswer()`. The intro shows case description and “开始调查”. Each statement uses one visible candidate with direct character highlighting. Completing it appends exactly one clue and moves to the next statement. After the third statement, render all unlocked clues and an answer line that displays `funTypedValue` as characters without revealing accepted answers. Pressing Enter outside IME composition or clicking “确认指认” calls `submitAnswer(funTypedValue)`. A wrong submission clears `funTypedValue`, shows `wrongHint`, and remains in accusation; a correct submission renders the result.

- [ ] **Step 7: Reuse shared focus, IME, and keyboard flow**

Generalize the fun-input event handler so both `activeView === 'story'` and `activeView === 'detective'` call the same input-state updater, then dispatch completion to the active mode. The detective intro and result must not create or focus a hidden input.

- [ ] **Step 8: Add detective styles**

Add `.detective-shell`, `.case-intro`, `.statement-card`, `.clue-list`, `.clue-card`, `.accusation-panel`, and `.case-result` rules. Reuse the existing dark panel, card border, and blue accent; use amber only for unlocked clues and green for successful resolution.

- [ ] **Step 9: Verify the full detective flow**

Run:

```bash
node tests/fun-typing.test.js
node tests/fun-data.test.js
node tests/keyboard.test.js
node tests/detective-state.test.js
node tests/storage.test.js
node tests/typing-state.test.js
node --check app.js
node --check src/fun-data.js
git diff --check
```

Manual checks:

1. Detective menu and hub card both start the case.
2. Each completed statement unlocks one and only one clue.
3. Wrong characters render red and can be corrected.
4. A wrong final answer submitted with Enter or the confirmation button shows the configured hint, clears the answer, and does not finish.
5. Either accepted answer reaches the same case result.
6. Restart clears statements, clues, answer, and input state.
7. Story still reaches all four endings.

- [ ] **Step 10: Commit the playable case**

```bash
git add index.html app.js styles/fun.css src/detective-state.js tests/detective-state.test.js
git commit -m "Add detective mystery practice"
```

---

### Task 6: Documentation, Roadmap, and Final Verification

**Files:**
- Modify: `README.md`
- Modify: `README.en.md`
- Modify: `ROADMAP.md`

**Interfaces:**
- No runtime interfaces; documents delivered behavior and remaining scope.

- [ ] **Step 1: Update documentation**

In both READMEs, describe direct character typing for branching stories, the responsive fun keyboard, and the playable detective case. Add `src/fun-typing.js`, `tests/fun-typing.test.js`, and `tests/keyboard.test.js` to the documented structure/test commands.

In `ROADMAP.md`, move the base detective flow out of pending status and leave only future detective enhancements: timers, more cases, false leads, saves, and case rankings. Update “最后更新” to `2026-09-11`.

- [ ] **Step 2: Run the complete automated verification**

Run:

```bash
for test_file in tests/*.test.js; do node "$test_file"; done
node --check app.js
for source_file in src/*.js; do node --check "$source_file"; done
git diff --check
```

Expected: every test prints its pass message; syntax and diff checks produce no errors.

- [ ] **Step 3: Review the final diff**

Run:

```bash
git status --short
git diff --stat
git diff -- app.js index.html src/fun-typing.js src/fun-data.js styles/fun.css
```

Confirm that `归档.zip` remains untracked and is not staged. Confirm no timer, account, leaderboard, or unrelated refactor entered the diff.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md README.en.md ROADMAP.md docs/superpowers/plans/2026-09-11-detective-and-immersive-input.md
git commit -m "Document immersive fun practice modes"
```

- [ ] **Step 5: Push both configured remotes after user requests submission**

```bash
git push origin master
git push github master:main
```

Expected: both remote branch tips match local `HEAD`.
