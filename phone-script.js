/* ============================================================
   Windows Vista Portfolio — Phone Edition (logic)
   Depends on projectData.js (shared with the desktop edition).
   About / Skills / Tech / Contact content is inlined below so
   this edition stays self-contained and slim.
   ============================================================ */
'use strict';

/* ---------- inlined content ---------- */

const phoneAbout = {
    role: 'Data Scientist · AI Engineer · Backend Developer',
    lede: 'Building intelligent systems from data to deployment — deep learning, computer vision, NLP, and production-ready ML applications.',
    paragraphs: [
        'I\'m a Data & AI student at Breda University specializing in production-ready machine learning systems. I build end-to-end solutions: from model training to deployment, with expertise in deep learning, computer vision, and natural language processing.',
        'My work spans healthcare diagnostics, financial analytics, and predictive modeling. I focus on scalable, explainable AI systems that integrate into real-world workflows.'
    ],
    status: 'Available for opportunities · Based in the Netherlands',
    education: [
        { school: 'Breda University of Applied Sciences', detail: 'BSc Data Science & Artificial Intelligence' },
        { school: 'National College "Cantemir Voda"', detail: 'Mathematics & Computer Science, Bilingual English' }
    ],
    achievements: [
        '<strong>Mar–Jun 2025:</strong> NASDAQ-100 Stock Price Prediction Platform',
        '<strong>Jan–Mar 2025:</strong> Top 3 Project — The Innovation Square (AI X-Ray System)'
    ]
};

const phoneSkills = [
    { icon: 'bi-graph-up', name: 'ML Development', desc: 'End-to-end ML pipelines, Scikit-learn, ensemble methods' },
    { icon: 'bi-server', name: 'MLOps & Deployment', desc: 'CI/CD, containerization, Flask APIs' },
    { icon: 'bi-code-slash', name: 'Backend Development', desc: 'Flask, PostgreSQL, SQLAlchemy, JWT' },
    { icon: 'bi-eye', name: 'Computer Vision', desc: 'CNNs, TensorFlow/Keras, Grad-CAM, LIME' },
    { icon: 'bi-chat-dots', name: 'NLP & Transformers', desc: 'BERT, GPT, Hugging Face, fine-tuning' }
];

/* mirrors installedPrograms in pageData.js (desktop edition) */
const installedPrograms = [
    { name: 'Python 3.11', icon: 'bi-filetype-py', category: 'Programming Languages', publisher: 'Python Software Foundation' },
    { name: 'TensorFlow 2.x', icon: 'bi-gpu-card', category: 'Deep Learning', publisher: 'Google' },
    { name: 'Keras', icon: 'bi-layers', category: 'Deep Learning', publisher: 'Keras Team' },
    { name: 'Pandas', icon: 'bi-table', category: 'Data Analysis', publisher: 'NumFOCUS' },
    { name: 'NumPy', icon: 'bi-grid-3x3', category: 'Scientific Computing', publisher: 'NumFOCUS' },
    { name: 'Scikit-learn', icon: 'bi-diagram-3', category: 'Machine Learning', publisher: 'Scikit-learn Developers' },
    { name: 'PostgreSQL', icon: 'bi-database', category: 'Database', publisher: 'PostgreSQL Global Dev Group' },
    { name: 'Flask', icon: 'bi-server', category: 'Web Framework', publisher: 'Pallets Projects' },
    { name: 'PyQt5', icon: 'bi-window', category: 'GUI Framework', publisher: 'Riverbank Computing' },
    { name: 'HTML5 / CSS3 / JavaScript', icon: 'bi-code-slash', category: 'Web Development', publisher: 'W3C' },
    { name: 'Power BI Desktop', icon: 'bi-bar-chart-fill', category: 'Business Intelligence', publisher: 'Microsoft Corporation' },
    { name: 'Git', icon: 'bi-git', category: 'Version Control', publisher: 'Git Community' },
    { name: 'XGBoost', icon: 'bi-tree', category: 'Machine Learning', publisher: 'DMLC' },
    { name: 'OpenCV', icon: 'bi-eye', category: 'Computer Vision', publisher: 'OpenCV Team' },
    { name: 'SQLAlchemy', icon: 'bi-database-gear', category: 'ORM', publisher: 'SQLAlchemy Authors' }
];

