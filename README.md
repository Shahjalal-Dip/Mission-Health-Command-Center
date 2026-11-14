# 🚀 Mission Health Command Center

### NASA Space Apps Challenge 2026
**Challenge: Create Health Monitoring Software for Astronauts on Space Missions**

Mission Health Command Center is a flight-surgeon-style health monitoring dashboard that transforms real astronaut biomarker data into transparent, explainable health insights.

Built using publicly available data from NASA's Open Science Data Repository (OSDR), the application helps visualize individual astronaut health trends, identify deviations from personal pre-flight baselines, and understand post-flight recovery patterns.

**No simulated or artificially generated biomarker measurements are used.**

🌐 **Live Demo:** https://mission-health-command-center.vercel.app/

🎥 **Demo Video:** https://youtu.be/DFUSZiMdPP8

💻 **GitHub Repository:** https://github.com/Shahjalal-Dip/Mission-Health-Command-Center

---

## 🎯 The Problem

Spaceflight can cause significant physiological changes, including immune system alterations, cardiovascular deconditioning, bone and muscle loss, and post-flight recovery challenges.

Monitoring these changes is important for astronaut health and mission safety. However, clinical measurements alone can be difficult to interpret when presented as disconnected laboratory values.

Flight surgeons need a way to understand how an astronaut's health changes over time, particularly how individual measurements differ from that astronaut's own pre-flight baseline.

Mission Health Command Center addresses this challenge by presenting biomarker trends, explainable alerts, and recovery information in a centralized dashboard.

## 💡 What We Built

We developed a web-based health monitoring dashboard using real biological measurements from NASA's Inspiration4 mission.

The application organizes astronaut biomarker readings along a mission timeline, identifies meaningful deviations through a transparent rule-based flagging engine, and provides explanations for each alert.

Rather than treating every astronaut as having the same baseline, the system compares measurements against each individual's own pre-flight average.

The goal is to make complex health measurements easier to understand through clear visualizations and interpretable decision-support signals.

## ✨ Core Features

### 1. Crew Overview
- Displays four anonymized Inspiration4 subjects (C001–C004).
- Provides a centralized overview of tracked biomarkers.
- Uses status indicators based on each subject's most significant flagged biomarker.
- Includes WBC trend sparklines for quick visual comparison.

### 2. Individual Health Timeline
- Displays biomarker trends across seven mission timepoints.
- Supports individual subject and biomarker exploration.
- Shows laboratory reference ranges where applicable.
- Provides measurement-level details for each timepoint.

### 3. Explainable Health Flagging Engine
- Compares individual measurements against each subject's own pre-flight baseline.
- Uses transparent percentage-deviation thresholds:
  - **Watch:** 20% or greater deviation.
  - **Flagged:** 35% or greater deviation.
- Provides explanations for why a measurement receives a particular status.
- Uses clinical reference ranges as additional context where available.

These flags are decision-support indicators, not medical diagnoses.

### 4. Recovery Trajectory
- Analyzes actual post-flight measurements.
- Identifies when tracked biomarkers return to their defined baseline or reference conditions.
- Uses observed data only.
- Does not extrapolate or fabricate future recovery measurements.

### 5. Mission-Duration Risk Context
- Presents relevant published NASA research about health risks associated with longer-duration space missions.
- Provides scientific context for understanding potential mission-duration challenges.
- Keeps published research separate from the actual Inspiration4 measurements.

### 6. Data Transparency
- Includes an About This Data section documenting NASA data sources and analytical assumptions.
- Explains the flagging methodology.
- Documents a known data-quality issue.
- Makes limitations and interpretation boundaries visible to users.

---

## 🛰️ NASA Data Sources

The application primarily uses two NASA Open Science Data Repository studies from the SpaceX Inspiration4 mission.

| NASA Study | Dataset | Measurements |
|---|---|---|
| OSD-569 | Whole Blood | Complete Blood Count (CBC) |
| OSD-575 | Blood Serum | Comprehensive Metabolic Panel (CMP) and cytokine measurements |

**Official dataset references:**

