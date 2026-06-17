# Vista Portfolio - Restructuring Spec

## 1. Goal

Reorganise the project from a flat pile of monolith files into a clean directory layout:

1. Consolidate all data into a `data/` directory. Keep it as plain `.js` files for now (globals, not JSON).
2. Split the CSS into a `css/` directory of focused files.
3. Split the JavaScript into a `js/` directory of focused files.

Behaviour must stay identical. This is a structural refactor only. No visual changes, no feature changes, no content rewrites (beyond moving duplicated data to one place).

Both editions are covered: the Vista desktop (`index.html`) and the Vista Aero phone edition (`phone.html`). The phone parts apply once the phone files are added to the repo.

---

## 2. Current state (flat)

```
vista_portfolio/
├── index.html          9.85 KB   desktop entry, inline onclick handlers, fixed script order
├── projectData.js     10.95 KB   const projectData = {...} (6 projects)
├── pageData.js        27.04 KB   installedPrograms + windowContent + HTML generators
├── mineSweeper.js     11.24 KB   Minesweeper class + injectMinesweeperStyles()
├── pdfReader.js       10.20 KB   PDF.js viewer + injectPdfReaderStyles()
├── vista-script.js    33.92 KB   window manager, history sync, pointer pipeline, start menu, gadgets, system
├── vista-styles.css   39.90 KB   all desktop styling incl. two dark-theme blocks
├── README.md
├── documents/CV2.pdf
└── images/...
```

Load model (important): no bundler, no ES modules. Everything is classic global scripts, and `index.html` uses inline handlers like `onclick="openWindow('about')"`, so every called function must remain a global. Current script order in `index.html`:

```
projectData.js -> pageData.js -> mineSweeper.js -> pdfReader.js -> vista-script.js
```

Two styles are injected at runtime rather than linked: Minesweeper (`injectMinesweeperStyles`) and the PDF reader (`injectPdfReaderStyles`). `openWindow()` in `vista-script.js` calls both.

---

## 3. Data format decision - .js now, JSON later

Data stays as plain `.js` files that assign globals (for example `window.projectData = {...}`), not JSON, for this pass.

Why: JSON would need `fetch()`, and `fetch()` of a local file fails under the `file://` protocol, which would force the site to be served over HTTP. Plain script data loads synchronously, keeps the current no-server workflow (double-clicking `index.html` still works), and needs no async init gating.

JSON stays the eventual target. Once the site is always served over HTTP, revisit: convert `data/*.js` globals to `data/*.json` plus a `fetch`-based loader, and gate boot on the load promise. That conversion is out of scope here. See the deferred note in section 12.

---

## 4. Target state

```
vista_portfolio/
├── index.html
├── phone.html
├── README.md
├── data/
│   ├── project-data.js          (was projectData.js)
│   ├── programs-data.js         (was installedPrograms in pageData.js)
│   ├── profile-data.js          (about/profile + contact + resume path, was duplicated)
│   └── skills-data.js           (skills, was duplicated)
├── css/
│   ├── desktop/
│   │   ├── base.css
│   │   ├── boot-welcome.css
│   │   ├── desktop.css
│   │   ├── gadgets.css
│   │   ├── window.css
│   │   ├── content.css
│   │   ├── taskbar-startmenu.css
│   │   ├── minesweeper.css       (was injected by mineSweeper.js)
│   │   ├── pdf-reader.css        (was injected by pdfReader.js)
│   │   ├── dark-theme.css
│   │   └── responsive.css
│   └── phone/
│       ├── base.css
│       ├── aurora.css
│       ├── boot-welcome.css
│       ├── shell.css
│       ├── home.css
│       ├── window.css
│       └── minesweeper.css
├── js/
│   ├── desktop/
│   │   ├── state.js
│   │   ├── history.js
│   │   ├── navigation.js
│   │   ├── windows.js
│   │   ├── taskbar.js
│   │   ├── pointer.js
│   │   ├── start-menu.js
│   │   ├── gadgets.js
│   │   ├── page-data.js          (was pageData.js)
│   │   ├── minesweeper.js        (was mineSweeper.js, styles removed)
│   │   ├── pdf-reader.js         (was pdfReader.js, styles removed)
│   │   ├── system.js
│   │   └── boot.js
│   └── phone/
│       ├── data.js               (phone-only config that isn't shared)
│       ├── pages.js
│       ├── minesweeper.js
│       ├── router.js
│       └── boot.js
├── documents/CV2.pdf
└── images/...
```

