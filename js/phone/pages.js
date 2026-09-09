/* ============================================================
   Windows Vista Portfolio — Phone Edition: page builders
   Reads from: profile (data/profile-data.js),
               skills  (data/skills-data.js),
               installedPrograms (data/programs-data.js),
               projectData (data/project-data.js)
   ============================================================ */
'use strict';

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

/* ---------- page builders ---------- */

function homeHTML() {
    let h = '<div class="home">';
    h += '<div class="today glass"><span class="today-av"><i class="bi bi-person-fill"></i></span>' +
         '<div><div class="today-name">' + esc(profile.name) + '</div><div class="today-role">Data Scientist · AI Engineer</div></div></div>';
    h += '<div class="launchers">';
    launchers.forEach(function (t) {
        h += '<button class="launch" data-go="' + t.route + '">' +
                '<span class="launch-icon ' + t.color + '"><i class="bi ' + t.glyph + '"></i></span>' +
                '<span class="launch-label">' + esc(t.label) + '</span>' +
             '</button>';
    });
    h += '</div>';
    h += '<div class="home-foot">Windows Vista Portfolio · Phone Edition<br>' +
         '<span class="home-beta"><span class="beta-tag">BETA</span> For the full experience, view the desktop edition on a laptop or PC</span><br>' +
         '<a href="index.html?desktop=1">View desktop edition →</a></div>';
    h += '</div>';
    return h;
}

function aboutHTML() {
    const a = profile;
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
    skills.forEach(function (s) {
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
    const url = profile.resumeUrl;
    let b = '<div class="doc"><div class="doc-top"><i class="bi bi-file-earmark-pdf-fill"></i>' +
            '<div><div class="doc-name">Razvan_Nica_CV.pdf</div><div class="doc-meta">PDF document</div></div></div></div>';
    b += '<a class="btn-aero" href="' + url + '" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i><span>Open resume</span></a>';
    b += '<a class="btn-aero secondary" href="' + url + '" download><i class="bi bi-download"></i><span>Download</span></a>';
    return win('Resume', 'bi-file-earmark-pdf-fill', b);
}

function contactHTML() {
    const c = profile.contact;
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
