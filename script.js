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

// Project Data
const projectData = {
    project1: {
        title: 'AI-Powered Chest X-Ray Classification System',
        tag: 'AI & Healthcare',
        description: 'A comprehensive deep learning application for medical diagnostics with an Explainable AI dashboard.',
        fullDescription: 'This project implements state-of-the-art convolutional neural networks to classify chest X-ray images and detect various pulmonary conditions. The system includes an interactive Explainable AI dashboard that helps medical professionals understand the model\'s decision-making process through visualization techniques like Grad-CAM and attention maps.',
        technologies: ['Python', 'TensorFlow', 'Keras', 'Flask', 'React', 'OpenCV', 'Grad-CAM', 'HTML/CSS'],
        features: [
            'Multi-class classification for various pulmonary conditions',
            'Explainable AI dashboard with Grad-CAM visualizations',
            'Real-time prediction interface',
            'Model performance metrics and confidence scores',
            'Medical image preprocessing pipeline',
            'Responsive web interface for healthcare professionals'
        ],
        achievements: [
            'Selected as Top 3 Project by The Innovation Square at BUas',
            'Recognized for exceptional business value and innovation potential',
            'Achieved 94% accuracy on test dataset',
            'Successfully integrated explainability features for clinical trust'
        ],
        github: '#',
        demo: '#'
    },
    project2: {
        title: 'NASDAQ-100 Stock Price Prediction Platform',
        tag: 'Financial Analytics',
        description: 'High-frequency time series forecasting platform with advanced clustering analysis.',
        fullDescription: 'A comprehensive financial analytics platform that predicts minute-level stock prices for NASDAQ-100 companies. The system processes 10 years of historical trading data and employs machine learning models including LSTM networks and ensemble methods to generate real-time predictions.',
        technologies: ['Python', 'Flask', 'PostgreSQL', 'Pandas', 'Scikit-learn', 'LSTM', 'XGBoost', 'Plotly'],
        features: [
            'Minute-level price predictions for real-time trading',
            'Clustering analysis to identify similar trading patterns',
            'Interactive visualization dashboard',
            'Historical data analysis spanning 10 years',
            'Flask REST API for model predictions',
            'PostgreSQL database for efficient data storage and retrieval'
        ],
        achievements: [
            'Processed over 10 million data points',
            'Achieved RMSE of 0.032 on validation set',
            'Real-time predictions with sub-second latency',
            'Scalable architecture supporting multiple concurrent users'
        ],
        github: '#',
        demo: '#'
    },
    project3: {
        title: 'Hospital Readmission Prediction for Diabetes Patients',
        tag: 'Healthcare ML',
        description: 'Machine learning system for predicting 30-day hospital readmissions.',
        fullDescription: 'This healthcare analytics project focuses on predicting 30-day readmission rates for diabetes patients using machine learning. The system employs advanced techniques like SMOTE for handling class imbalance and PCA for dimensionality reduction, enabling healthcare providers to implement proactive patient care strategies.',
        technologies: ['Python', 'Scikit-learn', 'SMOTE', 'PCA', 'Random Forest', 'Pandas', 'Matplotlib', 'Seaborn'],
        features: [
            'Predictive modeling for 30-day readmission risk',
            'SMOTE implementation for balanced class distribution',
            'Principal Component Analysis for feature optimization',
            'Ensemble learning with Random Forest and XGBoost',
            'Feature importance analysis for clinical insights',
            'Comprehensive model evaluation with multiple metrics'
        ],
        achievements: [
            'Improved prediction accuracy to 78% with balanced classes',
            'Identified top 10 risk factors for patient readmission',
            'Reduced false negatives by 35% through SMOTE',
            'Enabled proactive care planning for high-risk patients'
        ],
        github: '#',
        demo: '#'
    },
    project4: {
        title: 'SDG Data Analytics Dashboard',
        tag: 'Data Analytics',
        description: 'Interactive Power BI dashboard for Sustainable Development Goals analysis.',
        fullDescription: 'A comprehensive data visualization project analyzing correlations between water accessibility, sanitation facilities, and infant mortality rates across developing nations. The dashboard provides actionable insights for policy makers and NGOs working on SDG implementation.',
        technologies: ['Power BI', 'DAX', 'Excel', 'Python', 'Data Cleaning', 'Statistical Analysis'],
        features: [
            'Interactive visualizations of SDG indicators',
            'Correlation analysis between water, sanitation, and health',
            'Country-level comparative analysis',
            'Time-series trend visualization',
            'Custom DAX measures for complex calculations',
            'Mobile-responsive dashboard design'
        ],
        achievements: [
            'Analyzed data from 100+ developing countries',
            'Identified strong correlation (r=0.82) between sanitation and infant mortality',
            'Created actionable insights for policy recommendations',
            'Presented findings to university faculty and students'
        ],
        github: '#',
        demo: '#'
    },
    project5: {
        title: 'EPL Match Result Prediction',
        tag: 'Sports Analytics',
        description: 'Predictive modeling pipeline for English Premier League match outcomes.',
        fullDescription: 'A sports analytics project that predicts English Premier League match results using team statistics, player performance data, and historical match outcomes. The system employs multiple machine learning algorithms to generate accurate predictions for upcoming fixtures.',
        technologies: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'Beautiful Soup', 'Web Scraping', 'Matplotlib'],
        features: [
            'Automated web scraping for real-time team statistics',
            'Feature engineering from player and team attributes',
            'Multiple model comparison (Logistic Regression, Random Forest, XGBoost)',
            'Head-to-head historical analysis',
            'Home advantage factor calculation',
            'Prediction confidence intervals'
        ],
        achievements: [
            'Achieved 68% accuracy in match outcome prediction',
            'Successfully predicted 8 out of 10 upset victories',
            'Automated data pipeline reducing manual work by 90%',
            'Generated insights on key performance indicators'
        ],
        github: '#',
        demo: '#'
    },
    project6: {
        title: 'Erasmus+ International Projects',
        tag: 'International Collaboration',
        description: '5+ international mobility programs across Europe.',
        fullDescription: 'A collection of international collaborative projects through the Erasmus+ program, including cultural exchange initiatives, technical workshops, Android application development, and environmental awareness campaigns. These experiences developed cross-cultural communication skills and leadership abilities.',
        technologies: ['Android Studio', 'Java', 'Kotlin', 'Project Management', 'Workshop Facilitation', 'Public Speaking'],
        features: [
            'Portugal student exchange program (3 months)',
            'Android app development workshop leadership',
            'Cultural awareness and integration workshops',
            'Environmental sustainability project coordination',
            'Multi-language communication and collaboration',
            'Youth leadership development initiatives'
        ],
        achievements: [
            'Led workshops with 200+ participants across 5 countries',
            'Developed Android quiz application used by 100+ students',
            'Received Excellence Award for cultural integration efforts',
            'Built international network of collaborators and mentors',
            'Improved cross-cultural communication and teamwork skills'
        ],
        github: '#',
        demo: '#'
    }
};

// Modal Functions
function openModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const project = projectData[projectId];
    
    if (!project) return;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <span class="project-tag">${project.tag}</span>
            <h3>${project.title}</h3>
            <p class="text-muted">${project.description}</p>
        </div>
        
        <div class="modal-tech-stack">
            ${project.technologies.map(tech => `<span class="modal-tech-badge">${tech}</span>`).join('')}
        </div>
        
        <div class="modal-section">
            <h4>Overview</h4>
            <p class="text-muted">${project.fullDescription}</p>
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