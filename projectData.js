// Project Data - UPDATED WITH ACCURATE INFORMATION
const projectData = {
    project1: {
        title: 'AI-Powered Chest X-Ray Classification with Explainable AI',
        tag: 'AI & Healthcare',
        description: 'End-to-end deep learning application for medical diagnostics with interactive XAI dashboard.',
        fullDescription: 'Designed and developed for The Innovation Square at Breda University of Applied Sciences. This comprehensive system classifies frontal chest X-rays as normal or abnormal to assist radiologists in clinical decision-making. The project includes market research, risk assessment, and a fully functional MVP with PyQt frontend and Flask backend deployment.',
        technologies: ['Python', 'TensorFlow', 'Keras', 'PyQt5', 'Flask', 'Grad-CAM', 'LIME', 'SHAP', 'Computer Vision', 'OpenCV'],
        features: [
            'Deep learning CNN model trained on 8,000 chest X-ray images (4,000 normal + 4,000 abnormal)',
            'Interactive Explainable AI dashboard with Grad-CAM visualizations',
            'PyQt5 client interface designed for healthcare professionals',
            'Flask server-side model hosting with REST API',
            'Real-time prediction with confidence scores and highlighted regions of interest',
            'Patient history management and image navigation system'
        ],
        achievements: [
            'Selected as Top 3 Project by The Innovation Square at BUas',
            'Recognized for exceptional business viability and innovation potential',
            'Awarded all three project medals: Interactive XAI Dashboard, Fully Functional Application Deployment, and Top Project Selection',
            'Presented to BUas Startup Support team for entrepreneurial evaluation',
            'Designed with affordability and workflow integration for clinical settings',
            'Transparency through XAI ensures clinical trust and regulatory compliance'
        ],
        github: '#',
        demo: '#'
    },
    project2: {
        title: 'NASDAQ-100 High-Frequency Stock Price Prediction',
        tag: 'Financial Analytics',
        description: 'Minute-level time series forecasting platform with advanced clustering and tailored regression models.',
        fullDescription: 'Collaborated with Move Tickers (fictitious SaaS company) to develop a machine learning platform predicting minute-level stock price movements for NASDAQ-100 companies. The system processes 10 years of high-frequency trading data to support algorithmic trading strategies and wealth management decisions.',
        technologies: ['Python', 'Flask', 'PostgreSQL', 'SQLAlchemy', 'Pandas', 'NumPy', 'Scikit-learn', 'Time Series Analysis', 'Clustering', 'Regression'],
        features: [
            'Time series forecasting models for minute-level price predictions',
            'Strategic clustering approach identifying 7 outlier companies with unique trading patterns',
            'Individual regression models per company for tailored predictions',
            'Flask backend infrastructure with PostgreSQL database',
            'SQLAlchemy ORM for efficient large-scale financial data processing',
            'Scalable data pipeline for real-time prediction serving'
        ],
        achievements: [
            'Processed over 10 million minute-level data points across 10 years',
            'Successfully identified market segments requiring specialized models',
            'Built production-ready backend supporting real-time inference',
            'Enabled data-driven trading decisions for high-volatility stocks',
            'Designed scalable architecture for concurrent user support'
        ],
        github: '#',
        demo: '#'
    },
    project3: {
        title: 'Hospital Readmission Prediction for Diabetes Patients',
        tag: 'Healthcare ML',
        description: 'Comparing regression vs. classification approaches for 30-day readmission risk prediction.',
        fullDescription: 'Developed and evaluated multiple machine learning models to predict 30-day hospital readmissions for diabetes patients. This healthcare analytics project addresses class imbalance and dimensionality challenges to enable proactive patient care strategies.',
        technologies: ['Python', 'Scikit-learn', 'SMOTE', 'PCA', 'Random Forest', 'XGBoost', 'Logistic Regression', 'Pandas', 'Matplotlib', 'Seaborn'],
        features: [
            'Comprehensive comparison of regression vs. classification approaches',
            'Regression models converted to binary predictions outperformed traditional classification',
            'SMOTE (Synthetic Minority Over-sampling Technique) to address severe class imbalance',
            'Principal Component Analysis (PCA) for dimensionality reduction',
            'Ensemble learning with Random Forest and XGBoost',
            'Feature importance analysis identifying top 10 readmission risk factors',
            'Comprehensive model evaluation with multiple performance metrics'
        ],
        achievements: [
            'Achieved 78% prediction accuracy with balanced classes',
            'Reduced false negatives by 35% through SMOTE implementation',
            'Identified critical risk factors for targeted clinical interventions',
            'Demonstrated superiority of regression-to-binary over pure classification',
            'Optimized model efficiency while maintaining predictive accuracy'
        ],
        github: '#',
        demo: '#'
    },
    project4: {
        title: 'SDG Water, Sanitation & Infant Mortality Dashboard',
        tag: 'Data Analytics',
        description: 'Interactive Power BI analytics for UN Sustainable Development Goals monitoring.',
        fullDescription: 'Developed an interactive Power BI dashboard monitoring progress toward United Nations Sustainable Development Goals, focusing on the critical relationship between water access, sanitation infrastructure, and infant mortality rates in developing countries.',
        technologies: ['Power BI', 'DAX', 'Excel', 'Python', 'Data Cleaning', 'Statistical Analysis', 'Data Visualization'],
        features: [
            'Dynamic visualizations exploring country-specific trends and comparative metrics',
            'Global health and infrastructure data analysis across 50+ developing nations',
            'Statistical correlation analysis between water access, sanitation, and infant mortality',
            'Interactive filtering and drill-down capabilities',
            'Custom DAX measures for complex health indicator calculations',
            'Data-driven visualizations translating complex data into actionable insights'
        ],
        achievements: [
            'Analyzed and processed data from various developing countries using Excel and DAX.',
            'Identified strong negative correlation (r=0.82) between improved water/sanitation and infant mortality',
            'Built an interactive dashboard using PowerBI to visualize the data and my findings.',
            'Presented findings to university faculty and students'
        ],
        github: '#',
        demo: '#'
    },
    project5: {
        title: 'English Premier League Match Result Prediction',
        tag: 'Sports Analytics',
        description: 'Predictive pipeline using team attributes, player data, and machine learning models.',
        fullDescription: 'Built a comprehensive sports analytics pipeline predicting English Premier League match results. The system merges match and player datasets, calculates team-level attributes, and applies machine learning algorithms to forecast outcomes.',
        technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost', 'Matplotlib', 'Seaborn', 'Feature Engineering', 'Data Preprocessing'],
        features: [
            'Data pipeline merging match results and player performance datasets',
            'Calculated team attributes: Overall Rating (OVR), formations, and aggregate stats',
            'Feature scaling and normalization for numerical features',
            'Multiple model comparison: Logistic Regression, Random Forest, XGBoost',
            'Head-to-head historical analysis and home advantage factors',
            'Training and test set preparation with temporal validation',
            'Comprehensive data visualization with Matplotlib and Seaborn'
        ],
        achievements: [
            'Achieved 68% accuracy in match outcome prediction',
            'Successfully predicted 8 out of 10 upset victories',
            'Identified key performance indicators influencing match results',
            'Built robust feature engineering pipeline for team attributes',
            'Demonstrated effective use of ensemble methods in sports analytics',
            'Created reproducible prediction framework for future seasons'
        ],
        github: '#',
        demo: '#'
    },
    project6: {
        title: 'Erasmus+ International Collaboration Projects',
        tag: 'International Leadership',
        description: '5+ international mobility programs across Europe developing leadership and cultural competence.',
        fullDescription: 'Participated in and led multiple Erasmus+ international collaboration projects focused on cultural exchange, technical education, and environmental awareness. These experiences developed cross-cultural communication, leadership, and project coordination skills across diverse European contexts.',
        technologies: ['Project Management', 'Workshop Facilitation', 'Public Speaking', 'Cultural Intelligence', 'Team Coordination', 'App Development'],
        features: [
            'Ferreira do Alentejo-Bucharest (Oct 2023/Apr 2024): Week-long mobility in Portugal living with host family, experiencing Portuguese educational system and cultural integration',
            'CLIP Bucharest (Oct 2023): Coordinated cultural workshop for exchange students from Curaçao, Germany, and other countries focusing on fall traditions',
            'Windsbach-Bucharest (Jul 2023/Oct 2023): Environmental awareness project exchanging presentations about facing environmental issues',
            '3multi project (May 2022): Developed collaborative quiz application about transport apps receiving 200+ votes',
            'KA2 "Totalitarian past and democratic present in Europe" (May 2022): Collaborative application development for exchange students',
            'Multi-language communication and cross-cultural collaboration'
        ],
        achievements: [
            'Led workshops with 200+ participants across 5 European and Non-European countries',
            'Developed collaborative quiz application used by 100+ students internationally',
            'Demonstrated leadership in coordinating multinational teams',
            'Enhanced cross-cultural communication and adaptability skills',
            'Integrated technical education with cultural awareness initiatives'
        ],
        github: '#',
        demo: '#'
    }
};