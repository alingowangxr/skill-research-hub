# 🔍 Skill Research Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)

A professional full-stack research dashboard designed to crawl, analyze, and visualize the AI Agent Skill ecosystem. Inspired by the **Agent Skills Blue Book 2026**, this tool provides deep insights into market distribution, predictive trends, and automated AI reporting.

---

## 🚀 Key Features

### 📊 Advanced Market Analytics (Blue Book Standard)
- **Gini Coefficient Optimization**: Precise measurement of "star wealth" inequality in the ecosystem.
- **Long-Tail Distribution**: Interactive visualization of the "silent majority" (0-star skills).
- **Creator Concentration**: Metrics on star share by top authors and single-skill creator ratios.

### 🔮 Future Forecast (Predictive AI)
- **Explosion Score**: Identifies high-momentum skills with viral potential using a weighted momentum/quality model.
- **Death Risk Assessment**: Early warning system for skills showing signs of stagnation or abandonment.

### ✍️ Automated Research Reporting
- **AI Synthesis**: Generates professional-grade research articles using Gemini 1.5 Flash.
- **Markdown & Prose**: Beautifully formatted reports using Tailwind Typography for a journal-like reading experience.
- **Example Output**: [View a Sample Research Report](./docs/reports/sample_report_zh.md)

### 🩺 Ecosystem Health
- **Activity Lifecycles**: Categorizes skills as *Active, Stale, Decaying,* or *Dead* based on update recency.

---

## 🏗️ Project Structure

```text
.
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── api/           # API Endpoints (Market, Predictions, Reports)
│   │   ├── services/      # Core Logic (Analytics, AI Reporter, Collector)
│   │   └── cache.py       # Data Persistence Layer
│   └── requirements.txt    # Python Dependencies
├── frontend/               # React TypeScript Application (Vite)
│   ├── src/
│   │   ├── components/    # Recharts & UI Components
│   │   ├── api/           # Typed API Client
│   │   └── App.tsx        # Main Dashboard Layout
│   └── package.json        # Node Dependencies
└── README.md
```

---

## 🛠️ Tech Stack

- **Backend**: Python 3.8+, FastAPI, Uvicorn, google-generativeai.
- **Frontend**: React 19, TypeScript, Vite, Recharts, Tailwind CSS.
- **Data**: Deterministic metadata simulation for consistent research datasets.

---

## 🏃 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+ & npm
- [Google Gemini API Key](https://aistudio.google.com/) (Optional, for AI reporting)

### Setup & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/alingowangxr/skill-research-hub.git
   cd skill-research-hub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Create .env and add:
   # GOOGLE_API_KEY=your_key
   python -m uvicorn app.main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Visit Dashboard**: `http://localhost:5173`

---

## 🤝 Contributing

Contributions are welcome! Whether it's adding new data sources, refining the prediction model, or improving the UI.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `README.md` for more information.

## 🙏 Acknowledgments

- Inspired by the [Agent Skills Blue Book 2026](https://github.com/zhuyansen/skill-blue-book).
- Built with ❤️ for the AI Agent community.
