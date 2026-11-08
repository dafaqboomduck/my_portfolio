// Profile data — single source of truth for both desktop and phone editions.
const profile = {
  name: 'Razvan Nica',
  role: 'AI Engineer · Data Scientist · Software Developer',
  lede: 'Building intelligent systems from data.',
  paragraphs: [
    `I’m a third-year Data & AI student at Breda University of Applied Sciences.`,
    `I’ve worked on plant root detection with computer vision, emotion recognition in conversation,
         and route optimization. I care about the full path from data to deployment, and about
         models people can understand and trust.`,
  ],
  status: 'Available for opportunities · Breda, NL',
  education: [
    {
      school: 'Breda University of Applied Sciences',
      detail: 'BSc Data Science & Artificial Intelligence',
      dates: '2024–Present',
    },
    {
      school: 'National College "Cantemir Voda"',
      detail: 'Mathematics & Computer Science, Bilingual English',
      dates: '2020–2024',
    },
  ],
  // Newest first. Empty list hides the Experience tab and shows Education alone.
  // Same box as education: keep detail to one or two lines so the tabbed box
  // fits a maximized desktop window without scrolling.
  experience: [
    {
      role: 'Software & AI Engineer',
      company: 'Boostlogix',
      dates: 'Jan 2026–Present',
      detail:
        'Built a route optimization pipeline for a client, a CO2 calculator platform with dashboards and scenario simulation, and a demo suite showcasing Boostlogix projects; currently developing an intake chatbot that engages prospective clients before they connect with a consultant.',
    },
  ],
  achievements: [
    '<strong>Mar–Jun 2025:</strong> NASDAQ-100 Stock Price Prediction Platform',
    '<strong>Jan–Mar 2025:</strong> Top 3 Project · The Innovation Square (AI X-Ray System)',
  ],
    contact: {
    intro:
      "Let's build something together. I'm always open to new projects and opportunities.",
    email: 'razvan.al.nica@gmail.com',
    github: 'https://github.com/dafaqboomduck',
    githubLabel: 'github.com/dafaqboomduck',
    // LinkedIn: add { linkedin, linkedinLabel } here when ready.
  },
  // Keys into projectData, shown in this order on the About Me landing page.
  featuredProjects: ['project5', 'project1', 'project2'],
  resumeUrl: 'documents/CV2.pdf',
  resumeFileName: 'Razvan_Nica_CV.pdf',
};