const phoneContact = {
    email: 'razvan.al.nica@gmail.com',
    github: 'https://github.com/dafaqboomduck',
    githubLabel: 'github.com/dafaqboomduck'
    // LinkedIn: add { linkedin, linkedinLabel } here and a contact-row in contactHTML() when ready.
};

const RESUME_URL = 'documents/CV2.pdf';
const PROJECT_COLORS = ['#4aa8ec', '#23b3b0', '#54bf64', '#ed9a3e', '#9a6fd0', '#d65a8e'];

/* home launchers */
const launchers = [
    { route: 'about',    label: 'About Me',    glyph: 'bi-person-fill',          color: 'c-blue' },
    { route: 'projects', label: 'Projects',    glyph: 'bi-folder-fill',          color: 'c-teal' },
    { route: 'skills',   label: 'Skills',      glyph: 'bi-gear-wide-connected',  color: 'c-green' },
    { route: 'tech',     label: 'Tech',        glyph: 'bi-cpu-fill',             color: 'c-magenta' },
    { route: 'resume',   label: 'Resume',      glyph: 'bi-file-earmark-pdf-fill', color: 'c-orange' },
    { route: 'contact',  label: 'Contact',     glyph: 'bi-envelope-fill',        color: 'c-purple' },
    { route: 'games',    label: 'Minesweeper', glyph: 'bi-grid-3x3-gap-fill',    color: 'c-blue2' }
];

/* ---------- helpers ---------- */

function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
}
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function pad3(n) { return ('00' + n).slice(-3); }
function fmtTime(d) {
    let h = d.getHours(); const m = pad(d.getMinutes());
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return h + ':' + m + ' ' + ampm;
}

/* a fullscreen Vista "window" wrapper for a page */
function win(title, icon, bodyHTML) {
    return '<div class="win">' +
        '<div class="win-titlebar glass">' +
            '<button class="tb-back" data-back="1" aria-label="Back"><i class="bi bi-chevron-left"></i></button>' +
            '<span class="tb-icon"><i class="bi ' + icon + '"></i></span>' +
            '<span class="tb-title">' + esc(title) + '</span>' +
        '</div>' +
        '<div class="win-body">' + bodyHTML + '</div>' +
    '</div>';
}

/* ---------- clock + battery ---------- */

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

/* ---------- pages ---------- */

function homeHTML() {
    let h = '<div class="home">';
    h += '<div class="today glass"><span class="today-av"><i class="bi bi-person-fill"></i></span>' +
         '<div><div class="today-name">Razvan Nica</div><div class="today-role">Data Scientist · AI Engineer</div></div></div>';
    h += '<div class="launchers">';
    launchers.forEach(function (t) {
        h += '<button class="launch" data-go="' + t.route + '">' +
                '<span class="launch-icon ' + t.color + '"><i class="bi ' + t.glyph + '"></i></span>' +
                '<span class="launch-label">' + esc(t.label) + '</span>' +
             '</button>';
    });
    h += '</div>';
    h += '<div class="home-foot">Windows Vista Portfolio · Phone Edition<br>' +
         '<a href="index.html?desktop=1">View desktop edition →</a></div>';
    h += '</div>';
    return h;
}

function aboutHTML() {
    const a = phoneAbout;
    let b = '<p class="lede"><span class="role">' + esc(a.role) + '</span></p>';
    b += '<p>' + esc(a.lede) + '</p>';
    a.paragraphs.forEach(function (p) { b += '<p>' + esc(p) + '</p>'; });
    b += '<div class="card"><h4>Current status</h4><p>' + esc(a.status) + '</p></div>';
    b += '<h3>Education</h3>';
    a.education.forEach(function (e) {
        b += '<div class="card"><h4>' + esc(e.school) + '</h4><p>' + esc(e.detail) + '</p></div>';
    });
    b += '<h3>Recent achievements</h3><ul>';
    a.achievements.forEach(function (x) { b += '<li>' + x + '</li>'; });
    b += '</ul>';
    return win('About Me', 'bi-person-fill', b);
}