New files use kebab-case under their subdirectories. This normalises the current mix of camelCase (`projectData.js`, `mineSweeper.js`) and kebab-case (`vista-styles.css`).

---

## 5. Data: consolidate everything into data/*.js

### The problem: data is scattered and duplicated

Right now the same facts live in more than one place across the two editions:

- `projectData` lives in `projectData.js` and is already shared (both editions load it). Good as-is, just relocate it.
- `installedPrograms` lives in `pageData.js` AND is copied again inside the phone script. Duplicated.
- Profile/about, skills, and contact details exist twice: as ready-made HTML inside `windowContent` in `pageData.js` (desktop), and as structured data in `phoneAbout` / `phoneSkills` / `phoneContact` (phone). Same facts, two representations.
- The resume path `documents/CV2.pdf` is hardcoded in both editions.

### The fix: one source of truth under data/

Move all content data into `data/` as plain `.js` modules that assign globals. Both editions read these globals, and the inlined and duplicated copies are removed.

```
data/project-data.js     window.projectData         (unchanged shape, was projectData.js)
data/programs-data.js    window.installedPrograms    (the tech-stack array, was in pageData.js)
data/profile-data.js     window.profile              (name, role, lede, paragraphs, status,
                                                       education[], achievements[],
                                                       contact { email, github, githubLabel },
                                                       resumeUrl)
data/skills-data.js      window.skills               (the competency array)
```

Keep the existing global names `projectData` and `installedPrograms` so current consumers need no rename. Introduce `profile` and `skills` for the newly extracted data.

### Consumers after consolidation

- Phone `data.js` drops its inlined `installedPrograms`, `phoneAbout`, `phoneSkills`, `phoneContact`, and `RESUME_URL`, and reads `installedPrograms`, `profile`, and `skills` instead. It keeps only genuinely phone-only config (`PROJECT_COLORS`, the `launchers` array).
- Desktop `page-data.js` reads `installedPrograms` from `programs-data.js` and removes its local copy.
- Desktop about/skills/contact: these are currently hand-written HTML inside `windowContent`. Ideally generate that HTML from `profile` and `skills` so the facts live in one place. If converting those three generators is too large for this pass, the minimum is: delete the duplicated phone copies, keep the desktop HTML, and leave a clear `TODO` to converge both editions on the shared data later. State which option you took.

No loader, no `fetch`, no async gate. These are synchronous scripts loaded before the app scripts (see load orders in section 7). The site keeps working from `file://`.

---

## 6. CSS split

### 6.1 Desktop: vista-styles.css -> css/desktop/*

Map by the existing comment sections. Selectors listed are the anchors, move the whole block including any keyframes that belong to it.

| Target file | Contents (selectors / sections) |
|---|---|
| `base.css` | header note, `* { reset }`, `body`, `.hidden` |
| `boot-welcome.css` | `.boot-screen` + `.boot-*`, `@keyframes bootGlow`, `@keyframes vistaSlide`; `.welcome-screen`, `.welcome-overlay/content/text`, `.user-card/avatar/name`; `.shutdown-screen`, `.shutdown-text`, `@keyframes fadeInOut` |
| `desktop.css` | `.desktop`; `.desktop-icons`, `.desktop-icon*`; `.desktop-context-menu`, `.context-*`; `#selectionBox` (marquee); `.vista-notification` |
| `gadgets.css` | `.vista-sidebar`, `.sidebar-*`; `.clock-gadget`, `.clock-*`; `.calendar-gadget`, `.cal-*` |
| `window.css` | `@keyframes windowOpenAero`; `.vista-window` + `.active/.minimized/.maximized`, `is-dragging`; `.window-titlebar/icon/title/controls/btn*`; `.window-toolbar`, `.toolbar-btn*`, `.address-bar`; `.window-content` base + `h2/h3/p/ul/li`; `.window-content` scrollbar rules; `#snapPreview`; `.resize-handle` |
| `content.css` | `.vista-info-box`; `.skills-vista-grid`, `.skill-vista-item`; `.project-vista-*`, `.tech-vista-badge`; `.contact-link*`; `.vista-btn`; `.documents-grid`, `.document-item`; `.programs-list`, `.program-*`; `.games-grid`, `.game-item*`; `.drives-section`, `.drive-*`, `.system-info-table`; `.cp-*`; `.help-*`; `.welcome-window-*`, `.welcome-links-grid`, `.welcome-link-card*` |
| `taskbar-startmenu.css` | `.taskbar`; `.start-button` (orb) + hover/active; `.quick-launch`, `.ql-*`; `.taskbar-windows`, `.taskbar-item*`, `.taskbar-preview`; `.system-tray`, `.tray-*`; `.start-menu*`, `.start-user*`, `.start-separator*`, `.start-programs`, `.start-item*`, `.start-bottom`, `.start-shutdown`, `.start-search-box`; `#startSearchResults`, `.start-search-empty` |
| `minesweeper.css` | the full stylesheet currently inside `injectMinesweeperStyles()` in `mineSweeper.js` (`.ms-game/.ms-header/.ms-display/.ms-face/.ms-board/.ms-cell/.ms-message/.ms-controls/.ms-btn`) |
| `pdf-reader.css` | the full stylesheet currently inside `injectPdfReaderStyles()` in `pdfReader.js` (`.pdf-reader/.pdf-toolbar/.pdf-btn/.pdf-viewport/.pdf-loading/.pdf-canvas*` and `@keyframes spin`) |
| `dark-theme.css` | every `body.dark-theme ...` rule. There are two separate dark blocks in `vista-styles.css` (the early one and the later "matched to Dark Reader" one). Concatenate both with the later block last so the cascade order is preserved. Also move the dark-theme Minesweeper rules that currently live in `vista-styles.css` into here. |
| `responsive.css` | the `@media (max-width: 768px)` block |

