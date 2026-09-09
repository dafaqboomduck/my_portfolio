/* ============================================================
   Windows Vista Portfolio — Phone Edition: boot + shell init
   ============================================================ */
'use strict';

function updateClock() {
    const now = new Date();
    const bc = document.getElementById('barClock');
    if (bc) bc.textContent = fmtTime(now);
}

function initBattery() {
    if (!navigator.getBattery) return;
    navigator.getBattery().then(function (b) {
        function apply() {
            const pct = Math.round(b.level * 100);
            const fill = document.getElementById('battFill');
            const txt = document.getElementById('battPct');
            if (fill) fill.style.width = pct + '%';
            if (txt) txt.textContent = pct + '%';
        }
        apply();
        b.addEventListener('levelchange', apply);
    }).catch(function () {});
}

function showWelcome() {
    document.getElementById('boot').classList.add('hidden');
    document.getElementById('welcome').classList.remove('hidden');
}

function enterDesktop(skipAnim) {
    const welcome = document.getElementById('welcome');
    const boot = document.getElementById('boot');
    const phone = document.getElementById('phone');
    boot.classList.add('hidden');
    phone.classList.remove('hidden');
    render();
    if (skipAnim) { welcome.classList.add('hidden'); return; }
    welcome.classList.add('fading');
    setTimeout(function () { welcome.classList.add('hidden'); }, 350);
}

function init() {
    updateClock();
    setInterval(updateClock, 1000);
    initBattery();

    // dock orb → home
    document.getElementById('abHome').addEventListener('click', function () { location.hash = 'home'; });

    // tile / row navigation + window back (delegated, survives re-renders)
    document.getElementById('view').addEventListener('click', function (e) {
        const go = e.target.closest('[data-go]');
        if (go) { location.hash = go.getAttribute('data-go'); return; }
        const back = e.target.closest('[data-back]');
        if (back) { navBack(); }
    });

    // welcome → desktop
    let entered = false;
    document.getElementById('userTile').addEventListener('click', function () {
        if (entered) return; entered = true; enterDesktop(false);
    });

    window.addEventListener('hashchange', render);

    // deep links / shared URLs skip boot + welcome
    const deep = location.hash && location.hash !== '#home' && location.hash !== '#start' && location.hash !== '#';
    if (deep) { entered = true; enterDesktop(true); return; }

    // boot animation, then welcome
    setTimeout(showWelcome, 4000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
