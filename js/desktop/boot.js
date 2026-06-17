// ========== BOOT + WELCOME ==========
document.addEventListener('DOMContentLoaded', function () {
    const bootScreen = document.getElementById('bootScreen');
    let bootTimer = setTimeout(showWelcome, 1500);
    bootScreen.addEventListener('dblclick', () => { clearTimeout(bootTimer); showWelcome(); });

    function showWelcome() {
        bootScreen.classList.add('hidden');
        document.getElementById('welcomeScreen').classList.remove('hidden');
    }

    tick();
    setInterval(tick, 1000);
    initCalendarGadget();
});

function startDesktop() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    history.replaceState(snapshot(), '', '#desktop');
    setTimeout(() => openWindow('welcome'), 300);
}