Order matters for two of these: `dark-theme.css` and `responsive.css` must be linked last so they keep overriding.

### 6.2 Phone: phone-styles.css -> css/phone/*

| Target file | Contents |
|---|---|
| `base.css` | `:root` tokens, reset, `body`, `.hidden`, `a`, `.glass` base + the `@supports not (backdrop-filter)` fallback, `@media (prefers-reduced-motion)`, `@media (max-width:340px)` |
| `aurora.css` | `.aurora`, `.aurora::before/::after`, `@keyframes auroraDrift` |
| `boot-welcome.css` | `.boot*`, `@keyframes bootscan`; `.welcome*`, `.user-tile/av/name/hint` |
| `shell.css` | `.phone`, `.statusbar` + `.sig/.batt*`, `.view`, `.dock`, `.start-orb` |
| `home.css` | `.home`, `.today*`, `.launchers`, `.launch*`, the `.c-*` colour tints, `.home-foot` |
| `window.css` | `.win`, `@keyframes winIn`, `.win-titlebar`, `.tb-*`, `.win-body` and all content components inside it: headings/p/ul/li, `.lede`, `.role`, `.proj-title`, `.card`, `.chips/.chip`, `.tag`, `.row*`, `.skill*`, `.tech-*`, `.btn-aero*`, `.contact-row*`, `.doc*` |
| `minesweeper.css` | `.ms*` (board, hud, counts, face, tools, cells, number colours, message) |

---

## 7. JavaScript split

### 7.1 Desktop: vista-script.js -> js/desktop/*

Split by the existing `// ====` section headers. All files stay classic global scripts.

| Target file | Functions / blocks moved |
|---|---|
| `state.js` | module-level state (`windows`, `windowZIndex`, `activeWindow`, `darkTheme`, the `WIN_*`/`TASKBAR_H` constants, `navigationHistory`, `scrollPositions`, history guards, `pointer`, `marquee`); the DOM-helper block that creates and appends `#snapPreview` and `#selectionBox`; `desktopEl`, `ctxMenuEl`, `rectOf`, `setGeom` |
| `history.js` | `snapshot`, `hashForActive`, `pushNav`, `restore`, and the `popstate` listener |
| `navigation.js` | `buildHistoryStack`, `navigateTo`, `navigateFromProjects/Documents/Games/ControlPanel/Help`, `openProjectDetail` |
| `windows.js` | `createWindow`, `openWindow`, `closeWindow`, `userClose`, `goBack`, `minimizeWindow`, `maximizeWindow`, `focusWindow`. Remove the `injectPdfReaderStyles()` and `injectMinesweeperStyles()` calls inside `openWindow` (the CSS is now linked statically). Keep the `initPdfReader` / `initMinesweeper` calls. |
| `taskbar.js` | `addToTaskbar` |
| `pointer.js` | `startDrag`, `startResize`, `onPointerMove`, `processPointer`, `onPointerUp`, `detectSnap`, `applySnap`, and the document `mousemove` / `mouseup` listeners |
| `start-menu.js` | `toggleStartMenu`, `getSearchIndex`, `ensureSearchResultsEl`, `openSearchResult`, `filterStartMenu` |
| `gadgets.js` | `updateGadgetClock`, `tick`, `updateClock`, `initCalendarGadget` |
| `system.js` | `shutdown`; `refreshDesktop`, `toggleSidebar`, `changeWallpaper`; `toggleShowDesktop`; `toggleTheme`, `showNotification`; `deselectIcons` and the desktop-icon-interaction `DOMContentLoaded` handler; the global `click` listener (closes start menu + context menu); the `keydown` shortcuts listener |
| `boot.js` | the boot `DOMContentLoaded` handler and `showWelcome`, plus `startDesktop`. No data gating needed: data is synchronous now. |

