// Navigation Toggle
function toggleNav() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// Close nav when clicking outside
document.addEventListener('click', function(event) {
    const navWrapper = document.querySelector('.nav-wrapper');
    const menu = document.getElementById('navMenu');
    if (!navWrapper.contains(event.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Modal Functions
function openModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const project = projectData[projectId];
    
    if (!project) return;
    
    modalBody.innerHTML = `
        <div class="modal-header-top">
            <span class="project-tag">${project.tag}</span>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <div class="modal-header">
            <h3>${project.title}</h3>
            <p class="text">${project.description}</p>
        </div>
        
        <div class="modal-tech-stack">
            ${project.technologies.map(tech => `<span class="modal-tech-badge">${tech}</span>`).join('')}
        </div>
        
        <div class="modal-section">
            <h4>Overview</h4>
            <p class="text">${project.fullDescription}</p>
        </div>
        
        <div class="modal-section">
            <h4>Key Features</h4>
            <ul>
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h4>Achievements & Impact</h4>
            <ul>
                ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-links">
            ${project.github !== '#' ? `
                <a href="${project.github}" target="_blank" class="modal-btn">
                    <i class="bi bi-github"></i>
                    View on GitHub
                </a>
            ` : ''}
            ${project.demo !== '#' ? `
                <a href="${project.demo}" target="_blank" class="modal-btn">
                    <i class="bi bi-play-circle"></i>
                    Live Demo
                </a>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    const modal = document.getElementById('projectModal');
    
    // If event is passed, check if clicked outside modal content
    if (event && event.target !== modal) {
        return;
    }
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Scroll animations (optional - adds fade-in effect on scroll)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply scroll animation to sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.skill-item, .bento-item, .timeline-item');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});