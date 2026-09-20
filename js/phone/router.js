/* ============================================================
   Windows Vista Portfolio — Phone Edition: router
   ============================================================ */
'use strict';

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
  if (raw.indexOf('project/') === 0) {
    view.innerHTML = projectDetailHTML(raw.slice('project/'.length));
    return;
  }

  switch (raw) {
    case 'about':
      view.innerHTML = aboutHTML();
      break;
    case 'projects':
      view.innerHTML = projectsHTML();
      break;
    case 'skills':
      view.innerHTML = skillsHTML();
      break;
    case 'tech':
      view.innerHTML = techHTML();
      break;
    case 'resume':
      view.innerHTML = resumeHTML();
      break;
    case 'contact':
      view.innerHTML = contactHTML();
      break;
    case 'games':
      view.innerHTML = gamesHTML();
      initMinesweeper();
      break;
    default:
      location.replace('#home');
  }
}

function navBack() {
  if (location.hash && location.hash !== '#home') {
    if (history.length > 1) history.back();
    else location.hash = 'home';
  }
}
