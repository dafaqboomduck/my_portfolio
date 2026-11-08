// Project data — single source of truth for both desktop and phone editions.
// hiddenTechnologies is never rendered; it only adds Start Menu search keywords.
// series (optional) links projects that continue each other: same id = same
// series, part sets the order, note is the subtitle shown in the series box.
const projectData = {
  project9: {
    title: 'NPEC Production ML Platform: Deployment, CI/CD, and Monitoring',
    tag: 'MLOps',
    series: {
      id: 'npec',
      name: 'NPEC Root Phenotyping',
      part: 2,
      note: 'Apr–Jun 2026 · Team of five',
    },
    description:
      'Production platform for plant root analysis, built by a team of ' +
      'five on top of my root segmentation pipeline.',
    fullDescription:
      'Second phase of the NPEC project at Breda University of Applied ' +
      'Sciences (Apr to Jun 2026). With four classmates, I turned my ' +
      'earlier root segmentation pipeline into a production system with a ' +
      'FastAPI backend, React dashboard, PostgreSQL, MinIO, and an Azure ML ' +
      'retraining pipeline.\n\n' +
      'I owned deployment and delivery: packaging the pipeline as the ' +
      'npec-cv library, Docker images, CI/CD, the on-prem Portainer stack, ' +
      'the Azure cloud deployment, test coverage, and Metabase monitoring.',
    technologies: [
      'Docker',
      'GitHub Actions',
      'Portainer',
      'Azure ML',
      'Metabase',
      'FastAPI',
    ],
    hiddenTechnologies: [
      'Python',
      'Docker Compose',
      'GHCR',
      'PostgreSQL',
      'CUDA',
      'TensorFlow',
      'CI/CD',
    ],
    features: [
      'npec-cv Python package and CLI published to TestPyPI, with model ' +
        'weights distributed via GitHub Releases',
      'Separate Docker images for local development, on-prem production, ' +
        'and Azure ML cloud serving',
      'PR checks for linting, formatting, pytest, and Docker builds on ' +
        'every merge into dev and main',
      'Release workflow that tags images with the Git SHA, pushes them to ' +
        'GHCR, and redeploys the Portainer stack through a webhook',
      'Metabase dashboards over PostgreSQL tracking request volume, error ' +
        'rates, latency, and model quality',
    ],
    achievements: [
      'Selected with my team to showcase the project at BUas Industry Day, ' +
        'where I presented it to industry guests',
      'Automated on-prem delivery through a self-hosted runner inside the ' +
        'university firewall',
      'Fixed memory hogging by releasing GPU memory after an ' +
        'inference idle timeout',
      'Kept inference working on older Pascal GPUs by pinning a ' +
        'compatible cuDNN version',
    ],
    github: 'https://github.com/dafaqboomduck/npec-project',
    demo: '#',
  },
  project8: {
    title: 'NPEC Root Phenotyping and Robotic Inoculation',
    tag: 'Computer Vision & Robotics',
    series: {
      id: 'npec',
      name: 'NPEC Root Phenotyping',
      part: 1,
      note: 'Nov 2025–Jan 2026 · Solo',
    },
    description:
      'Root segmentation pipeline that measures plant roots and guides a ' +
      'robot arm to inoculate each root tip.',
    fullDescription:
      'Solo project for the Netherlands Plant Eco-phenotyping Centre (NPEC) ' +
      'at Breda University of Applied Sciences (Nov 2025 to Jan 2026). The ' +
      'pipeline segments Arabidopsis thaliana roots in Petri dish scans, ' +
      'measures root length, and locates root tips. A simulated OT-2 robot ' +
      'then moves to each tip with a PID or reinforcement learning ' +
      'controller to inoculate it.\n',
    technologies: [
      'TensorFlow',
      'Keras',
      'OpenCV',
      'Stable Baselines3',
      'PyBullet',
      'Gymnasium',
    ],
    hiddenTechnologies: [
      'Python',
      'NumPy',
      'U-Net',
      'PPO',
      'Reinforcement Learning',
    ],
    features: [
      'U-Net trained with knowledge distillation from a teacher ensemble, ' +
        'then retrained on ground truth with a weighted Dice-BCE loss',
      'Patch-based inference on full-resolution scans, with anchor ' +
        'detection assigning each root to its plant',
      'Adaptive thresholding and a shoot-overlap penalty so faint roots ' +
        'are found without false positives',
      'Geodesic root length via skeletonisation, gap bridging, and ' +
        'Dijkstra over an 8-connected pixel graph',
      'Custom Gymnasium environment for the OT-2 with a shaped reward, ' +
        'driving PID and PPO controllers through multi-target inoculation',
    ],
    achievements: [
      'First place in the school Kaggle competition, with around 5% sMAPE ' +
        'on root length',
      'Reached 88% F1 for root segmentation on the validation set',
      'Achieved sub-millimetre precision in the simulated environment for ' +
        'the OT-2 robot arm',
    ],
    github: 'https://github.com/dafaqboomduck/npec-project',
    demo: '#',
  },
  project7: {
    title: 'Inkshade: Desktop PDF Reader with Annotation and Narration',
    tag: 'Desktop Application',
    description:
      'Cross-platform PDF reader with highlighting, freehand drawing, and ' +
      'an in-development text-to-speech narration pipeline.',
    fullDescription:
      'Personal project built end to end: architecture, code, and ' +
      'releases. A PDF reader built on PyQt5 and PyMuPDF with character-level ' +
      'selection, search, annotations, and table-of-contents navigation, ' +
      'built with a modular architecture.\n' +
      'A companion narration system reads PDFs aloud, combining ' +
      'PyMuPDF extraction and YOLO layout detection.',
    technologies: [
      'PyQt5',
      'PyMuPDF',
      'YOLO',
      'PyInstaller',
      'Flatpak',
    ],
    hiddenTechnologies: [
      'Python',
    ],
    features: [
      'Character-level text selection, document-wide search, and clickable ' +
        'links with hover previews',
      'Highlights and freehand drawing with undo/redo, exportable into the ' +
        'PDF itself',
      'Large-PDF performance: LRU page cache, lazy layer loading, widget ' +
        'recycling, and chunked search that yields to the event loop',
      'Distributed for Windows via PyInstaller and for Linux as a ' +
        'source-built Flatpak with AppStream metadata',
      'Hybrid TTS pipeline: fast rule-based scripts for prose, with page ' +
        'image plus extracted text routed to a VLM only for hard blocks (planned)',
    ],
    achievements: [
     'Worked around PyMuPDF not being thread-safe with chunked ' +
        'synchronous search driven by QTimer',
      'Improved large-PDF performance and stability by updating widgets ' +
        'in place instead of recreating them, which removed a cascade of ' +
        'ghost-page, zoom/scroll recursion, and Wayland crashes',
      'Managed character-level selection by indexing every glyph from ' +
        'PyMuPDF rawdict into a 50-point spatial grid for constant-time ' +
        'hit testing, with anchor/focus ranges spanning multiple pages',
    ],
    github: 'https://github.com/dafaqboomduck/Inkshade-PDF',
    demo: '#',
  },
  project5: {
    title: 'Transformers versus Emotions: Video-to-Emotion NLP Pipeline',
    tag: 'Natural Language Processing',
    description:
      'Modular pipeline that transcribes, translates, and classifies the ' +
      'emotion of every spoken sentence in a video.',
    fullDescription:
      'Built for the Content Intelligence Agency, a content analytics ' +
      'company, at Breda University of Applied Sciences. Replaces a costly ' +
      'GPT API-driven workflow with smaller task-specialised ' +
      'Transformers: audio is extracted from video, transcribed via ' +
      'AssemblyAI, cleaned and re-punctuated, round-trip translated through ' +
      'Dutch to prove multilingual scalability, then classified for core ' +
      'emotion, fine-grained emotion, and intensity.',
    technologies: [
      'Hugging Face Transformers',
      'DistilBERT',
      'AssemblyAI',
      'Keras',
      'Scikit-learn',
      'Word2Vec',
    ],
    hiddenTechnologies: [
      'Python',
      'Pandas',
    ],
    features: [
      'Swappable pipeline modules for transcription, translation, ' +
        'processing, and prediction',
      'Speech-to-text via AssemblyAI with rule-based and transformer-based ' +
        'post-processing',
      'Round-trip EN→NL→EN translation as a multilingual scalability ' +
        'stress test',
      'Three-way emotion output: 7-class core emotion, fine-grained ' +
        'subtype, and intensity',
      'Custom evaluation set of 1,228 hand-verified sentences built from a ' +
        'real TV episode of Kitchen Nightmares',
    ],
    achievements: [
      'Fine-tuned DistilBERT from binary sentiment to 7-class emotion, ' +
        'reaching 64.1% accuracy and 61.7% weighted F1',
      'Made the sustainability and cost case for a 66M-parameter model ' +
        'over per-sentence LLM API calls',
      'Documented with a full model card, error analysis, and XAI study',
    ],
    github: 'https://github.com/dafaqboomduck/nlp-project',
    demo: '#',
  },
  project6: {
    title: 'M.E.S.S.I.: Context Windows in Dialogue Emotion Classification',
    tag: 'NLP Research',
    description:
      'Controlled sweep of context-window size for dialogue emotion ' +
      'classification.',
    fullDescription:
      'Follow-up research project with a new four-person team at Breda ' +
      'University of Applied Sciences. I owned RQ-B1: context-window size ' +
      'as the sole independent variable, swept from 0 to 10 preceding ' +
      'utterances against an isolated-sentence baseline, with ' +
      'architecture, dataset, and language held fixed and five seeds per ' +
      'configuration.',
    technologies: [
      'RoBERTa-large',
      'PyTorch',
      'Hugging Face Transformers',
      'MELD',
      'Scikit-learn',
    ],
    hiddenTechnologies: [
      'Python',
      'Pandas',
    ],
    features: [
      'RoBERTa-large encoder with an attention-pooling layer and MLP head ' +
        'over 7 emotion classes',
      'Context-window sweep across k = 0, 1, 3, 5, 10 with five seeds each ' +
        'for statistical robustness',
      'Per-class F1, precision, recall, and confusion matrices rather than ' +
        'aggregate accuracy alone',
      'Feasibility EDA on MELD and a Spanish split covering dialogue ' +
        'lengths, context available at each k, and the 512-token encoder ' +
        'ceiling',
      'Inference latency and memory tracked alongside accuracy, since ' +
        'larger windows are not free',
    ],
    achievements: [
      'Found a diminishing-returns curve peaking at k = 5: weighted F1 ' +
        'rose from 0.614 to 0.634, with a 12% gain on ambiguous utterances ' +
        'at 3.5% added latency',
      'Showed the benefit is emotion-specific: disgust gained ~30% ' +
        'relative F1, while fear degraded under severe class imbalance',
      'Reported that the aggregate gain lost significance under ' +
        'Holm-Bonferroni correction and did not transfer to the Spanish ' +
        'split',
    ],
    github: 'https://github.com/dafaqboomduck/nlp-research',
    demo: 'https://dafaqboomduck.github.io/nlp-research/',
  },
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
    hiddenTechnologies: [
      'Python',
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
    hiddenTechnologies: [
      'Python',
      'NumPy',
      'Matplotlib',
      'Seaborn',
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
      'Matplotlib',
      'Seaborn',
    ],
    hiddenTechnologies: [
      'Python',
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
    github: 'https://github.com/dafaqboomduck/hospital-readmissions',
    demo: 'https://nbviewer.org/github/dafaqboomduck/hospital-readmissions/blob/main/Deliverables/BlockY1B_CreativeBrief_242715_RazvanNica.ipynb',
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
    hiddenTechnologies: [],
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
    demo: 'https://app.powerbi.com/view?r=eyJrIjoiNGY0OTViZjUtODUxMS00OTlhLWJmNmQtMDczNWZlNDJhZGVhIiwidCI6IjBhMzM1ODliLTAwMzYtNGZlOC1hODI5LTNlZDA5MjZhZjg4NiIsImMiOjl9',
  },
};