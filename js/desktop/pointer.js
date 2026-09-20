// ========== POINTER PIPELINE (drag / resize / marquee, all rAF-batched) ==========
function startDrag(e, id) {
  if (e.target.closest('.window-controls')) return;
  const w = windows[id];
  if (!w) return;
  focusWindow(id);

  if (w.maximized) {
    const pw = (w.prevRect && w.prevRect.width) || WIN_DEFAULT_W;
    const ph = (w.prevRect && w.prevRect.height) || WIN_DEFAULT_H;
    w.maximized = false;
    w.element.classList.remove('maximized');
    w.prevRect = null;
    const nl = Math.max(
      0,
      Math.min(e.clientX - pw / 2, window.innerWidth - pw),
    );
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
    nx = Math.max(
      -(el.offsetWidth - 120),
      Math.min(nx, window.innerWidth - 120),
    );
    ny = Math.max(0, Math.min(ny, window.innerHeight - TASKBAR_H - 28));
    el.style.left = nx + 'px';
    el.style.top = ny + 'px';
    detectSnap(e.clientX, e.clientY);
  } else if (pointer.mode === 'resize' && windows[pointer.id]) {
    const el = windows[pointer.id].element;
    const nw = Math.max(
      WIN_MIN_W,
      pointer.startW + (e.clientX - pointer.startX),
    );
    const nh = Math.max(
      WIN_MIN_H,
      pointer.startH + (e.clientY - pointer.startY),
    );
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
    marquee.rects.forEach(({ el, r }) => {
      const hit =
        r.right > sel.left &&
        r.left < sel.right &&
        r.bottom > sel.top &&
        r.top < sel.bottom;
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
  if (!zone) {
    snapPreview.style.display = 'none';
    return;
  }

  let g;
  if (zone === 'max')
    g = { left: 0, top: 0, width: window.innerWidth, height: availH };
  else if (zone === 'left')
    g = {
      left: 0,
      top: 0,
      width: Math.floor(window.innerWidth / 2),
      height: availH,
    };
  else
    g = {
      left: Math.ceil(window.innerWidth / 2),
      top: 0,
      width: Math.floor(window.innerWidth / 2),
      height: availH,
    };

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
  if (!w.prevRect)
    w.prevRect = {
      left: w.element.offsetLeft,
      top: w.element.offsetTop,
      width: WIN_DEFAULT_W,
      height: WIN_DEFAULT_H,
    };
  w.maximized = false;
  w.element.classList.remove('maximized');
  if (currentSnapZone === 'left')
    setGeom(w.element, 0, 0, Math.floor(window.innerWidth / 2), availH);
  else
    setGeom(
      w.element,
      Math.ceil(window.innerWidth / 2),
      0,
      Math.floor(window.innerWidth / 2),
      availH,
    );
}

document.addEventListener('mousemove', (e) => {
  if (pointer.mode || marquee.active) onPointerMove(e);
});
document.addEventListener('mouseup', onPointerUp);