Existing files move with light edits:

- `pageData.js` -> `js/desktop/page-data.js`. Keep `windowContent` and the generators. Remove the local `installedPrograms` array (it now comes from `data/programs-data.js`). Optionally rewrite the about/skills/contact generators to build from `profile` and `skills` (see section 5).
- `mineSweeper.js` -> `js/desktop/minesweeper.js`. Delete `injectMinesweeperStyles()` entirely; its CSS now lives in `css/desktop/minesweeper.css`. Keep the `Minesweeper` class, `initMinesweeper`, `setDifficulty`, `minesweeperGame`.
- `pdfReader.js` -> `js/desktop/pdf-reader.js`. Delete `injectPdfReaderStyles()`; its CSS now lives in `css/desktop/pdf-reader.css`. Keep the PDF.js loader and viewer functions.

Recommended script order in `index.html` (data first, then app scripts; only call-time order strictly matters, this is safe):

```
data/project-data.js
data/programs-data.js
data/profile-data.js
data/skills-data.js
js/desktop/state.js
js/desktop/history.js
js/desktop/navigation.js
js/desktop/windows.js
js/desktop/taskbar.js
js/desktop/pointer.js
js/desktop/start-menu.js
js/desktop/gadgets.js
js/desktop/page-data.js
js/desktop/minesweeper.js
js/desktop/pdf-reader.js
js/desktop/system.js
js/desktop/boot.js
```

### 7.2 Phone: phone-script.js -> js/phone/*

| Target file | Contents |
|---|---|
| `data.js` | phone-only config that is not shared: `PROJECT_COLORS`, the `launchers` array. The inlined `phoneAbout` / `phoneSkills` / `phoneContact` / `installedPrograms` / `RESUME_URL` are deleted; this file reads `profile`, `skills`, `installedPrograms` from `data/`. |
| `pages.js` | helpers `esc`, `pad`, `pad3`, `fmtTime`, `win`; all page builders: `homeHTML`, `aboutHTML`, `projectsHTML`, `projectDetailHTML`, `skillsHTML`, `techHTML`, `resumeHTML`, `contactHTML`, `gamesHTML` (now reading from `profile`/`skills`/`installedPrograms`/`profile.resumeUrl`) |
| `minesweeper.js` | `MS`, `msState`, and all `ms*` functions |
| `router.js` | `render`, `navBack` |
| `boot.js` | `updateClock`, `initBattery`, `showWelcome`, `enterDesktop`, `init`, listener wiring, the deep-link skip, and the boot timer. No data gating needed. |

Recommended script order in `phone.html`:

```
data/project-data.js
data/programs-data.js
data/profile-data.js
data/skills-data.js
js/phone/data.js
js/phone/pages.js
js/phone/minesweeper.js
js/phone/router.js
js/phone/boot.js
```

Both editions now read the same four `data/*.js` globals, so projects, tech stack, profile, skills, contact, and the resume path are single-source across desktop and phone.

---

## 8. HTML edits

### index.html
- In `<head>`, replace the single `vista-styles.css` link with the `css/desktop/*.css` links in this order: `base, boot-welcome, desktop, gadgets, window, content, taskbar-startmenu, minesweeper, pdf-reader, dark-theme, responsive`. Keep the Bootstrap, bootstrap-icons, and Font Awesome CDN links above them. Keep the phone device-guard `<script>` snippet that was added earlier.
- Before `</body>`, replace the five `<script>` tags with the data files then the desktop script list from 7.1.
- Inline handlers stay as-is. Do not convert to `addEventListener` (out of scope), and do not switch to ES modules, since that would break the inline handlers.

### phone.html
- Replace the single `phone-styles.css` link with the `css/phone/*.css` links: `base, aurora, boot-welcome, shell, home, window, minesweeper`.
- Replace the two script tags (`projectData.js` + `phone-script.js`) with the data files then the phone script list from 7.2.

