// ========== CLOCK + GADGETS ==========
function updateGadgetClock() {
    const now = new Date();
    const sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours();
    const hrDeg = (hr % 12) * 30 + (min / 2);
    const minDeg = min * 6 + (sec / 10);
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
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    const fullDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const clockEl = document.getElementById('trayClock');
    if (clockEl) {
        clockEl.innerHTML = `${time}<br>${date}`;
        clockEl.title = fullDate;
    }
    updateGadgetClock();
}
function updateClock() { tick(); }

function initCalendarGadget() {
    const grid = document.getElementById('calGrid');
    const header = document.getElementById('calMonthYear');
    if (!grid || !header) return;

    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth(), today = now.getDate();
    header.innerText = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    grid.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-day';
        el.style.fontWeight = 'bold';
        el.innerText = d;
        grid.appendChild(el);
    });
    for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day empty';
        grid.appendChild(el);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day' + (i === today ? ' today' : '');
        el.innerText = i;
        grid.appendChild(el);
    }
}
