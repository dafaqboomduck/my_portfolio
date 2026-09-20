// ========== BOOT + LOGON ==========
const BOOT_SEEN_KEY = 'vistaBootSeen';

// Stage timings (real hardware is much slower; these are the readable versions)
const BOOT_BAR_MS = 2400; // loader progress bar
const BOOT_BLACK_MS = 500; // black gap after the bar
const BOOT_ORB_MS = 1600; // glowing orb on black
const LOGON_WELCOME_MS = 1800; // "Welcome" + spinner after clicking the tile
const LOGON_FADE_MS = 700; // fade to black before the desktop

let bootTimers = [];

function bootSeen() {
  try {
    return localStorage.getItem(BOOT_SEEN_KEY) === '1';
  } catch (e) {
    return false;
  }
}
function markBootSeen() {
  try {
    localStorage.setItem(BOOT_SEEN_KEY, '1');
  } catch (e) {}
}
function skipBootRequested() {
  return /[?&]skipboot=1/.test(location.search);
}
function later(fn, ms) {
  bootTimers.push(setTimeout(fn, ms));
}

document.addEventListener('DOMContentLoaded', function () {
  tick();
  setInterval(tick, 1000);
  initCalendarGadget();

  const boot = document.getElementById('bootScreen');
  const orb = document.getElementById('orbScreen');

  // Returning visitor or ?skipboot=1: skip boot + logon entirely.
  if (bootSeen() || skipBootRequested()) {
    boot.classList.add('hidden');
    startDesktop();
    return;
  }

  // bar -> black -> orb -> cross-fade into the logon screen
  later(() => {
    boot.classList.add('hidden');
    later(() => {
      orb.classList.remove('hidden');
      requestAnimationFrame(() => orb.classList.add('visible'));
      later(() => {
        orb.classList.remove('visible');
        showLogon();
        later(() => orb.classList.add('hidden'), 600);
      }, BOOT_ORB_MS);
    }, BOOT_BLACK_MS);
  }, BOOT_BAR_MS);

  // Double-click skips the boot animation.
  const skip = () => {
    bootTimers.forEach(clearTimeout);
    bootTimers = [];
    boot.classList.add('hidden');
    orb.classList.add('hidden');
    showLogon();
  };
  boot.addEventListener('dblclick', skip);
  orb.addEventListener('dblclick', skip);
});

function showLogon() {
  const screen = document.getElementById('welcomeScreen');
  if (!screen || !screen.classList.contains('hidden')) return;
  screen.classList.remove('hidden');
  requestAnimationFrame(() => screen.classList.add('visible'));
}

// Clicking the user tile: tile out, "Welcome" + spinner in, fade to black, desktop.
function logon() {
  const tile = document.getElementById('logonTile');
  const status = document.getElementById('logonStatus');
  if (!tile || tile.dataset.done === '1') return;
  tile.dataset.done = '1';

  tile.classList.add('hidden');
  status.classList.remove('hidden');

  later(() => {
    document.getElementById('welcomeScreen').classList.add('fading');
    later(startDesktop, LOGON_FADE_MS);
  }, LOGON_WELCOME_MS);
}

function startDesktop() {
  markBootSeen();
  const screen = document.getElementById('welcomeScreen');
  if (screen) screen.classList.add('hidden');
  document.getElementById('desktop').classList.remove('hidden');
  history.replaceState(snapshot(), '', '#desktop');
  setTimeout(() => openWindow('welcome'), 300);
}