---

## 9. Migration steps (ordered)

1. Create directories: `data/`, `css/desktop/`, `css/phone/`, `js/desktop/`, `js/phone/`.
2. Move `projectData.js` to `data/project-data.js` (keep the `projectData` global). Extract `installedPrograms` into `data/programs-data.js`. Extract profile/about + contact + resume path into `data/profile-data.js`, and skills into `data/skills-data.js`. These are plain scripts that assign globals.
3. Update consumers to read the shared globals and delete the duplicated/inlined copies: remove `installedPrograms` from `pageData.js`, and remove `phoneAbout`/`phoneSkills`/`phoneContact`/`installedPrograms`/`RESUME_URL` from the phone script. Converge about/skills/contact rendering on `profile`/`skills` where practical (or leave a TODO per section 5).
4. Split `vista-script.js` into `js/desktop/*` per 7.1. Remove the two inject-style calls in `windows.js`.
5. Move `pageData.js`, `mineSweeper.js`, `pdfReader.js` into `js/desktop/` with renames; strip the injected-style functions from the latter two.
6. Split `vista-styles.css` into `css/desktop/*` per 6.1. Create `minesweeper.css` and `pdf-reader.css` from the previously injected CSS. Consolidate both dark blocks into `dark-theme.css`.
7. Update `index.html` links and scripts per 8.
8. Repeat 4-7 for the phone edition: split `phone-styles.css` and `phone-script.js`, update `phone.html`.
9. Verify everything against the checklist, then delete the old monoliths: `vista-styles.css`, `vista-script.js`, `projectData.js`, `pageData.js`, `mineSweeper.js`, `pdfReader.js`.

Recommended to do the desktop edition end to end first, verify it, commit, then do the phone edition. Keeps each change reviewable.

---

## 10. Acceptance checklist

The site must still open directly from `file://` (double-click `index.html`) as well as over HTTP. Console must be clean (no errors).

Desktop:
- Boot screen plays, then welcome, then desktop. Double-clicking the boot screen still skips ahead.
- Every desktop icon and every Start menu item opens its window.
- Projects window renders all 6 cards; clicking a card opens the detail window.
- Documents view renders; double-click opens a project detail.
- Minesweeper opens, plays, flags on right-click, and Easy/Medium/Hard work. Styling matches the old injected look.
- Resume window renders the PDF with paging, zoom, fit-width, open, and download.
- Start menu search returns both window hits and project hits; Enter opens the top hit.
- Back/Forward in the toolbar, the in-app Back, browser Back/Forward, and Esc-to-close all behave as before.
- Drag, resize, Aero Snap (left/right/top), and marquee selection all work.
- Theme toggle flips dark mode; all dark-theme surfaces look correct (including Minesweeper and the welcome center cards).
- Responsive layout at <= 768px matches before.

Phone:
- Device guard routes phones to `phone.html` and larger screens to `index.html`; `?phone=1` and `?desktop=1` overrides work.
- Boot, welcome, then home. All seven launchers open. Project list and detail render. Resume opens/downloads `documents/CV2.pdf`. Contact links work. Minesweeper plays.
- Deep links (`#about`, `#project/project1`, etc.) skip boot and render the right page; dock orb and window back behave.

Data:
- Projects, tech stack, profile, skills, contact, and resume path are identical across both editions, sourced from `data/*.js`.
- No duplicated data copies remain in `page-data.js` or the phone script.

---

## 11. Decisions and assumptions

- Data stays as `.js` files that assign globals for now; JSON is deferred until the site is always served over HTTP. The site keeps working from `file://`.
- All content data is consolidated into `data/*.js` as a single source of truth, and the inlined/duplicated copies across the two editions are removed.
- Existing global names `projectData` and `installedPrograms` are preserved; `profile` and `skills` are introduced for the newly extracted data.
- New files are kebab-case under subdirectories.
- The phone edition is included as a parallel track and applies once the phone files are in the repo.

## 12. Out of scope

- JSON conversion (`data/*.json` + a `fetch`-based loader + async boot gating). Deferred to when the site is always served over HTTP.
- Any visual redesign or content change beyond relocating duplicated data.
- Migrating inline `onclick` handlers to `addEventListener`, or moving to ES modules / a bundler.
- Build tooling, minification, or a package manager.
- The earlier one-off content edits (processor joke, LinkedIn removal, the `Abobe` easter egg), which are unrelated to this refactor.
