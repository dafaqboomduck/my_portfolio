/* ============================================================
   Windows Vista Portfolio — Phone Edition: UI data
   Content globals (profile, skills, installedPrograms) are
   loaded from data/ before this file.
   ============================================================ */
'use strict';

const PROJECT_COLORS = [
  '#4aa8ec',
  '#23b3b0',
  '#54bf64',
  '#ed9a3e',
  '#9a6fd0',
  '#d65a8e',
];

const launchers = [
  {
    route: 'about',
    label: 'About Me',
    glyph: 'bi-person-fill',
    color: 'c-blue',
  },
  {
    route: 'projects',
    label: 'Projects',
    glyph: 'bi-folder-fill',
    color: 'c-teal',
  },
  {
    route: 'skills',
    label: 'Skills',
    glyph: 'bi-gear-wide-connected',
    color: 'c-green',
  },
  { route: 'tech', label: 'Tech', glyph: 'bi-cpu-fill', color: 'c-magenta' },
  {
    route: 'resume',
    label: 'Resume',
    glyph: 'bi-file-earmark-pdf-fill',
    color: 'c-orange',
  },
  {
    route: 'contact',
    label: 'Contact',
    glyph: 'bi-envelope-fill',
    color: 'c-purple',
  },
  {
    route: 'games',
    label: 'Minesweeper',
    glyph: 'bi-grid-3x3-gap-fill',
    color: 'c-blue2',
  },
];
