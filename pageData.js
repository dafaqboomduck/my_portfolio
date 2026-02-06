// ========== PAGE DATA & CONTENT GENERATORS ==========
// All static page content, installed programs list, and dynamic HTML generators.
// Loaded before vista-script.js. Depends on projectData.js for project entries.

// Technology stack for Default Programs
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

// ========== DYNAMIC CONTENT GENERATORS ==========

function generateProjectCards() {
    let html = '';
    for (const [key, project] of Object.entries(projectData)) {
        html += `
            <div class="project-vista-card clickable" onclick="navigateFromProjects('${key}')">
                <div class="project-vista-header">${project.title}</div>
                <div class="project-vista-body">
                    <span class="project-vista-tag">${project.tag}</span>
                    <p>${project.description}</p>
                    <div class="project-vista-tech">
                        ${project.technologies.slice(0, 5).map(t => `<span class="tech-vista-badge">${t}</span>`).join('')}
                    </div>
                    <div class="view-more">Click to view details →</div>
                </div>
            </div>
        `;
    }
    return html;
}

function generateDocumentsView() {
    let html = '<div class="documents-grid">';
    for (const [key, project] of Object.entries(projectData)) {
        const iconClass = project.tag.includes('AI') || project.tag.includes('Healthcare') ? 'bi-file-earmark-medical' :
                         project.tag.includes('Financial') ? 'bi-file-earmark-bar-graph' :
                         project.tag.includes('Sports') ? 'bi-file-earmark-play' :
                         project.tag.includes('International') ? 'bi-file-earmark-person' : 'bi-file-earmark-code';
        html += `
            <div class="document-item" ondblclick="navigateFromDocuments('${key}')">
                <i class="bi ${iconClass}"></i>
                <span>${project.title.substring(0, 25)}${project.title.length > 25 ? '...' : ''}</span>
            </div>
        `;
    }
    html += '</div>';
    return html;
}

function generateGamesContent() {
    return `
        <h2>🎮 Games</h2>
        <p>Classic Windows games for your entertainment</p>
        
        <div class="games-grid">
            <div class="game-item" ondblclick="navigateFromGames('minesweeper')">
                <i class="bi bi-grid-3x3-gap-fill"></i>
                <span>Minesweeper</span>
            </div>
            <div class="game-item coming-soon">
                <i class="bi bi-suit-spade-fill"></i>
                <span>Solitaire</span>
                <small>Coming Soon</small>
            </div>
            <div class="game-item coming-soon">
                <i class="bi bi-heart-fill"></i>
                <span>Hearts</span>
                <small>Coming Soon</small>
            </div>
            <div class="game-item coming-soon">
                <i class="bi bi-puzzle-fill"></i>
                <span>Purble Place</span>
                <small>Coming Soon</small>
            </div>
        </div>
        
        <div class="vista-info-box" style="margin-top:20px">
            <h4>💡 Tip</h4>
            <p style="margin:0">Double-click Minesweeper to start playing! Right-click to place flags.</p>
        </div>
    `;
}

function generateControlPanelContent() {
    return `
        <h2>⚙️ Control Panel</h2>
        <p>Adjust portfolio settings and preferences</p>
        
        <div class="cp-grid">
            <div class="cp-item" onclick="navigateFromControlPanel('programs')">
                <i class="bi bi-box-seam-fill"></i>
                <div class="cp-text">
                    <span class="cp-title">Default Programs</span>
                    <span class="cp-desc">View installed technologies</span>
                </div>
            </div>
            <div class="cp-item" onclick="navigateFromControlPanel('about')">
                <i class="bi bi-person-badge-fill"></i>
                <div class="cp-text">
                    <span class="cp-title">User Accounts</span>
                    <span class="cp-desc">View profile information</span>
                </div>
            </div>
            <div class="cp-item" onclick="navigateFromControlPanel('skills')">
                <i class="bi bi-gear-wide-connected"></i>
                <div class="cp-text">
                    <span class="cp-title">System</span>
                    <span class="cp-desc">View skills and competencies</span>
                </div>
            </div>
            <div class="cp-item" onclick="navigateFromControlPanel('contact')">
                <i class="bi bi-globe"></i>
                <div class="cp-text">
                    <span class="cp-title">Network & Internet</span>
                    <span class="cp-desc">Connect with me online</span>
                </div>
            </div>
            <div class="cp-item" onclick="navigateFromControlPanel('resume')">
                <i class="bi bi-file-earmark-text-fill"></i>
                <div class="cp-text">
                    <span class="cp-title">Backup & Restore</span>
                    <span class="cp-desc">Download CV copy</span>
                </div>
            </div>
            <div class="cp-item" onclick="navigateFromControlPanel('projects')">
                <i class="bi bi-folder-fill"></i>
                <div class="cp-text">
                    <span class="cp-title">Programs & Features</span>
                    <span class="cp-desc">View all projects</span>
                </div>
            </div>
            <div class="cp-item" onclick="toggleTheme()">
                <i class="bi bi-palette-fill"></i>
                <div class="cp-text">
                    <span class="cp-title">Personalization</span>
                    <span class="cp-desc">Toggle dark/light theme</span>
                </div>
            </div>
            <div class="cp-item" onclick="navigateFromControlPanel('help')">
                <i class="bi bi-question-circle-fill"></i>
                <div class="cp-text">
                    <span class="cp-title">Help & Support</span>
                    <span class="cp-desc">Get assistance</span>
                </div>
            </div>
        </div>
    `;
}

