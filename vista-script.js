// ========== WINDOWS VISTA PORTFOLIO SCRIPT ==========
// Core window management, navigation, boot sequence, and UI interaction.
// Depends on: projectData.js, pageData.js, mineSweeper.js, pdfReader.js
//
// Rebuilt "10x" layer: one rAF-batched pointer pipeline for drag/resize/marquee,
// real Aero Snap (edges + corners), working analog clock + calendar gadgets,
// and a single clean desktop-icon interaction model (click = select, dblclick = open).

// ========== STATE ==========
let windows = {};
let windowZIndex = 100;
let activeWindow = null;
let darkTheme = false;

const TASKBAR_H = 40;
const WIN_MIN_W = 400;
const WIN_MIN_H = 300;
const WIN_DEFAULT_W = 750;
const WIN_DEFAULT_H = 520;

let navigationHistory = {}; // Full back-stack per window
let scrollPositions = {};   // Saved scroll positions for back navigation

// Unified pointer interaction (drag / resize). Marquee tracked separately.
let pointer = { mode: null, id: null, startX: 0, startY: 0, startLeft: 0, startTop: 0, startW: 0, startH: 0 };
let currentSnapZone = null;
let lastPointerEvent = null;
let rafPending = false;

let marquee = { active: false, startX: 0, startY: 0, rects: [] };

// ========== DOM HELPERS (overlays created once) ==========
const snapPreview = document.createElement('div');
snapPreview.id = 'snapPreview';
document.body.appendChild(snapPreview);

const selectionBox = document.createElement('div');
selectionBox.id = 'selectionBox';
document.body.appendChild(selectionBox);

const desktopEl = () => document.getElementById('desktop');
const ctxMenuEl = () => document.getElementById('desktopContextMenu');

function rectOf(el) {
    return { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
}
function setGeom(el, l, t, w, h) {
    el.style.left = l + 'px';
    el.style.top = t + 'px';
    if (w != null) el.style.width = w + 'px';
    if (h != null) el.style.height = h + 'px';
}

// ========== NAVIGATION ==========
function buildHistoryStack(fromWindow) {
    if (!fromWindow) return [];
    const parentStack = navigationHistory[fromWindow] || [];
    return [...parentStack, fromWindow];
}

function navigateTo(fromWindowId, targetWindowId, openFn) {
    if (windows[fromWindowId]) {
        const content = windows[fromWindowId].element.querySelector('.window-content');
        if (content) scrollPositions[fromWindowId] = content.scrollTop;
    }
    const stack = buildHistoryStack(fromWindowId);
    closeWindow(fromWindowId);
    if (openFn) {
        openFn(stack);
    } else {
        openWindow(targetWindowId, null, stack);
    }
}

function navigateFromProjects(projectKey) { navigateTo('projects', null, (stack) => openProjectDetail(projectKey, stack)); }
function navigateFromDocuments(projectKey) { navigateTo('documents', null, (stack) => openProjectDetail(projectKey, stack)); }
function navigateFromGames(targetWindow) { navigateTo('games', targetWindow); }
function navigateFromControlPanel(targetWindow) { navigateTo('controlpanel', targetWindow); }
function navigateFromHelp(targetWindow) { navigateTo('help', targetWindow); }

// ========== PROJECT DETAIL ==========
function openProjectDetail(projectKey, historyStack) {
    const project = projectData[projectKey];
    if (!project) return;

    const detailId = 'project-' + projectKey;
    if (windows[detailId]) { focusWindow(detailId); return; }

    let stack;
    if (Array.isArray(historyStack)) stack = historyStack;
    else if (typeof historyStack === 'string') stack = buildHistoryStack(historyStack);
    else stack = [];

    const content = {
        title: project.title,
        icon: 'images/vista-explorer.png',
        path: `C:\\Users\\Razvan\\Documents\\Projects\\${project.title.replace(/[^a-zA-Z0-9]/g, '_')}`,
        content: generateProjectDetailContent(project)
    };
    createWindow(detailId, content, stack);
}

// ========== BOOT SEQUENCE ==========
document.addEventListener('DOMContentLoaded', function () {
    const bootScreen = document.getElementById('bootScreen');
    let bootTimer = setTimeout(showWelcome, 3500);
    bootScreen.addEventListener('dblclick', () => { clearTimeout(bootTimer); showWelcome(); });

    function showWelcome() {
        bootScreen.classList.add('hidden');
        document.getElementById('welcomeScreen').classList.remove('hidden');
    }

    // Single clock pipeline (tray + gadget), plus calendar gadget.
    tick();
    setInterval(tick, 1000);
    initCalendarGadget();
});

function startDesktop() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    setTimeout(() => openWindow('welcome'), 300); // Auto-open Welcome Center
}

