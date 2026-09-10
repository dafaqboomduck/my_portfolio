// ========== BOOT + WELCOME ==========
const BOOT_SEEN_KEY = 'vistaBootSeen';

function bootSeen() {
    try { return localStorage.getItem(BOOT_SEEN_KEY) === '1'; } catch (e) { return false; }
}
function markBootSeen() {
    try { localStorage.setItem(BOOT_SEEN_KEY, '1'); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function () {
    tick();
    setInterval(tick, 1000);
    initCalendarGadget();

    const bootScreen = document.getElementById('bootScreen');

    // Returning visitor: skip boot + welcome entirely.
    if (bootSeen()) {
        bootScreen.classList.add('hidden');
        startDesktop();
        return;
    }

    let bootTimer = setTimeout(showWelcome, 1500);
    bootScreen.addEventListener('dblclick', () => { clearTimeout(bootTimer); showWelcome(); });

    function showWelcome() {
        bootScreen.classList.add('hidden');
        document.getElementById('welcomeScreen').classList.remove('hidden');
    }
});

function startDesktop() {
    markBootSeen();
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    history.replaceState(snapshot(), '', '#desktop');
    setTimeout(() => openWindow('welcome'), 300);
}