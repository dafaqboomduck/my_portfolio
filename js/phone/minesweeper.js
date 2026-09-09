/* ============================================================
   Windows Vista Portfolio — Phone Edition: Minesweeper
   ============================================================ */
'use strict';

const MS = { rows: 9, cols: 9, mines: 10 };
let msState = null;

function initMinesweeper() {
    const grid = document.getElementById('msGrid');
    if (!grid) return;

    const avail = Math.min(window.innerWidth - 44, 360);
    let cell = Math.floor((avail - (MS.cols - 1) * 3) / MS.cols);
    cell = Math.max(26, Math.min(36, cell));
    grid.style.setProperty('--ms-cell', cell + 'px');
    grid.style.gridTemplateColumns = 'repeat(' + MS.cols + ', ' + cell + 'px)';

    msReset();

    document.getElementById('msFace').onclick = msReset;
    document.getElementById('msDig').onclick = function () { msSetFlagMode(false); };
    document.getElementById('msFlag').onclick = function () { msSetFlagMode(true); };

    let lpTimer = null, lpFired = false;
    grid.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    grid.addEventListener('pointerdown', function (e) {
        const c = e.target.closest('.ms-cell'); if (!c) return;
        lpFired = false;
        lpTimer = setTimeout(function () { lpFired = true; msToggleFlag(+c.dataset.r, +c.dataset.c); }, 420);
    });
    const clearLp = function () { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } };
    grid.addEventListener('pointerup', clearLp);
    grid.addEventListener('pointercancel', clearLp);
    grid.addEventListener('pointermove', clearLp);
    grid.addEventListener('click', function (e) {
        const c = e.target.closest('.ms-cell'); if (!c) return;
        if (lpFired) { lpFired = false; return; }
        const r = +c.dataset.r, col = +c.dataset.c;
        if (msState.flagMode) msToggleFlag(r, col); else msReveal(r, col);
    });
}

function msSetFlagMode(on) {
    if (!msState) return;
    msState.flagMode = on;
    document.getElementById('msDig').classList.toggle('on', !on);
    document.getElementById('msFlag').classList.toggle('on', on);
}

function msReset() {
    if (msState && msState.timer) clearInterval(msState.timer);
    msState = { grid: [], revealed: [], flagged: [], started: false, over: false, win: false, flagMode: false, time: 0, timer: null, revealedCount: 0 };
    for (let r = 0; r < MS.rows; r++) {
        msState.grid[r] = []; msState.revealed[r] = []; msState.flagged[r] = [];
        for (let c = 0; c < MS.cols; c++) { msState.grid[r][c] = 0; msState.revealed[r][c] = false; msState.flagged[r][c] = false; }
    }
    document.getElementById('msFace').textContent = '🙂';
    document.getElementById('msTime').textContent = '000';
    document.getElementById('msMsg').textContent = 'tap a tile to start · long-press to flag';
    msSetFlagMode(false);
    msRenderGrid();
    msUpdateMineCount();
}

function msPlaceMines(safeR, safeC) {
    let placed = 0;
    while (placed < MS.mines) {
        const r = Math.floor(Math.random() * MS.rows);
        const c = Math.floor(Math.random() * MS.cols);
        if (msState.grid[r][c] === -1) continue;
        if (r === safeR && c === safeC) continue;
        msState.grid[r][c] = -1; placed++;
    }
    for (let r = 0; r < MS.rows; r++) {
        for (let c = 0; c < MS.cols; c++) {
            if (msState.grid[r][c] === -1) continue;
            let n = 0;
            msNeighbors(r, c, function (rr, cc) { if (msState.grid[rr][cc] === -1) n++; });
            msState.grid[r][c] = n;
        }
    }
}

function msNeighbors(r, c, fn) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const rr = r + dr, cc = c + dc;
            if (rr >= 0 && rr < MS.rows && cc >= 0 && cc < MS.cols) fn(rr, cc);
        }
    }
}

function msStartTimer() {
    msState.started = true;
    msState.timer = setInterval(function () {
        msState.time = Math.min(999, msState.time + 1);
        document.getElementById('msTime').textContent = pad3(msState.time);
    }, 1000);
}

function msToggleFlag(r, c) {
    if (msState.over || msState.revealed[r][c]) return;
    if (!msState.started) msStartTimer();
    msState.flagged[r][c] = !msState.flagged[r][c];
    msRenderCell(r, c);
    msUpdateMineCount();
}

function msReveal(r, c) {
    if (msState.over || msState.revealed[r][c] || msState.flagged[r][c]) return;
    if (!msState.started) { msPlaceMines(r, c); msStartTimer(); }

    if (msState.grid[r][c] === -1) { msState.revealed[r][c] = true; msLose(r, c); return; }

    const stack = [[r, c]];
    while (stack.length) {
        const cur = stack.pop();
        const cr = cur[0], cc = cur[1];
        if (msState.revealed[cr][cc] || msState.flagged[cr][cc]) continue;
        msState.revealed[cr][cc] = true;
        msState.revealedCount++;
        msRenderCell(cr, cc);
        if (msState.grid[cr][cc] === 0) {
            msNeighbors(cr, cc, function (rr, ccc) { if (!msState.revealed[rr][ccc]) stack.push([rr, ccc]); });
        }
    }
    if (msState.revealedCount === MS.rows * MS.cols - MS.mines) msWin();
}

function msLose(br, bc) {
    msState.over = true;
    if (msState.timer) clearInterval(msState.timer);
    for (let r = 0; r < MS.rows; r++) {
        for (let c = 0; c < MS.cols; c++) {
            if (msState.grid[r][c] === -1) { msState.revealed[r][c] = true; msRenderCell(r, c, r === br && c === bc); }
        }
    }
    document.getElementById('msFace').textContent = '😵';
    document.getElementById('msMsg').textContent = 'boom — tap the face to try again';
}

function msWin() {
    msState.over = true; msState.win = true;
    if (msState.timer) clearInterval(msState.timer);
    document.getElementById('msFace').textContent = '😎';
    document.getElementById('msMsg').textContent = 'cleared in ' + msState.time + 's — nice';
}

function msUpdateMineCount() {
    let flags = 0;
    for (let r = 0; r < MS.rows; r++) for (let c = 0; c < MS.cols; c++) if (msState.flagged[r][c]) flags++;
    document.getElementById('msMines').textContent = pad3(Math.max(0, MS.mines - flags));
}

function msRenderGrid() {
    const grid = document.getElementById('msGrid');
    let html = '';
    for (let r = 0; r < MS.rows; r++) {
        for (let c = 0; c < MS.cols; c++) html += '<button class="ms-cell" data-r="' + r + '" data-c="' + c + '"></button>';
    }
    grid.innerHTML = html;
}

function msRenderCell(r, c, boom) {
    const grid = document.getElementById('msGrid');
    const cell = grid.querySelector('.ms-cell[data-r="' + r + '"][data-c="' + c + '"]');
    if (!cell) return;
    cell.className = 'ms-cell';
    cell.textContent = '';
    if (msState.flagged[r][c]) { cell.classList.add('flag'); cell.innerHTML = '<i class="bi bi-flag-fill"></i>'; return; }
    if (msState.revealed[r][c]) {
        cell.classList.add('revealed');
        const v = msState.grid[r][c];
        if (v === -1) { if (boom) cell.classList.add('boom'); cell.innerHTML = '<i class="bi bi-asterisk"></i>'; }
        else if (v > 0) { cell.classList.add('n' + v); cell.textContent = v; }
    }
}