// ========== WINDOW MANAGEMENT ==========
function createWindow(id, content, historyStack) {
    const windowEl = document.createElement('div');
    windowEl.className = 'vista-window';
    windowEl.id = 'window-' + id;
    windowEl.style.width = WIN_DEFAULT_W + 'px';
    windowEl.style.height = WIN_DEFAULT_H + 'px';
    windowEl.style.left = (100 + Object.keys(windows).length * 30) + 'px';
    windowEl.style.top = (50 + Object.keys(windows).length * 30) + 'px';

    navigationHistory[id] = Array.isArray(historyStack) ? historyStack : [];
    const hasHistory = navigationHistory[id].length > 0;

    windowEl.innerHTML = `
        <div class="window-titlebar" onmousedown="startDrag(event, '${id}')" ondblclick="maximizeWindow('${id}')">
            <img src="${content.icon}" class="window-icon" alt="">
            <span class="window-title">${content.title}</span>
            <div class="window-controls">
                <button class="window-btn window-btn-min" onclick="minimizeWindow('${id}')" title="Minimize">&minus;</button>
                <button class="window-btn window-btn-max" onclick="maximizeWindow('${id}')" title="Maximize">&#9744;</button>
                <button class="window-btn window-btn-close" onclick="closeWindow('${id}')" title="Close">&#10005;</button>
            </div>
        </div>
        <div class="window-toolbar">
            <button class="toolbar-btn ${hasHistory ? '' : 'disabled'}" onclick="goBack('${id}')" ${hasHistory ? '' : 'disabled'}>
                <i class="bi bi-arrow-left"></i><span>Back</span>
            </button>
            <button class="toolbar-btn disabled" disabled>
                <i class="bi bi-arrow-right"></i><span>Forward</span>
            </button>
            <div class="address-bar">
                <i class="bi bi-folder-fill"></i><span>${content.path}</span>
            </div>
        </div>
        <div class="window-content">${content.content}</div>
    `;

    // Resize grip (bottom-right)
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.addEventListener('mousedown', (ev) => startResize(ev, id));
    windowEl.appendChild(handle);

    document.getElementById('windowsContainer').appendChild(windowEl);

    windows[id] = { element: windowEl, minimized: false, maximized: false, prevRect: null };
    addToTaskbar(id, content);
    focusWindow(id);
    windowEl.addEventListener('mousedown', () => focusWindow(id));
}

function openWindow(id, fromWindow, historyStack) {
    if (windows[id]) {
        focusWindow(id);
        if (windows[id].minimized) {
            windows[id].minimized = false;
            document.getElementById('window-' + id).classList.remove('minimized');
        }
        return;
    }

    let content = windowContent[id];
    if (!content) return;

    let stack;
    if (Array.isArray(historyStack)) stack = historyStack;
    else if (fromWindow) stack = buildHistoryStack(fromWindow);
    else stack = [];

    if (id === 'projects') {
        content = { ...content, content: `
            <h2>📁 Featured Projects</h2>
            <p>Production-ready ML systems and full-stack implementations. Click any project for details.</p>
            ${generateProjectCards()}
        `};
    } else if (id === 'documents') {
        content = { ...content, content: `
            <h2>📂 My Documents</h2>
            <p>Double-click any file to view project details</p>
            ${generateDocumentsView()}
        `};
    } else if (id === 'programs') {
        content = { ...content, content: generateProgramsContent() };
    } else if (id === 'games') {
        content = { ...content, content: generateGamesContent() };
    } else if (id === 'resume') {
        content = { ...content, content: generatePdfReaderContent('documents/CV2.pdf') };
        createWindow(id, content, stack);
        injectPdfReaderStyles();
        setTimeout(() => {
            const container = document.querySelector('#window-' + id + ' .pdf-reader');
            if (container) initPdfReader(container);
        }, 100);
        return;
    } else if (id === 'minesweeper') {
        content = { ...content, content: `<div id="minesweeper-container"></div>` };
        createWindow(id, content, stack);
        injectMinesweeperStyles();
        setTimeout(() => {
            const container = document.getElementById('minesweeper-container');
            if (container) initMinesweeper(container);
        }, 100);
        return;
    } else if (id === 'controlpanel') {
        content = { ...content, content: generateControlPanelContent() };
    }

    createWindow(id, content, stack);
}

