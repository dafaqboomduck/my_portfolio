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
                <button class="window-btn window-btn-close" onclick="userClose('${id}')" title="Close">&#10005;</button>
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
        const wasActive = (activeWindow === id) && !windows[id].minimized;
        focusWindow(id);
        if (windows[id].minimized) {
            windows[id].minimized = false;
            document.getElementById('window-' + id).classList.remove('minimized');
        }
        if (!wasActive) pushNav();
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
        // Styles are now linked statically in index.html; skip injectPdfReaderStyles().
        setTimeout(() => {
            const container = document.querySelector('#window-' + id + ' .pdf-reader');
            if (container) initPdfReader(container);
        }, 100);
        pushNav();
        return;
    } else if (id === 'minesweeper') {
        content = { ...content, content: `<div id="minesweeper-container"></div>` };
        createWindow(id, content, stack);
        // Styles are now linked statically in index.html; skip injectMinesweeperStyles().
        setTimeout(() => {
            const container = document.getElementById('minesweeper-container');
            if (container) initMinesweeper(container);
        }, 100);
        pushNav();
        return;
    } else if (id === 'controlpanel') {
        content = { ...content, content: generateControlPanelContent() };
    }

    createWindow(id, content, stack);
    pushNav();
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
    else activeWindow = null;
}

// User-initiated close (the X button / Esc) — records a history entry.
function userClose(id) {
    closeWindow(id);
    pushNav();
}

// In-app Back button: step up the drill stack. Counts as ONE history entry.
function goBack(id) {
    if (!navigationHistory[id] || navigationHistory[id].length === 0) return;
    const stack = [...navigationHistory[id]];
    const previousWindow = stack.pop();

    suppressPush = true;
    closeWindow(id);
    if (previousWindow.startsWith('project-')) openProjectDetail(previousWindow.replace('project-', ''), stack);
    else openWindow(previousWindow, null, stack);
    suppressPush = false;
    pushNav();

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
