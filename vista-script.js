// ========== WINDOWS VISTA PORTFOLIO SCRIPT ==========
// Core window management, navigation, boot sequence, and UI interaction.
// Depends on: projectData.js, pageData.js, mineSweeper.js

// Window state management
let windows = {};
let windowZIndex = 100;
let activeWindow = null;
let dragState = { isDragging: false, window: null, offsetX: 0, offsetY: 0 };
let navigationHistory = {}; // Full back-stack per window
let scrollPositions = {};   // Saved scroll positions for back navigation

// ========== NAVIGATION ==========

// Build a full history stack: parent's stack + parent itself
function buildHistoryStack(fromWindow) {
    if (!fromWindow) return [];
    const parentStack = navigationHistory[fromWindow] || [];
    return [...parentStack, fromWindow];
}

// Navigate from a parent window to a target, preserving the full chain
function navigateTo(fromWindowId, targetWindowId, openFn) {
    // Save scroll position before closing
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

// Navigation dispatchers called from page content onclick handlers
function navigateFromProjects(projectKey) {
    navigateTo('projects', null, (stack) => openProjectDetail(projectKey, stack));
}

function navigateFromDocuments(projectKey) {
    navigateTo('documents', null, (stack) => openProjectDetail(projectKey, stack));
}

function navigateFromGames(targetWindow) {
    navigateTo('games', targetWindow);
}

function navigateFromControlPanel(targetWindow) {
    navigateTo('controlpanel', targetWindow);
}

function navigateFromHelp(targetWindow) {
    navigateTo('help', targetWindow);
}

// ========== PROJECT DETAIL ==========

function openProjectDetail(projectKey, historyStack) {
    const project = projectData[projectKey];
    if (!project) return;

    const detailId = 'project-' + projectKey;

    if (windows[detailId]) {
        focusWindow(detailId);
        return;
    }

    // Accept array (new) or string (legacy fallback)
    let stack;
    if (Array.isArray(historyStack)) {
        stack = historyStack;
    } else if (typeof historyStack === 'string') {
        stack = buildHistoryStack(historyStack);
    } else {
        stack = [];
    }

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
    setTimeout(() => {
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('welcomeScreen').classList.remove('hidden');
    }, 3500);

    updateClock();
    setInterval(updateClock, 1000);
});

function startDesktop() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    
    // Auto-open Welcome Center for first-time visitors
    setTimeout(() => openWindow('welcome'), 300);
}
// ========== WINDOW MANAGEMENT ==========

function createWindow(id, content, historyStack) {
    const windowEl = document.createElement('div');
    windowEl.className = 'vista-window';
    windowEl.id = 'window-' + id;
    windowEl.style.width = '750px';
    windowEl.style.height = '520px';
    windowEl.style.left = (100 + Object.keys(windows).length * 30) + 'px';
    windowEl.style.top = (50 + Object.keys(windows).length * 30) + 'px';

    navigationHistory[id] = Array.isArray(historyStack) ? historyStack : [];

    const hasHistory = navigationHistory[id].length > 0;

    windowEl.innerHTML = `
        <div class="window-titlebar" onmousedown="startDrag(event, '${id}')">
            <img src="${content.icon}" class="window-icon" alt="">
            <span class="window-title">${content.title}</span>
            <div class="window-controls">
                <button class="window-btn window-btn-min" onclick="minimizeWindow('${id}')" title="Minimize">─</button>
                <button class="window-btn window-btn-max" onclick="maximizeWindow('${id}')" title="Maximize">☐</button>
                <button class="window-btn window-btn-close" onclick="closeWindow('${id}')" title="Close">✕</button>
            </div>
        </div>
        <div class="window-toolbar">
            <button class="toolbar-btn ${hasHistory ? '' : 'disabled'}" onclick="goBack('${id}')" ${hasHistory ? '' : 'disabled'}>
                <i class="bi bi-arrow-left"></i>
                <span>Back</span>
            </button>
            <button class="toolbar-btn disabled" disabled>
                <i class="bi bi-arrow-right"></i>
                <span>Forward</span>
            </button>
            <div class="address-bar">
                <i class="bi bi-folder-fill"></i>
                <span>${content.path}</span>
            </div>
        </div>
        <div class="window-content">
            ${content.content}
        </div>
    `;

    document.getElementById('windowsContainer').appendChild(windowEl);

    windows[id] = { element: windowEl, minimized: false, maximized: false };
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

    // Determine history stack
    let stack;
    if (Array.isArray(historyStack)) {
        stack = historyStack;
    } else if (fromWindow) {
        stack = buildHistoryStack(fromWindow);
    } else {
        stack = [];
    }

    // Generate dynamic content where needed
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

    // Restore saved scroll position
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

function maximizeWindow(id) {
    if (!windows[id]) return;
    windows[id].maximized = !windows[id].maximized;
    windows[id].element.classList.toggle('maximized');
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
    item.innerHTML = `<img src="${content.icon}" alt=""><span>${content.title}</span>`;
    taskbarWindows.appendChild(item);
}

// ========== DRAG ==========

function startDrag(e, id) {
    if (e.target.closest('.window-controls')) return;
    if (windows[id].maximized) return;
    dragState.isDragging = true;
    dragState.window = id;
    const rect = windows[id].element.getBoundingClientRect();
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    focusWindow(id);
}

document.addEventListener('mousemove', (e) => {
    if (!dragState.isDragging) return;
    const windowEl = windows[dragState.window].element;
    let newX = Math.max(0, Math.min(e.clientX - dragState.offsetX, window.innerWidth - 100));
    let newY = Math.max(0, Math.min(e.clientY - dragState.offsetY, window.innerHeight - 100));
    windowEl.style.left = newX + 'px';
    windowEl.style.top = newY + 'px';
});

document.addEventListener('mouseup', () => {
    dragState.isDragging = false;
    dragState.window = null;
});

// ========== START MENU ==========

function toggleStartMenu() {
    document.getElementById('startMenu').classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('startMenu');
    const startBtn = document.querySelector('.start-button');
    if (!menu.contains(e.target) && !startBtn.contains(e.target)) menu.classList.add('hidden');
});

// ========== CLOCK ==========

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    document.getElementById('trayClock').innerHTML = `${time}<br>${date}`;
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
            </div>
        `;
    }, 2000);
}

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener('keydown', (e) => {
    if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) toggleStartMenu();
    if (e.key === 'Escape' && activeWindow) closeWindow(activeWindow);
});

// ========== DESKTOP ICON SELECTION ==========

document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', function () {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.getElementById('desktop')?.addEventListener('click', (e) => {
    if (e.target.id === 'desktop' || e.target.classList.contains('desktop')) {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    }
});

// ========== THEME TOGGLE ==========

let darkTheme = false;

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
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}