- [OSD-569 — Whole Blood](https://osdr.nasa.gov/bio/repo/data/studies/OSD-569)
- [OSD-575 — Blood Serum](https://osdr.nasa.gov/bio/repo/data/studies/OSD-575)
- [NASA OSDR — Inspiration4 Mission Datasets](https://www.nasa.gov/osdr-latest-news-i4-mission-datasets/)

### Additional Scientific Reference

[NASA Human Research Program — Bone Fracture Risk Evidence Report](https://ntrs.nasa.gov/api/citations/20170004597/downloads/20170004597.pdf)

This report is used only as scientific literature context in the Mission-Duration Risk Context section. It is not treated as a source of Inspiration4 biomarker measurements.

### Dataset Overview

The application tracks:

- **4 anonymized subjects:** C001, C002, C003, C004.
- **7 mission timepoints:** L-92, L-44, L-3, R+1, R+45, R+82, R+194.
- **7 biomarkers:** WBC, absolute lymphocytes, hemoglobin, platelet count, glucose, sodium, and IL-6.
- **196 measurements:** 4 subjects × 7 timepoints × 7 biomarkers.

The measurements are organized into a complete 196-reading grid, based on the source data and preprocessing described in the application.

All subjects remain anonymized using NASA's published identifiers. No attempt has been made to identify individual crew members.

---

## 🔬 Our Analytical Approach

### Individual Baseline Comparison

With only four subjects from a single three-day mission, we chose not to treat the dataset as a population-wide clinical reference.

Instead, the flagging engine compares each subject's measurements against their own pre-flight average.

This approach helps identify individual deviations that could otherwise be hidden by population-level comparisons.

### Transparent Flagging

The system uses percentage deviation from the individual baseline to categorize measurements:

- Watch: ≥20% deviation.
- Flagged: ≥35% deviation.

Where applicable, clinical laboratory reference ranges provide additional context.

### Data Quality Handling

During data preparation, we identified a potentially clinically implausible platelet count reading for subject C003 at timepoint L-92.

Rather than silently modifying or removing the original measurement:

- The original published value remains visible in the timeline.
- A data-quality caveat is documented.
- The reading is excluded from the relevant baseline calculation to avoid distorting the subject's baseline.

This approach prioritizes transparency and preserves the distinction between source data and analytical processing.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend application |
| Vite | Development server and build tooling |
| Tailwind CSS v4 | Styling and responsive UI |
| Recharts | Biomarker charts and data visualization |
| JavaScript | Application logic and data processing |
| Python | One-time ETL data preparation |
| Vercel | Application deployment |

### Architecture

The application uses a lightweight client-side architecture.

There is no backend server or database. The relatively small, publicly available dataset is processed once through a Python ETL script and stored in a static JavaScript/JSON module.

This keeps the demonstration simple, reproducible, and easy to deploy.

---

## 📂 Project Structure

```text
mission-health-command-center/
│
├── etl/
│   └── build_readings.py
│
├── src/
│   ├── data/
│   │   ├── mission facts
│   │   ├── metrics
│   │   ├── real readings
│   │   └── data-quality notes
│   │
│   ├── lib/
│   │   ├── flagging engine
│   │   └── recovery analysis
│   │
│   ├── components/
│   │   ├── Sparkline
│   │   └── MissionTimeline
│   │
│   ├── pages/
│   │   ├── Briefing
│   │   ├── Dashboard
│   │   ├── CrewDetail
│   │   ├── Insights
│   │   └── About
│   │
│   └── ...
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Shahjalal-Dip/Mission-Health-Command-Center.git
```

Navigate to the project directory:

```bash
cd Mission-Health-Command-Center
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

---

## ⚠️ Known Limitations

- **Small sample size:** The application uses four anonymized subjects from one three-day mission.
- **Limited measurements:** The dashboard works with discrete clinical measurements rather than continuous real-time health streams.
- **Decision-support only:** The flagging engine is rule-based and has not been clinically validated.
- **Limited biomarker coverage:** The tracked measurements do not directly provide bone density or muscle mass measurements.
- **Recovery interpretation:** Recovery insights are based only on available post-flight observations, not predicted future outcomes.
- **Mission-duration context:** Published research is presented separately and should not be interpreted as a risk prediction for individual Inspiration4 subjects.

The application is an exploratory health-monitoring prototype, not a replacement for clinical assessment or professional medical judgment.

---

## 🔮 Future Improvements

Potential future development includes:

- Integration with additional publicly available NASA astronaut health datasets.
- Expanded biomarker coverage.
- More advanced statistical analysis of longitudinal health trends.
- Improved anomaly detection and personalized monitoring.
- Integration with continuous health-monitoring data when appropriate and available.
- More detailed mission-duration health-risk visualization.

---

## 👨‍💻 Team

**Individual Participant / Developer**

Shah Jalal Dip

- GitHub: https://github.com/Shahjalal-Dip

Developed for **NASA Space Apps Challenge 2026**.

---

## 📄 License

License: Not yet specified. Please check the repository for the applicable license before reusing or redistributing this project.

---

*Turning real astronaut health measurements into transparent, explainable mission health insights.*