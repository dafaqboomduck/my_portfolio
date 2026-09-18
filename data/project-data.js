// Project data — single source of truth for both desktop and phone editions.
const projectData = {
  project1: {
    title: 'AI-Powered Chest X-Ray Classification with Explainable AI',
    tag: 'AI & Healthcare',
    description:
      'End-to-end deep learning application for medical diagnostics with ' +
      'interactive XAI dashboard.',
    fullDescription:
      'Built for The Innovation Square at Breda University of Applied ' +
      'Sciences. Classifies frontal chest X-rays as normal or abnormal to ' +
      'support radiologist decision-making. Scope covered market research, ' +
      'risk assessment, and a working MVP with a PyQt frontend and Flask ' +
      'backend.',
    technologies: [
      'TensorFlow',
      'Keras',
      'PyQt5',
      'Flask',
      'Grad-CAM',
      'OpenCV',
    ],
    features: [
      'CNN trained on 8,000 chest X-rays (4,000 normal / 4,000 abnormal)',
      'Interactive XAI dashboard with Grad-CAM region highlighting',
      'PyQt5 desktop client talking to a Flask REST API hosting the model',
      'Patient history management and image navigation',
    ],
    achievements: [
      'Selected as Top 3 Project by The Innovation Square at BUas',
      'Awarded all three project medals: Interactive XAI Dashboard, Fully ' +
        'Functional Application Deployment, and Top Project Selection',
      'Presented to the BUas Startup Support team',
    ],
    github: 'https://github.com/dafaqboomduck/chest-vision-project',
    demo: '#',
  },
  project2: {
    title: 'NASDAQ-100 High-Frequency Stock Price Prediction',
    tag: 'Financial Analytics',
    description:
      'Minute-level time series forecasting with clustering-driven, ' +
      'per-company models.',
    fullDescription:
      'Built with Move Tickers (a fictitious SaaS client) to predict ' +
      'minute-level price movements for NASDAQ-100 companies from 10 years ' +
      'of high-frequency trading data.',
    technologies: [
      'Flask',
      'PostgreSQL',
      'SQLAlchemy',
      'Pandas',
      'Scikit-learn',
      'Time Series Clustering & Analysis',
    ],
    features: [
      'Minute-level time series forecasting across NASDAQ-100 companies',
      'Clustering approach isolating companies with atypical trading patterns',
      'Flask backend with PostgreSQL and SQLAlchemy ORM',
      'Data pipeline serving predictions in real time',
    ],
    achievements: [
      'Processed 10 years of minute-level trading data across the NASDAQ-100',
      'Identified 7 outlier companies that needed their own models',
      'Built production-ready backend supporting real-time inference',
    ],
    github: '#',
    demo: '#',
  },
  project3: {
    title: 'Hospital Readmission Prediction for Diabetes Patients',
    tag: 'AI & Healthcare',
    description:
      'Comparing regression vs. classification approaches for 30-day ' +
      'readmission risk prediction.',
    fullDescription:
      'Built and compared machine learning models predicting 30-day ' +
      'hospital readmission for diabetes patients using the UCI Diabetes ' +
      '130-US Hospitals dataset (101,766 encounters, 1999-2008), working ' +
      'around heavy class imbalance and high dimensionality.',
    technologies: [
      'Scikit-learn',
      'Pandas',
      'SMOTE',
      'PCA',
      'XGBoost',
      'Random Forest',
      'Logistic Regression',
      'NumPy',
      'Matplotlib/Seaborn',
    ],
    features: [
      'Direct comparison of regression and classification approaches',
      'SMOTE to correct severe class imbalance',
      'PCA for dimensionality reduction',
      'Random Forest and XGBoost ensembles',
      'Feature importance analysis surfacing the top 10 readmission risk ' +
        'factors',
    ],
    achievements: [
      'Regression models thresholded to binary outperformed straight ' +
        'classification',
      'Achieved 78% prediction accuracy with balanced classes',
    ],
    github: '#',
    demo: '#',
  },
  project4: {
    title: 'SDG Water, Sanitation & Infant Mortality Dashboard',
    tag: 'Data Analytics',
    description:
      'Interactive Power BI analytics for UN Sustainable Development Goals ' +
      'monitoring.',
    fullDescription:
      'Power BI dashboard tracking progress on United Nations Sustainable ' +
      'Development Goals, focused on the relationship between water access, ' +
      'sanitation infrastructure, and infant mortality in developing ' +
      'countries.',
    technologies: [
      'Power BI',
      'DAX',
      'Excel',
      'Data Cleaning',
      'Statistical Analysis',
      'Data Visualization',
    ],
    features: [
      'Country-level filtering and drill-down across 50+ developing nations',
      'Custom DAX measures for health indicator calculations',
      'Correlation analysis between water access, sanitation, and infant ' +
        'mortality',
    ],
    achievements: [
      'Cleaned and processed data from developing countries using Excel and ' +
        'DAX',
      'Found a strong negative correlation (r = -0.82) between improved ' +
        'water/sanitation and infant mortality',
    ],
    github: '#',
    demo: '#',
  },
};