function generateProgramsContent() {
    const categories = [...new Set(installedPrograms.map(p => p.category))];
    let html = `
        <h2>⚙️ Installed Programs</h2>
        <p>Technologies and tools in my development environment</p>
        <div class="programs-list">
    `;
    categories.forEach(cat => {
        html += `<div class="program-category"><h4>${cat}</h4></div>`;
        installedPrograms.filter(p => p.category === cat).forEach(prog => {
            html += `
                <div class="program-item">
                    <i class="bi ${prog.icon}"></i>
                    <div class="program-info">
                        <span class="program-name">${prog.name}</span>
                        <span class="program-publisher">${prog.publisher}</span>
                    </div>
                </div>
            `;
        });
    });
    html += '</div>';
    return html;
}

function generateProjectDetailContent(project) {
    return `
        <h2>${project.title}</h2>
        <span class="project-vista-tag" style="font-size:13px;padding:5px 12px">${project.tag}</span>
        
        <div class="vista-info-box" style="margin-top:20px">
            <h4>📋 Overview</h4>
            <p style="margin:0">${project.fullDescription}</p>
        </div>
        
        <h3>🛠️ Technologies Used</h3>
        <div class="project-vista-tech" style="margin:15px 0">
            ${project.technologies.map(t => `<span class="tech-vista-badge">${t}</span>`).join('')}
        </div>
        
        <h3>✨ Key Features</h3>
        <ul>
            ${project.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        
        <h3>🏆 Achievements</h3>
        <ul>
            ${project.achievements.map(a => `<li>${a}</li>`).join('')}
        </ul>
        
        ${project.github !== '#' || project.demo !== '#' ? `
        <div class="vista-info-box" style="margin-top:20px">
            <h4>🔗 Links</h4>
            <div style="display:flex;gap:10px;margin-top:10px">
                ${project.github !== '#' ? `<a href="${project.github}" target="_blank" class="vista-btn"><i class="bi bi-github"></i> GitHub</a>` : ''}
                ${project.demo !== '#' ? `<a href="${project.demo}" target="_blank" class="vista-btn"><i class="bi bi-play-circle"></i> Demo</a>` : ''}
            </div>
        </div>
        ` : ''}
    `;
}

// ========== STATIC PAGE CONTENT ==========

