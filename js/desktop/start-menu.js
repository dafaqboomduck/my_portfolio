// ========== START MENU ==========
function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) {
        const searchInput = document.getElementById('startSearchInput');
        if (searchInput) {
            searchInput.value = '';
            filterStartMenu('');
            setTimeout(() => searchInput.focus(), 100);
        }
    }
}

// ========== START MENU SEARCH ==========
let _searchIndex = null;
function getSearchIndex() {
    if (_searchIndex) return _searchIndex;
    _searchIndex = [
        { id: 'about',        label: 'About Me',         icon: 'bi-person-fill',           keywords: 'about me background education bio who profile' },
        { id: 'skills',       label: 'My Skills',        icon: 'bi-gear-wide-connected',   keywords: 'skills competencies tech expertise ml nlp computer vision mlops backend' },
        { id: 'projects',     label: 'Projects',         icon: 'bi-folder-fill',           keywords: 'projects work portfolio builds featured ml systems' },
        { id: 'documents',    label: 'Documents',        icon: 'bi-folder2-open',          keywords: 'documents files my documents' },
        { id: 'contact',      label: 'Contact Me',       icon: 'bi-envelope-fill',         keywords: 'contact email linkedin github network reach get in touch outlook' },
        { id: 'resume',       label: 'Resume (CV)',      icon: 'bi-file-earmark-pdf-fill', keywords: 'resume cv pdf curriculum vitae download' },
        { id: 'recycle',      label: 'Recycle Bin',      icon: 'bi-trash3',                keywords: 'recycle bin trash deleted' },
        { id: 'games',        label: 'Games',            icon: 'bi-controller',            keywords: 'games play minesweeper' },
        { id: 'minesweeper',  label: 'Minesweeper',      icon: 'bi-grid-3x3-gap-fill',     keywords: 'minesweeper mines game play' },
        { id: 'programs',     label: 'Default Programs', icon: 'bi-box-seam-fill',         keywords: 'default programs technologies stack tools installed software' },
        { id: 'computer',     label: 'Computer',         icon: 'bi-pc-display',            keywords: 'computer system drives specs hardware my computer' },
        { id: 'controlpanel', label: 'Control Panel',    icon: 'bi-sliders',               keywords: 'control panel settings preferences personalization theme dark light' },
        { id: 'help',         label: 'Help and Support', icon: 'bi-question-circle-fill',  keywords: 'help support guide assistance how to faq' }
    ];
    if (typeof projectData !== 'undefined') {
        Object.entries(projectData).forEach(([key, p]) => {
            _searchIndex.push({
                id: 'project-' + key,
                projectKey: key,
                label: p.title,
                icon: 'bi-file-earmark-code',
                keywords: (p.title + ' ' + p.tag + ' ' + (p.technologies || []).join(' ')).toLowerCase()
            });
        });
    }
    return _searchIndex;
}

function ensureSearchResultsEl() {
    let el = document.getElementById('startSearchResults');
    if (el) return el;
    const programs = document.querySelector('.start-programs');
    if (!programs) return null;
    el = document.createElement('div');
    el.id = 'startSearchResults';
    el.style.display = 'none';
    programs.parentNode.insertBefore(el, programs.nextSibling);
    return el;
}

function openSearchResult(item) {
    if (!item) return;
    if (item.projectKey) openProjectDetail(item.projectKey, []);
    else openWindow(item.id);
    toggleStartMenu(); // close the menu
}

// Live search across every location (windows + project pages)
function filterStartMenu(query) {
    const q = (query || '').trim().toLowerCase();
    const programs = document.querySelector('.start-programs');
    const right = document.querySelector('.start-menu-right');
    const results = ensureSearchResultsEl();

    if (!q) { // empty -> normal two-column menu
        if (programs) programs.style.display = '';
        if (right) right.style.display = '';
        if (results) { results.style.display = 'none'; results.innerHTML = ''; }
        return;
    }

    const tokens = q.split(/\s+/);
    const matches = getSearchIndex().filter(item => {
        const hay = (item.label + ' ' + item.keywords).toLowerCase();
        return tokens.every(t => hay.includes(t));
    });

    if (programs) programs.style.display = 'none';
    if (right) right.style.display = 'none';
    if (!results) return;
    results.style.display = '';

    if (matches.length === 0) {
        results.innerHTML = `<div class="start-search-empty">No results found</div>`;
        return;
    }
    results.innerHTML = matches.map(m =>
        `<div class="start-item start-search-hit" data-id="${m.id}"><i class="bi ${m.icon}"></i><span>${m.label}</span></div>`
    ).join('');
    results.querySelectorAll('.start-search-hit').forEach(el => {
        el.addEventListener('click', () => openSearchResult(getSearchIndex().find(x => x.id === el.dataset.id)));
    });
}
