// ========== SYSTEM ACTIONS ==========
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
    if (typeof minesweeperGame !== 'undefined' && minesweeperGame) minesweeperGame.render();
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

    desktop.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.desktop-icon')) return;
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
    if (e.key === 'Escape') {
        const menu = document.getElementById('startMenu');
        if (menu && !menu.classList.contains('hidden')) { toggleStartMenu(); return; }
        if (activeWindow) userClose(activeWindow);
    }
    if (e.key === 'Enter') {
        if (e.target && e.target.id === 'startSearchInput') {
            const firstHit = document.querySelector('#startSearchResults .start-search-hit');
            if (firstHit) firstHit.click();
            return;
        }
        const sel = document.querySelector('.desktop-icon.selected');
        if (sel) {
            const m = (sel.getAttribute('ondblclick') || '').match(/openWindow\(['"]([^'"]+)['"]\)/);
            if (m) openWindow(m[1]);
        }
    }
});