function closeWindow(id) {
    if (!windows[id]) return;
    windows[id].element.remove();
    delete windows[id];
    delete navigationHistory[id];
    const taskbarItem = document.getElementById('taskbar-' + id);
    if (taskbarItem) taskbarItem.remove();
    const remaining = Object.keys(windows);
    if (remaining.length > 0) focusWindow(remaining[remaining.length - 1]);
}

function goBack(id) {
    if (!navigationHistory[id] || navigationHistory[id].length === 0) return;
    const stack = [...navigationHistory[id]];
    const previousWindow = stack.pop();
    closeWindow(id);
    openWindow(previousWindow, null, stack);

    if (scrollPositions[previousWindow] != null && windows[previousWindow]) {
        const content = windows[previousWindow].element.querySelector('.window-content');
        if (content) {
            requestAnimationFrame(() => {
                content.scrollTop = scrollPositions[previousWindow];
                delete scrollPositions[previousWindow];
            });
        }
    }
}

function minimizeWindow(id) {
    if (!windows[id]) return;
    windows[id].minimized = true;
    windows[id].element.classList.add('minimized');
    const taskbarItem = document.getElementById('taskbar-' + id);
    if (taskbarItem) taskbarItem.classList.remove('active');
}

// Toggle maximize, or force on with forceOn === true. Remembers the prior
// rectangle so restore (and drag-to-unmaximize) returns to the right size.
function maximizeWindow(id, forceOn) {
    const w = windows[id];
    if (!w) return;
    const turnOn = forceOn === true ? true : !w.maximized;

    if (turnOn) {
        if (!w.maximized) w.prevRect = rectOf(w.element);
        w.maximized = true;
        w.element.classList.add('maximized');
    } else {
        w.maximized = false;
        w.element.classList.remove('maximized');
        if (w.prevRect) {
            setGeom(w.element, w.prevRect.left, w.prevRect.top, w.prevRect.width, w.prevRect.height);
            w.prevRect = null;
        }
    }
}

function focusWindow(id) {
    if (!windows[id]) return;
    document.querySelectorAll('.vista-window').forEach(w => w.classList.remove('active'));
    document.querySelectorAll('.taskbar-item').forEach(t => t.classList.remove('active'));
    windows[id].element.classList.add('active');
    windows[id].element.style.zIndex = ++windowZIndex;
    const taskbarItem = document.getElementById('taskbar-' + id);
    if (taskbarItem) taskbarItem.classList.add('active');
    activeWindow = id;
}

// ========== TASKBAR ==========
function addToTaskbar(id, content) {
    const taskbarWindows = document.getElementById('taskbarWindows');
    const item = document.createElement('div');
    item.className = 'taskbar-item active';
    item.id = 'taskbar-' + id;
    item.onclick = () => {
        if (windows[id].minimized) {
            windows[id].minimized = false;
            windows[id].element.classList.remove('minimized');
        }
        focusWindow(id);
    };
    item.innerHTML = `
        <div class="taskbar-preview">
            <img src="${content.icon}" alt="" style="width:32px; height:32px; display:block; margin:0 auto 5px auto;">
            <strong>${content.title}</strong>
        </div>
        <img src="${content.icon}" alt=""><span>${content.title}</span>`;
    taskbarWindows.appendChild(item);
}

// ========== POINTER PIPELINE (drag / resize / marquee, all rAF-batched) ==========

