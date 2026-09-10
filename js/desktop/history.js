// ========== BROWSER HISTORY SYNC ==========
// A snapshot fully describes the navigable state of the desktop.
function snapshot() {
  const order = Object.keys(windows).sort(
    (a, b) =>
      (parseInt(windows[a].element.style.zIndex) || 0) -
      (parseInt(windows[b].element.style.zIndex) || 0),
  );
  const stacks = {};
  const minimized = {};
  order.forEach((id) => {
    stacks[id] = navigationHistory[id] ? [...navigationHistory[id]] : [];
    minimized[id] = !!windows[id].minimized;
  });
  return { order, stacks, minimized, active: activeWindow };
}

function hashForActive() {
  return activeWindow ? '#' + activeWindow : '#desktop';
}

// Push the current state as a new browser history entry (unless restoring / inside a compound action).
function pushNav() {
  if (isRestoring || suppressPush) return;
  history.pushState(snapshot(), '', hashForActive());
}

// Rebuild the desktop to match a snapshot (called on popstate). Pure window ops only — no pushes.
function restore(snap) {
  isRestoring = true;
  snap = snap || { order: [], stacks: {}, minimized: {}, active: null };
  const target = new Set(snap.order);

  // Close anything not in the target state.
  Object.keys(windows).forEach((id) => {
    if (!target.has(id)) closeWindow(id);
  });

  // Open everything in the target state, in stacking order.
  snap.order.forEach((id) => {
    if (!windows[id]) {
      const stack = snap.stacks[id] || [];
      if (id.startsWith('project-'))
        openProjectDetail(id.replace('project-', ''), stack);
      else openWindow(id, null, stack);
    }
    if (windows[id]) {
      const shouldMin = !!(snap.minimized && snap.minimized[id]);
      windows[id].minimized = shouldMin;
      windows[id].element.classList.toggle('minimized', shouldMin);
    }
  });

  if (snap.active && windows[snap.active]) focusWindow(snap.active);
  isRestoring = false;
}

window.addEventListener('popstate', (e) => restore(e.state));
