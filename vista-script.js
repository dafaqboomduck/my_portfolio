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
    let bootTimer = setTimeout(() => {
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('welcomeScreen').classList.remove('hidden');
    }, 3500);
    
    document.getElementById('bootScreen').addEventListener('dblclick', () => {
        clearTimeout(bootTimer);
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('welcomeScreen').classList.remove('hidden');
    });

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
    item.innerHTML = `
        <div class="taskbar-preview">
            <img src="${content.icon}" alt="" style="width:32px; height:32px; display:block; margin: 0 auto 5px auto;">
            <strong>${content.title}</strong>
        </div>
        <img src="${content.icon}" alt=""><span>${content.title}</span>`;
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
    const fullDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const clockEl = document.getElementById('trayClock');
    clockEl.innerHTML = `${time}<br>${date}`;
    clockEl.title = fullDate;
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
// ========== 10x IMPROVEMENTS SCRIPT ==========

// Sidebar Gadget Clock Logic
function updateGadgetClock() {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();
    
    const hrDeg = (hr % 12) * 30 + (min / 2);
    const minDeg = min * 6 + (sec / 10);
    const secDeg = sec * 6;
    
    const hHand = document.getElementById("gadgetHour");
    const mHand = document.getElementById("gadgetMinute");
    const sHand = document.getElementById("gadgetSecond");
    
    if (hHand) hHand.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;
    if (mHand) mHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    if (sHand) sHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
}

// Modify existing updateClock to also update gadget
const originalUpdateClock = typeof updateClock !== "undefined" ? updateClock : function(){};
updateClock = function() {
    originalUpdateClock();
    updateGadgetClock();
};

// Context Menu Logic
const desktop = document.getElementById("desktop");
const ctxMenu = document.getElementById("desktopContextMenu");

function showContextMenu(e) {
    if (e.target.closest(".vista-window") || e.target.closest(".taskbar")) {
        return; // Ensure only desktop triggers it
    }
    e.preventDefault();
    ctxMenu.style.left = e.clientX + "px";
    ctxMenu.style.top = e.clientY + "px";
    ctxMenu.classList.remove("hidden");
    hideSelectionBox();
}

document.addEventListener("click", function(e) {
    if (ctxMenu && !ctxMenu.classList.contains("hidden")) {
        ctxMenu.classList.add("hidden");
    }
});

function refreshDesktop() {
    const icons = document.querySelector(".desktop-icons");
    icons.style.display = "none";
    setTimeout(() => icons.style.display = "", 100);
}

function toggleSidebar() {
    const sidebar = document.querySelector(".vista-sidebar");
    if (sidebar) sidebar.classList.toggle("hidden");
}

function changeWallpaper() {
    const desktopEl = document.getElementById("desktop");
    const wallpapers = [
        "url(\"images/vista-bg.jpg\")",
        "radial-gradient(circle at center, #1a2a6c, #112 100%)",
        "url(\"https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=1920\")",
        "url(\"https://images.unsplash.com/photo-1542451313056-b7c8e6266459?auto=format&fit=crop&q=80&w=1920\")"
    ];
    let currentIdx = desktopEl.dataset.wpIdx || 0;
    currentIdx = (parseInt(currentIdx) + 1) % wallpapers.length;
    desktopEl.style.background = wallpapers[currentIdx];
    desktopEl.style.backgroundSize = "cover";
    desktopEl.dataset.wpIdx = currentIdx;
}

// Selection Box Logic
const selectionBox = document.createElement("div");
selectionBox.id = "selectionBox";
document.body.appendChild(selectionBox);

let selStartX, selStartY, isSelecting = false;