// Called from window titlebar: onmousedown="startDrag(event, 'id')"
function startDrag(e, id) {
    if (e.target.closest('.window-controls')) return;
    const w = windows[id];
    if (!w) return;
    focusWindow(id);

    // Dragging a maximized window restores it to a floating size under the cursor.
    if (w.maximized) {
        const pw = (w.prevRect && w.prevRect.width) || WIN_DEFAULT_W;
        const ph = (w.prevRect && w.prevRect.height) || WIN_DEFAULT_H;
        w.maximized = false;
        w.element.classList.remove('maximized');
        w.prevRect = null;
        const nl = Math.max(0, Math.min(e.clientX - pw / 2, window.innerWidth - pw));
        setGeom(w.element, nl, 0, pw, ph);
    }

    pointer.mode = 'drag';
    pointer.id = id;
    pointer.startX = e.clientX;
    pointer.startY = e.clientY;
    pointer.startLeft = w.element.offsetLeft;
    pointer.startTop = w.element.offsetTop;
    document.body.classList.add('is-dragging');
    e.preventDefault();
}

function startResize(e, id) {
    const w = windows[id];
    if (!w || w.maximized) return;
    focusWindow(id);
    pointer.mode = 'resize';
    pointer.id = id;
    pointer.startX = e.clientX;
    pointer.startY = e.clientY;
    pointer.startW = w.element.offsetWidth;
    pointer.startH = w.element.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
}

function onPointerMove(e) {
    lastPointerEvent = e;
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(processPointer);
    }
}

function processPointer() {
    rafPending = false;
    const e = lastPointerEvent;
    if (!e) return;

    if (pointer.mode === 'drag' && windows[pointer.id]) {
        const el = windows[pointer.id].element;
        let nx = pointer.startLeft + (e.clientX - pointer.startX);
        let ny = pointer.startTop + (e.clientY - pointer.startY);
        nx = Math.max(-(el.offsetWidth - 120), Math.min(nx, window.innerWidth - 120));
        ny = Math.max(0, Math.min(ny, window.innerHeight - TASKBAR_H - 28));
        el.style.left = nx + 'px';
        el.style.top = ny + 'px';
        detectSnap(e.clientX, e.clientY);

    } else if (pointer.mode === 'resize' && windows[pointer.id]) {
        const el = windows[pointer.id].element;
        const nw = Math.max(WIN_MIN_W, pointer.startW + (e.clientX - pointer.startX));
        const nh = Math.max(WIN_MIN_H, pointer.startH + (e.clientY - pointer.startY));
        el.style.width = nw + 'px';
        el.style.height = nh + 'px';

    } else if (marquee.active) {
        const l = Math.min(marquee.startX, e.clientX);
        const t = Math.min(marquee.startY, e.clientY);
        const w = Math.abs(e.clientX - marquee.startX);
        const h = Math.abs(e.clientY - marquee.startY);
        selectionBox.style.left = l + 'px';
        selectionBox.style.top = t + 'px';
        selectionBox.style.width = w + 'px';
        selectionBox.style.height = h + 'px';
        const sel = { left: l, top: t, right: l + w, bottom: t + h };
        // Icon rects were cached on mousedown -> no per-frame layout reads.
        marquee.rects.forEach(({ el, r }) => {
            const hit = r.right > sel.left && r.left < sel.right && r.bottom > sel.top && r.top < sel.bottom;
            el.classList.toggle('selected', hit);
        });
    }
}

function onPointerUp() {
    if (pointer.mode === 'drag') {
        document.body.classList.remove('is-dragging');
        if (currentSnapZone && windows[pointer.id]) applySnap(pointer.id);
    }
    pointer.mode = null;
    pointer.id = null;
    currentSnapZone = null;
    snapPreview.style.display = 'none';
    if (marquee.active) {
        marquee.active = false;
        selectionBox.style.display = 'none';
    }
}

// ---- Aero Snap ----
function detectSnap(x, y) {
    const availH = window.innerHeight - TASKBAR_H;
    let zone = null;
    if (y <= 6) zone = 'max';
    else if (x <= 6) zone = 'left';
    else if (x >= window.innerWidth - 6) zone = 'right';

    currentSnapZone = zone;
    if (!zone) { snapPreview.style.display = 'none'; return; }

    let g;
    if (zone === 'max') g = { left: 0, top: 0, width: window.innerWidth, height: availH };
    else if (zone === 'left') g = { left: 0, top: 0, width: Math.floor(window.innerWidth / 2), height: availH };
    else g = { left: Math.ceil(window.innerWidth / 2), top: 0, width: Math.floor(window.innerWidth / 2), height: availH };

    snapPreview.style.left = g.left + 'px';
    snapPreview.style.top = g.top + 'px';
    snapPreview.style.width = g.width + 'px';
    snapPreview.style.height = g.height + 'px';
    snapPreview.style.display = 'block';
}

