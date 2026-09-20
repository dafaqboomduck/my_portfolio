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

let navigationHistory = {}; // Per-window drill back-stack
let scrollPositions = {}; // Saved scroll positions for back navigation

// History sync guards
let isRestoring = false; // true while restoring from a popstate -> never push
let suppressPush = false; // true inside a compound action -> inner ops don't push; the action pushes once

// Unified pointer interaction (drag / resize). Marquee tracked separately.
let pointer = {
  mode: null,
  id: null,
  startX: 0,
  startY: 0,
  startLeft: 0,
  startTop: 0,
  startW: 0,
  startH: 0,
};
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
  return {
    left: el.offsetLeft,
    top: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}
function setGeom(el, l, t, w, h) {
  el.style.left = l + 'px';
  el.style.top = t + 'px';
  if (w != null) el.style.width = w + 'px';
  if (h != null) el.style.height = h + 'px';
}
