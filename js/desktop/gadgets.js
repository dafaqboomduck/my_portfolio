// ========== CLOCK + GADGETS ==========
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
  if (h) h.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;
  if (m) m.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
  if (s) s.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
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