const windowContent = {
    welcome: {
        title: 'Welcome Center',
        icon: 'images/win-vista-logo.png',
        path: 'C:\\Windows\\Welcome Center',
        content: `
            <div class="welcome-window-header">
                <h2>👋 Welcome to My Portfolio</h2>
                <p>Thanks for stopping by! This portfolio is built as an interactive Windows Vista experience. Here's a quick guide to get you started.</p>
            </div>

            <div class="vista-info-box" style="background:linear-gradient(135deg, #fff8e0 0%, #fff0c0 100%); border-color:#e0c080">
                <h4>🧭 How to Navigate</h4>
                <p style="margin:0">
                    <strong>Double-click</strong> desktop icons or use the <strong>Start Menu</strong> (green button, bottom-left) to open windows.
                    Drag windows by their title bar, and use the <strong>Back</strong> button to retrace your steps.
                </p>
            </div>

            <h3>🚀 Recommended Tour</h3>
            <p>Short on time? Click any card below to jump straight in:</p>

            <div class="welcome-links-grid">
                <div class="welcome-link-card" onclick="navigateTo('welcome', 'about');">
                    <i class="bi bi-person-fill"></i>
                    <div>
                        <strong>About Me</strong>
                        <span>Who I am, my background & education</span>
                    </div>
                </div>
                <div class="welcome-link-card" onclick="navigateTo('welcome', 'projects');">
                    <i class="bi bi-folder-fill"></i>
                    <div>
                        <strong>Projects</strong>
                        <span>Production ML systems & full-stack builds</span>
                    </div>
                </div>
                <div class="welcome-link-card" onclick="navigateTo('welcome', 'skills');">
                    <i class="bi bi-gear-wide-connected"></i>
                    <div>
                        <strong>Skills</strong>
                        <span>Core competencies & tech expertise</span>
                    </div>
                </div>
                <div class="welcome-link-card" onclick="navigateTo('welcome', 'resume');">
                    <i class="bi bi-file-earmark-pdf-fill"></i>
                    <div>
                        <strong>Resume</strong>
                        <span>Download my CV</span>
                    </div>
                </div>
                <div class="welcome-link-card" onclick="navigateTo('welcome', 'contact');">
                    <i class="bi bi-envelope-fill"></i>
                    <div>
                        <strong>Contact</strong>
                        <span>Email, LinkedIn & GitHub</span>
                    </div>
                </div>
                <div class="welcome-link-card" onclick="navigateTo('welcome', 'games');">
                    <i class="bi bi-controller"></i>
                    <div>
                        <strong>Games</strong>
                        <span>Take a break with Minesweeper</span>
                    </div>
                </div>
            </div>

            <div class="vista-info-box" style="margin-top: 20px">
                <h4>💡 Pro Tips</h4>
                <p style="margin:0 0 6px 0">• Check out <strong>Start → Default Programs</strong> for my full technology stack</p>
                <p style="margin:0 0 6px 0">• The <strong>Control Panel</strong> links to every section in one place</p>
                <p style="margin:0">• Press <kbd style="background:#e0e0e0;border:1px solid #aaa;border-radius:3px;padding:1px 5px;font-size:11px">Esc</kbd> to quickly close the active window</p>
            </div>
        `
    },
    about: {
        title: 'About Me',
        icon: 'images/vista-explorer.png',
        path: 'C:\\Users\\Razvan\\Documents\\About Me',
        content: `
            <h2>👋 Hello, I'm Razvan Nica</h2>
            <p><strong>Data Scientist | AI Engineer | Backend Developer</strong></p>
            <p>Building intelligent systems from data to deployment. Specializing in deep learning, computer vision, natural language processing, and production-ready ML applications.</p>
            
            <div class="vista-info-box">
                <h4>📍 Current Status</h4>
                <p style="margin:0">Available for opportunities • Based in Netherlands</p>
            </div>
            
            <h3>About My Work</h3>
            <p>I'm a Data & AI student at Breda University specializing in production-ready machine learning systems. I build end-to-end solutions: from model training to deployment, with expertise in deep learning, computer vision, and natural language processing.</p>
            <p>My work spans healthcare diagnostics, financial analytics, and predictive modeling. I focus on creating scalable, explainable AI systems that integrate seamlessly into real-world workflows.</p>
            
            <h3>🎓 Education</h3>
            <div class="vista-info-box">
                <h4>Breda University of Applied Sciences</h4>
                <p style="margin:0">BSc Data Science & Artificial Intelligence</p>
            </div>
            <div class="vista-info-box">
                <h4>National College "Cantemir Voda"</h4>
                <p style="margin:0">Mathematics and Computer Science, Bilingual English</p>
            </div>
            
            <h3>🏆 Recent Achievements</h3>
            <ul>
                <li><strong>Mar-Jun 2025:</strong> NASDAQ-100 Stock Price Prediction Platform</li>
                <li><strong>Jan-Mar 2025:</strong> Top 3 Project - The Innovation Square (AI X-Ray System)</li>
            </ul>
        `
    },
    skills: {
        title: 'My Skills',
        icon: 'images/vista-explorer.png',
        path: 'C:\\Users\\Razvan\\Documents\\Skills',
        content: `
            <h2>💻 Core Competencies</h2>
            <p>Technical expertise meets creative problem-solving</p>
            
            <div class="skills-vista-grid">
                <div class="skill-vista-item">
                    <i class="bi bi-graph-up"></i>
                    <h5>ML Development</h5>
                    <p>End-to-end ML pipelines, Scikit-learn, ensemble methods</p>
                </div>
                <div class="skill-vista-item">
                    <i class="bi bi-server"></i>
                    <h5>MLOps & Deployment</h5>
                    <p>CI/CD, containerization, Flask APIs</p>
                </div>
                <div class="skill-vista-item">
                    <i class="bi bi-code-slash"></i>
                    <h5>Backend Development</h5>
                    <p>Flask, PostgreSQL, SQLAlchemy, JWT</p>
                </div>
                <div class="skill-vista-item">
                    <i class="bi bi-eye"></i>
                    <h5>Computer Vision</h5>
                    <p>CNNs, TensorFlow/Keras, Grad-CAM, LIME</p>
                </div>
                <div class="skill-vista-item">
                    <i class="bi bi-chat-dots"></i>
                    <h5>NLP & Transformers</h5>
                    <p>BERT, GPT, Hugging Face, fine-tuning</p>
                </div>
            </div>
            
            <div class="vista-info-box" style="margin-top:20px">
                <h4>💡 Tip</h4>
                <p style="margin:0">View my complete technology stack in <strong>Start Menu → Default Programs</strong></p>
            </div>
        `
    },
    projects: {
        title: 'Projects',
        icon: 'images/vista-explorer.png',
        path: 'C:\\Users\\Razvan\\Documents\\Projects',
        content: '' // Generated dynamically in openWindow
    },
    documents: {
        title: 'Documents',
        icon: 'images/vista-explorer.png',
        path: 'C:\\Users\\Razvan\\Documents',
        content: '' // Generated dynamically in openWindow
    },
    contact: {
        title: 'Contact Me - Outlook',
        icon: 'images/outlook-logo-2007.png',
        path: 'Outlook Express - Contact Information',
        content: `
            <h2>📧 Get In Touch</h2>
            <p>Let's build something together! I'm always interested in new projects and opportunities.</p>
            
            <div class="vista-info-box contact-link">
                <h4>📬 Email</h4>
                <p style="margin:0"><a href="mailto:razvan.al.nica@gmail.com" style="color:#1e5799">razvan.al.nica@gmail.com</a></p>
            </div>
            
            <div class="vista-info-box contact-link">
                <h4>🔗 LinkedIn</h4>
                <p style="margin:0"><a href="https://linkedin.com/in/yourusername" target="_blank" style="color:#1e5799">linkedin.com/in/yourusername</a></p>
            </div>
            
            <div class="vista-info-box contact-link">
                <h4>💻 GitHub</h4>
                <p style="margin:0"><a href="https://github.com/dafaqboomduck" target="_blank" style="color:#1e5799">github.com/dafaqboomduck</a></p>
            </div>
            
            <div class="vista-info-box" style="margin-top:30px;text-align:center">
                <i class="bi bi-envelope-paper" style="font-size:48px;color:#1e5799;display:block;margin-bottom:10px"></i>
                <p style="margin:0;color:#666">Click any link above to get in touch!</p>
            </div>
        `
    },
    resume: {
        title: 'Resume.pdf - Abobe Reader',
        icon: 'images/acrobat-logo-2007.png',
        path: 'C:\\Users\\Razvan\\Documents\\CV2.pdf',
        content: '' // Generated dynamically by PDF reader
    },
    recycle: {
        title: 'Recycle Bin',
        icon: 'images/vista-recycle-bin.png',
        path: 'Recycle Bin',
        content: `
            <h2>🗑️ Recycle Bin</h2>
            <p style="color:#666">Contains files and folders that you have deleted.</p>
            
            <div style="text-align:center; padding:60px 20px; color:#888">
                <i class="bi bi-trash3" style="font-size:80px; opacity:0.3"></i>
                <p style="margin-top:20px; font-size:14px">The Recycle Bin is empty.</p>
            </div>
            
            <div class="vista-info-box">
                <h4>💡 Did you know?</h4>
                <p style="margin:0">This portfolio was crafted with passion using HTML, CSS, and JavaScript to recreate the nostalgic Windows Vista experience!</p>
            </div>
        `
    },
    games: {
        title: 'Games',
        icon: 'images/vista-explorer.png',
        path: 'C:\\Program Files\\Microsoft Games',
        content: '' // Generated dynamically
    },
    minesweeper: {
        title: 'Minesweeper',
        icon: 'images/vista-explorer.png',
        path: 'C:\\Program Files\\Microsoft Games\\Minesweeper',
        content: '' // Generated dynamically
    },
    programs: {
        title: 'Default Programs',
        icon: 'images/vista-explorer.png',
        path: 'Control Panel\\Default Programs',
        content: '' // Generated dynamically
    },
    computer: {
        title: 'Computer',
        icon: 'images/vista-explorer.png',
        path: 'Computer',
        content: `
            <h2>💻 Computer</h2>
            <p style="color:#666">View drives and system information</p>
            
            <div class="drives-section">
                <h3>Hard Disk Drives</h3>
                <div class="drive-item">
                    <i class="bi bi-device-hdd-fill"></i>
                    <div class="drive-info">
                        <div class="drive-name">Local Disk (C:)</div>
                        <div class="drive-bar">
                            <div class="drive-used" style="width: 65%"></div>
                        </div>
                        <div class="drive-space">42.5 GB free of 120 GB</div>
                    </div>
                </div>
                <div class="drive-item">
                    <i class="bi bi-device-hdd-fill"></i>
                    <div class="drive-info">
                        <div class="drive-name">Data (D:)</div>
                        <div class="drive-bar">
                            <div class="drive-used" style="width: 30%"></div>
                        </div>
                        <div class="drive-space">175 GB free of 250 GB</div>
                    </div>
                </div>
            </div>
            
            <div class="drives-section">
                <h3>Devices with Removable Storage</h3>
                <div class="drive-item">
                    <i class="bi bi-disc-fill"></i>
                    <div class="drive-info">
                        <div class="drive-name">DVD Drive (E:)</div>
                        <div class="drive-space" style="color:#888">No disc inserted</div>
                    </div>
                </div>
            </div>
            
            <div class="vista-info-box" style="margin-top:20px">
                <h4>⚙️ System Information</h4>
                <table class="system-info-table">
                    <tr><td>Processor:</td><td>Ryzen i9 9900x™ @ 3.5 GHz</td></tr>
                    <tr><td>RAM:</td><td>N/A</td></tr>
                    <tr><td>Graphics:</td><td>Windows Vista Aero™</td></tr>
                    <tr><td>OS:</td><td>Windows Vista Portfolio Edition</td></tr>
                    <tr><td>Developer:</td><td>Razvan Nica</td></tr>
                </table>
            </div>
        `
    },
    controlpanel: {
        title: 'Control Panel',
        icon: 'images/vista-control-panel.png',
        path: 'Control Panel',
        content: '' // Generated dynamically
    },
    help: {
        title: 'Help and Support',
        icon: 'images/vista-explorer.png',
        path: 'Help and Support Center',
        content: `
            <h2>❓ Help and Support</h2>
            <p>Welcome to Razvan's Portfolio Help Center</p>
            
            <div class="vista-info-box" style="background:linear-gradient(135deg, #fff8e0 0%, #fff0c0 100%); border-color:#e0c080">
                <h4>👋 Welcome!</h4>
                <p style="margin:0">This portfolio is designed as a Windows Vista experience. Navigate using the Start Menu, desktop icons, or by double-clicking folders.</p>
            </div>
            
            <h3>🧭 Navigation Guide</h3>
            <div class="help-section">
                <div class="help-item">
                    <i class="bi bi-mouse-fill"></i>
                    <div>
                        <strong>Double-click</strong> desktop icons to open windows
                    </div>
                </div>
                <div class="help-item">
                    <i class="bi bi-menu-button-wide-fill"></i>
                    <div>
                        <strong>Start Menu</strong> - Click the green button for all options
                    </div>
                </div>
                <div class="help-item">
                    <i class="bi bi-arrows-move"></i>
                    <div>
                        <strong>Drag windows</strong> by their title bar to move them
                    </div>
                </div>
                <div class="help-item">
                    <i class="bi bi-dash-square"></i>
                    <div>
                        <strong>Window controls</strong> - Minimize, maximize, or close windows
                    </div>
                </div>
            </div>
            
            <h3>⌨️ Keyboard Shortcuts</h3>
            <div class="help-section">
                <div class="help-item">
                    <kbd>Ctrl</kbd> + <kbd>Esc</kbd>
                    <div>Open/close Start Menu</div>
                </div>
                <div class="help-item">
                    <kbd>Esc</kbd>
                    <div>Close active window</div>
                </div>
            </div>
            
            <h3>🎮 Minesweeper Tips</h3>
            <div class="help-section">
                <div class="help-item">
                    <i class="bi bi-mouse-fill"></i>
                    <div><strong>Left-click</strong> to reveal a cell</div>
                </div>
                <div class="help-item">
                    <i class="bi bi-mouse2-fill"></i>
                    <div><strong>Right-click</strong> to place/remove a flag</div>
                </div>
                <div class="help-item">
                    <i class="bi bi-emoji-smile-fill"></i>
                    <div><strong>Click the face</strong> to restart the game</div>
                </div>
            </div>
            
            <h3>📞 Need More Help?</h3>
            <div class="vista-info-box">
                <p style="margin:0">Feel free to reach out! Visit the <a href="#" onclick="navigateFromHelp('contact'); return false;" style="color:#1e5799">Contact Me</a> section to get in touch.</p>
            </div>
            
            <div class="help-footer">
                <p>Portfolio crafted with ❤️ by <strong>Razvan Nica</strong></p>
                <p style="font-size:11px;color:#888">Built with HTML, CSS, JavaScript • Inspired by Windows Vista</p>
            </div>
        `
    }
};