desktop.addEventListener("mousedown", function(e) {
    if (e.button !== 0) return; // Only left click
    if (e.target.closest(".desktop-icon") || e.target.closest(".vista-window") || e.target.closest(".taskbar") || e.target.closest(".start-menu") || e.target.closest(".vista-sidebar") || e.target.closest(".desktop-context-menu")) return;
    
    isSelecting = true;
    selStartX = e.clientX;
    selStartY = e.clientY;
    
    selectionBox.style.left = selStartX + "px";
    selectionBox.style.top = selStartY + "px";
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
    selectionBox.style.display = "block";
});

document.addEventListener("mousemove", function(e) {
    if (!isSelecting) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const left = Math.min(selStartX, currentX);
    const top = Math.min(selStartY, currentY);
    const width = Math.abs(currentX - selStartX);
    const height = Math.abs(currentY - selStartY);
    
    selectionBox.style.left = left + "px";
    selectionBox.style.top = top + "px";
    selectionBox.style.width = width + "px";
    selectionBox.style.height = height + "px";

    // Optional: add visual feedback for icons caught in the selection
    const icons = document.querySelectorAll(".desktop-icon");
    const selRect = selectionBox.getBoundingClientRect();
    icons.forEach(icon => {
        const iconRect = icon.getBoundingClientRect();
        if (
            iconRect.right > selRect.left &&
            iconRect.left < selRect.right &&
            iconRect.bottom > selRect.top &&
            iconRect.top < selRect.bottom
        ) {
            icon.style.background = "rgba(255, 255, 255, 0.2)";
            icon.style.borderRadius = "4px";
            icon.style.border = "1px dotted rgba(255,255,255,0.4)";
        } else {
            icon.style.background = "";
            icon.style.border = "1px border transparent";
        }
    });
});

document.addEventListener("mouseup", function(e) {
    hideSelectionBox();
});

function hideSelectionBox() {
    isSelecting = false;
    selectionBox.style.display = "none";
}


desktop.addEventListener("contextmenu", showContextMenu);



document.addEventListener("mouseup", function(e) {
    if (dragState && dragState.isDragging && dragState.window) {
        const id = dragState.window;
        if (windows[id]) {
            windows[id].element.style.opacity = "";
            windows[id].element.style.transition = "";
            if (e.clientY < 10 && !windows[id].maximized) {
                maximizeWindow(id);
            }
        }
    }
});

// Cursor wait when clicking icons
document.querySelectorAll(".desktop-icon").forEach(icon => {
    icon.addEventListener("dblclick", () => {
        document.body.style.cursor = "wait";
        setTimeout(() => document.body.style.cursor = "default", 300);
    });
    icon.addEventListener("click", () => {
        document.querySelectorAll(".desktop-icon").forEach(i => {
            i.style.background = "";
            i.style.border = "1px solid transparent";
            i.classList.remove("selected");
        });
        icon.style.background = "rgba(255, 255, 255, 0.2)";
        icon.style.border = "1px dotted rgba(255, 255, 255, 0.5)";
        icon.style.borderRadius = "4px";
        icon.classList.add("selected");
    });
});

// Deselect on desktop click
desktop.addEventListener("mousedown", (e) => {
    if(!e.target.closest(".desktop-icon")) {
        document.querySelectorAll(".desktop-icon.selected").forEach(i => {
            i.style.background = "";
            i.style.border = "1px solid transparent";
            i.classList.remove("selected");
        });
    }
});



function initCalendarGadget() {
    const grid = document.getElementById("calGrid");
    const header = document.getElementById("calMonthYear");
    if (!grid || !header) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    header.innerText = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    grid.innerHTML = "";
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    days.forEach(d => {
        const el = document.createElement("div");
        el.className = "cal-day";
        el.style.fontWeight = "bold";
        el.innerText = d;
        grid.appendChild(el);
    });

    for (let i = 0; i < firstDay; i++) {
        const el = document.createElement("div");
        el.className = "cal-day empty";
        grid.appendChild(el);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const el = document.createElement("div");
        el.className = "cal-day" + (i === today ? " today" : "");
        el.innerText = i;
        grid.appendChild(el);
    }
}
setTimeout(initCalendarGadget, 500);