function applySnap(id) {
    const w = windows[id];
    if (!w || !currentSnapZone) return;
    const availH = window.innerHeight - TASKBAR_H;

    if (currentSnapZone === 'max') {
        maximizeWindow(id, true);
        return;
    }
    // Half-snap: remember a restore size, then set explicit geometry.
    if (!w.prevRect) w.prevRect = { left: w.element.offsetLeft, top: w.element.offsetTop, width: WIN_DEFAULT_W, height: WIN_DEFAULT_H };
    w.maximized = false;
    w.element.classList.remove('maximized');
    if (currentSnapZone === 'left') setGeom(w.element, 0, 0, Math.floor(window.innerWidth / 2), availH);
    else setGeom(w.element, Math.ceil(window.innerWidth / 2), 0, Math.floor(window.innerWidth / 2), availH);
}

// Global pointer listeners (one each)
document.addEventListener('mousemove', (e) => { if (pointer.mode || marquee.active) onPointerMove(e); });
document.addEventListener('mouseup', onPointerUp);

// ========== START MENU ==========
function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) {
        const searchInput = document.getElementById('startSearchInput');
        if (searchInput) {
            searchInput.value = '';
            filterStartMenu('');
            setTimeout(() => searchInput.focus(), 100);
        }
    }
}

function filterStartMenu(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.start-menu-left .start-item').forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
    });
    document.querySelectorAll('.start-menu-right .start-item-right').forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
    });
}

// ========== CLOCK + GADGETS ==========
function updateGadgetClock() {
    const now = new Date();
    const sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours();
    const hrDeg = (hr % 12) * 30 + (min / 2);
    const minDeg = min * 6 + (sec / 10);
    const secDeg = sec * 6;
    const h = document.getElementById('gadgetHour');
    const m = document.getElementById('gadgetMinute');
    const s = document.getElementById('gadgetSecond');
    if (h) h.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;
    if (m) m.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    if (s) s.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
}

// Single tick drives tray clock AND the analog gadget (no fragile reassignment).
function tick() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    const fullDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const clockEl = document.getElementById('trayClock');
    if (clockEl) {
        clockEl.innerHTML = `${time}<br>${date}`;
        clockEl.title = fullDate;
    }
    updateGadgetClock();
}
// Back-compat alias in case anything else calls updateClock()
function updateClock() { tick(); }

function initCalendarGadget() {
    const grid = document.getElementById('calGrid');
    const header = document.getElementById('calMonthYear');
    if (!grid || !header) return;

    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth(), today = now.getDate();
    header.innerText = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    grid.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-day';
        el.style.fontWeight = 'bold';
        el.innerText = d;
        grid.appendChild(el);
    });
    for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day empty';
        grid.appendChild(el);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day' + (i === today ? ' today' : '');
        el.innerText = i;
        grid.appendChild(el);
    }
}

// ========== SHUTDOWN ==========
function shutdown() {
    toggleStartMenu();
    document.getElementById('shutdownScreen').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('desktop').classList.add('hidden');
        document.getElementById('shutdownScreen').innerHTML = `
            <div class="shutdown-content">
                <div style="color:#fff; text-align:center">
                    <p style="margin-bottom:20px">Thanks for visiting!</p>
                    <button onclick="location.reload()" class="vista-btn"><i class="bi bi-arrow-clockwise"></i> Restart</button>
                </div>
            </div>`;
    }, 2000);
}

// ========== CONTEXT MENU / DESKTOP ACTIONS ==========
function refreshDesktop() {
    const icons = document.querySelector('.desktop-icons');
    if (!icons) return;
    icons.style.display = 'none';
    setTimeout(() => icons.style.display = '', 100);
}

function toggleSidebar() {
    const sidebar = document.querySelector('.vista-sidebar');
    if (sidebar) sidebar.classList.toggle('hidden');
}