function projectsHTML() {
    let b = '';
    let i = 0;
    for (const key in projectData) {
        const p = projectData[key];
        const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
        b += '<button class="row" data-go="project/' + key + '">' +
                '<span class="row-accent" style="background:' + color + '"></span>' +
                '<span class="row-main">' +
                    '<span class="row-title">' + esc(p.title) + '</span>' +
                    '<span class="row-sub">' + esc(p.description) + '</span>' +
                    '<span class="row-tag">' + esc(p.tag) + '</span>' +
                '</span>' +
                '<i class="bi bi-chevron-right chev"></i>' +
             '</button>';
        i++;
    }
    return win('Projects', 'bi-folder-fill', b);
}

function projectDetailHTML(id) {
    const p = projectData[id];
    if (!p) return win('Project', 'bi-folder-fill', '<p>That project could not be found.</p>');

    let b = '<h2 class="proj-title">' + esc(p.title) + '</h2>';
    b += '<span class="tag">' + esc(p.tag) + '</span>';
    b += '<div class="card"><h4>Overview</h4><p>' + esc(p.fullDescription) + '</p></div>';
    b += '<h3>Technologies</h3><div class="chips">';
    p.technologies.forEach(function (t) { b += '<span class="chip">' + esc(t) + '</span>'; });
    b += '</div>';
    b += '<h3>Key features</h3><ul>';
    p.features.forEach(function (f) { b += '<li>' + esc(f) + '</li>'; });
    b += '</ul>';
    b += '<h3>Achievements</h3><ul>';
    p.achievements.forEach(function (x) { b += '<li>' + esc(x) + '</li>'; });
    b += '</ul>';
    const hasGit = p.github && p.github !== '#';
    const hasDemo = p.demo && p.demo !== '#';
    if (hasGit) b += '<a class="btn-aero" href="' + esc(p.github) + '" target="_blank" rel="noopener"><i class="bi bi-github"></i><span>View on GitHub</span></a>';
    if (hasDemo) b += '<a class="btn-aero secondary" href="' + esc(p.demo) + '" target="_blank" rel="noopener"><i class="bi bi-play-circle"></i><span>Live demo</span></a>';
    return win('Project', 'bi-folder-fill', b);
}

function skillsHTML() {
    let b = '';
    phoneSkills.forEach(function (s) {
        b += '<div class="skill"><i class="bi ' + s.icon + '"></i><div>' +
                '<div class="s-name">' + esc(s.name) + '</div>' +
                '<div class="s-desc">' + esc(s.desc) + '</div></div></div>';
    });
    b += '<div class="card" style="margin-top:18px"><h4>Full technology stack</h4>' +
         '<p>See the <a href="#tech">Tech</a> tile for every tool in my environment.</p></div>';
    return win('Skills', 'bi-gear-wide-connected', b);
}

function techHTML() {
    let b = '';
    const cats = [];
    installedPrograms.forEach(function (p) { if (cats.indexOf(p.category) === -1) cats.push(p.category); });
    cats.forEach(function (cat) {
        b += '<div class="tech-cat">' + esc(cat) + '</div>';
        installedPrograms.filter(function (p) { return p.category === cat; }).forEach(function (p) {
            b += '<div class="tech-item"><i class="bi ' + p.icon + '"></i><div>' +
                    '<div class="ti-name">' + esc(p.name) + '</div>' +
                    '<div class="ti-pub">' + esc(p.publisher) + '</div></div></div>';
        });
    });
    return win('Tech', 'bi-cpu-fill', b);
}

