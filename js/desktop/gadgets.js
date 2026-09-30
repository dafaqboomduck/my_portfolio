// ========== CLOCK + GADGETS ==========
const SVG_NS = 'http://www.w3.org/2000/svg';

function initClockGadget() {
  const marks = document.getElementById('clockMarks');
  if (!marks) return;
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180;
    const sin = Math.sin(a),
      cos = Math.cos(a);
    if (i % 5 === 0) {
      const tick = document.createElementNS(SVG_NS, 'line');
      tick.setAttribute('class', 'clock-tick');
      tick.setAttribute('x1', 100 + 74 * sin);
      tick.setAttribute('y1', 100 - 74 * cos);
      tick.setAttribute('x2', 100 + 81 * sin);
      tick.setAttribute('y2', 100 - 81 * cos);
      marks.appendChild(tick);

      const num = document.createElementNS(SVG_NS, 'text');
      num.setAttribute('class', 'clock-num');
      num.setAttribute('x', 100 + 61 * sin);
      num.setAttribute('y', 100 - 61 * cos);
      num.textContent = i === 0 ? 12 : i / 5;
      marks.appendChild(num);
    } else {
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'clock-dot');
      dot.setAttribute('cx', 100 + 78 * sin);
      dot.setAttribute('cy', 100 - 78 * cos);
      dot.setAttribute('r', 1);
      marks.appendChild(dot);
    }
  }
}

function updateGadgetClock() {
  const now = new Date();
  const sec = now.getSeconds(),
    min = now.getMinutes(),
    hr = now.getHours();
  const hrDeg = (hr % 12) * 30 + min / 2;
  const minDeg = min * 6 + sec / 10;
  const secDeg = sec * 6;
  const h = document.getElementById('gadgetHour');
  const m = document.getElementById('gadgetMinute');
  const s = document.getElementById('gadgetSecond');
  if (h) h.setAttribute('transform', `rotate(${hrDeg} 100 100)`);
  if (m) m.setAttribute('transform', `rotate(${minDeg} 100 100)`);
  if (s) s.setAttribute('transform', `rotate(${secDeg} 100 100)`);
}

function tick() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = now.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
  const fullDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const clockEl = document.getElementById('trayClock');
  if (clockEl) {
    clockEl.innerHTML = `${time}<br>${date}`;
    clockEl.title = fullDate;
  }
  updateGadgetClock();
}
function updateClock() {
  tick();
}

let calViewDate = new Date();

function renderCalendarMonth() {
  const grid = document.getElementById('calGrid');
  const dow = document.getElementById('calDow');
  const label = document.getElementById('calMonthLabel');
  if (!grid || !dow || !label) return;

  const now = new Date();
  const year = calViewDate.getFullYear(),
    month = calViewDate.getMonth();

  label.innerText = calViewDate.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });

  dow.innerHTML = '';
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) => {
    const el = document.createElement('div');
    if (i === now.getDay()) el.className = 'is-today';
    el.innerText = d;
    dow.appendChild(el);
  });

  const start = new Date(year, month, 1 - new Date(year, month, 1).getDay());
  grid.innerHTML = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i
    );
    const el = document.createElement('div');
    el.className = 'cal-day';
    if (d.getMonth() !== month) el.classList.add('other');
    if (d.toDateString() === now.toDateString()) el.classList.add('today');
    el.innerText = d.getDate();
    grid.appendChild(el);
  }
}

function renderCalendarPage() {
  const now = new Date();
  const m = document.getElementById('calPageMonth');
  const d = document.getElementById('calPageDay');
  const w = document.getElementById('calPageDow');
  if (m)
    m.innerText = now.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  if (d) d.innerText = now.getDate();
  if (w) w.innerText = now.toLocaleDateString('en-US', { weekday: 'long' });
}

function initCalendarGadget() {
  const gadget = document.getElementById('calendarGadget');
  if (!gadget) return;

  document.getElementById('calPrev').addEventListener('click', () => {
    calViewDate = new Date(
      calViewDate.getFullYear(),
      calViewDate.getMonth() - 1,
      1
    );
    renderCalendarMonth();
  });
  document.getElementById('calNext').addEventListener('click', () => {
    calViewDate = new Date(
      calViewDate.getFullYear(),
      calViewDate.getMonth() + 1,
      1
    );
    renderCalendarMonth();
  });
  document.getElementById('calPage').addEventListener('click', () => {
    gadget.classList.toggle('expanded');
    calViewDate = new Date();
    renderCalendarMonth();
  });

  renderCalendarPage();
  renderCalendarMonth();
}