function changeWallpaper() {
    const d = document.getElementById('desktop');
    const wallpapers = [
        "url('images/window-vista-bkg.jpg') center/cover no-repeat",
        "radial-gradient(circle at center, #1a2a6c, #112 100%)",
        "linear-gradient(135deg, #2a6aaa 0%, #0a1628 100%)",
        "linear-gradient(135deg, #6a2a5a 0%, #16081a 100%)"
    ];
    let idx = parseInt(d.dataset.wpIdx || 0);
    idx = (idx + 1) % wallpapers.length;
    d.style.background = wallpapers[idx];
    d.style.backgroundColor = '#0a1628';
    d.dataset.wpIdx = idx;
}

// ========== SHOW DESKTOP (Aero peek equivalent) ==========
function toggleShowDesktop() {
    let allMinimized = true;
    for (const id in windows) { if (!windows[id].minimized) { allMinimized = false; break; } }

    if (allMinimized) {
        for (const id in windows) {
            if (windows[id].minimized) {
                windows[id].minimized = false;
                windows[id].element.classList.remove('minimized');
                const t = document.getElementById('taskbar-' + id);
                if (t) t.classList.add('active');
            }
        }
    } else {
        for (const id in windows) { if (!windows[id].minimized) minimizeWindow(id); }
    }
}

// ========== THEME ==========
function toggleTheme() {
    darkTheme = !darkTheme;
    document.body.classList.toggle('dark-theme', darkTheme);
    showNotification(darkTheme ? '🌙 Dark theme enabled' : '☀️ Light theme enabled');
}

function showNotification(message) {
    const existing = document.querySelector('.vista-notification');
    if (existing) existing.remove();
    const notif = document.createElement('div');
    notif.className = 'vista-notification';
    notif.innerHTML = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => { notif.classList.remove('show'); setTimeout(() => notif.remove(), 300); }, 2000);
}

// ========== DESKTOP ICON INTERACTION ==========
// Single click selects; double click opens (native ondblclick="openWindow('..')").
function deselectIcons() {
    document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
}

document.addEventListener('DOMContentLoaded', () => {
    const iconsContainer = document.querySelector('.desktop-icons');
    if (iconsContainer) {
        iconsContainer.addEventListener('click', (e) => {
            const icon = e.target.closest('.desktop-icon');
            if (!icon) return;
            deselectIcons();
            icon.classList.add('selected');
            e.stopPropagation();
        });
    }

    const desktop = desktopEl();
    if (!desktop) return;

    // Empty-desktop mousedown: deselect + begin marquee. Anything interactive bails out.
    desktop.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.desktop-icon')) return; // let icon handler manage selection
        if (e.target.closest('.vista-window, .taskbar, .start-menu, .vista-sidebar, .desktop-context-menu')) return;

        deselectIcons();
        marquee.active = true;
        marquee.startX = e.clientX;
        marquee.startY = e.clientY;
        marquee.rects = [...document.querySelectorAll('.desktop-icon')].map(ic => ({ el: ic, r: ic.getBoundingClientRect() }));
        selectionBox.style.left = e.clientX + 'px';
        selectionBox.style.top = e.clientY + 'px';
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
        selectionBox.style.display = 'block';
    });

    // Right-click desktop -> context menu
    desktop.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.vista-window, .taskbar')) return;
        e.preventDefault();
        const ctx = ctxMenuEl();
        ctx.style.left = e.clientX + 'px';
        ctx.style.top = e.clientY + 'px';
        ctx.classList.remove('hidden');
    });
});

// ========== GLOBAL CLICK: close start menu + context menu ==========
document.addEventListener('click', (e) => {
    const ctx = ctxMenuEl();
    if (ctx && !ctx.classList.contains('hidden') && !ctx.contains(e.target)) ctx.classList.add('hidden');

    const menu = document.getElementById('startMenu');
    const startBtn = document.querySelector('.start-button');
    if (menu && startBtn && !menu.contains(e.target) && !startBtn.contains(e.target)) menu.classList.add('hidden');
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) toggleStartMenu();
    if (e.key === 'Escape' && activeWindow) closeWindow(activeWindow);
    if (e.key === 'Enter') {
        const sel = document.querySelector('.desktop-icon.selected');
        if (sel) {
            const m = (sel.getAttribute('ondblclick') || '').match(/openWindow\(['"]([^'"]+)['"]\)/);
            if (m) openWindow(m[1]);
        }
    }
});