function resumeHTML() {
    let b = '<div class="doc"><div class="doc-top"><i class="bi bi-file-earmark-pdf-fill"></i>' +
            '<div><div class="doc-name">Razvan_Nica_CV.pdf</div><div class="doc-meta">PDF document</div></div></div></div>';
    b += '<a class="btn-aero" href="' + RESUME_URL + '" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i><span>Open resume</span></a>';
    b += '<a class="btn-aero secondary" href="' + RESUME_URL + '" download><i class="bi bi-download"></i><span>Download</span></a>';
    return win('Resume', 'bi-file-earmark-pdf-fill', b);
}

function contactHTML() {
    const c = phoneContact;
    let b = '<p>Let\'s build something together. I\'m always open to new projects and opportunities.</p>';
    b += '<a class="contact-row" href="mailto:' + esc(c.email) + '"><i class="bi bi-envelope-fill"></i>' +
         '<div><div class="cr-label">Email</div><div class="cr-value">' + esc(c.email) + '</div></div></a>';
    b += '<a class="contact-row" href="' + esc(c.github) + '" target="_blank" rel="noopener"><i class="bi bi-github"></i>' +
         '<div><div class="cr-label">GitHub</div><div class="cr-value">' + esc(c.githubLabel) + '</div></div></a>';
    // LinkedIn: uncomment and fill in when ready
    // b += '<a class="contact-row" href="' + esc(c.linkedin) + '" target="_blank" rel="noopener"><i class="bi bi-linkedin"></i>' +
    //      '<div><div class="cr-label">LinkedIn</div><div class="cr-value">' + esc(c.linkedinLabel) + '</div></div></a>';
    return win('Contact', 'bi-envelope-fill', b);
}

function gamesHTML() {
    const board =
        '<div class="ms"><div class="ms-board">' +
            '<div class="ms-hud">' +
                '<span class="ms-count" id="msMines">010</span>' +
                '<button class="ms-face" id="msFace">🙂</button>' +
                '<span class="ms-count time" id="msTime">000</span>' +
            '</div>' +
            '<div class="ms-tools">' +
                '<button class="ms-mode on" id="msDig"><i class="bi bi-hand-index-thumb"></i> dig</button>' +
                '<button class="ms-mode" id="msFlag"><i class="bi bi-flag-fill"></i> flag</button>' +
            '</div>' +
            '<div class="ms-grid" id="msGrid"></div>' +
            '<div class="ms-msg" id="msMsg">tap a tile to start · long-press to flag</div>' +
        '</div></div>';
    return win('Minesweeper', 'bi-grid-3x3-gap-fill', board);
}

/* ---------- router ---------- */

function render() {
    const raw = location.hash.replace(/^#\/?/, '') || 'home';
    const view = document.getElementById('view');
    const dock = document.querySelector('.dock');
    window.scrollTo(0, 0);

    if (raw === 'home' || raw === 'start') {
        view.innerHTML = homeHTML();
        if (dock) dock.classList.remove('hidden');
        return;
    }
    if (raw.indexOf('project/') === 0) { view.innerHTML = projectDetailHTML(raw.slice('project/'.length)); return; }

    switch (raw) {
        case 'about':    view.innerHTML = aboutHTML(); break;
        case 'projects': view.innerHTML = projectsHTML(); break;
        case 'skills':   view.innerHTML = skillsHTML(); break;
        case 'tech':     view.innerHTML = techHTML(); break;
        case 'resume':   view.innerHTML = resumeHTML(); break;
        case 'contact':  view.innerHTML = contactHTML(); break;
        case 'games':    view.innerHTML = gamesHTML(); initMinesweeper(); break;
        default:         location.replace('#home');
    }
}

function navBack() {
    if (location.hash && location.hash !== '#home') {
        if (history.length > 1) history.back();
        else location.hash = 'home';
    }
}

/* ---------- minesweeper (touch) ---------- */

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

/* ---------- boot → welcome → home ---------- */

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
    setTimeout(showWelcome, 2200);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}