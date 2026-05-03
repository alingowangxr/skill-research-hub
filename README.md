# Skill Research Hub (formerly SkillSMP Analytics)

A professional full-stack research dashboard designed to crawl, analyze, and visualize the AI Agent Skill ecosystem. Inspired by the **Agent Skills Blue Book 2026**, this tool provides deep insights into market distribution, predictive trends, and automated AI reporting.

## 🚀 Key Features (Blue Book Edition)

- **Advanced Market Analytics**: 
  - **Optimized Gini Coefficient**: Precise measurement of star distribution inequality.
  - **Long-Tail Distribution**: Visualize the "silent majority" with Star Buckets (0, 1-9, 10-49, etc.).
  - **Creator Concentration**: Analyze star share of top 10 authors and the "single-skill creator" ratio.
- **Predictive Trends (Future Forecast)**:
  - **Explosion Prediction**: AI-driven scoring based on momentum, activity, and base quality.
  - **Death Risk Assessment**: Identify endangered skills based on stagnation and low engagement.
- **Automated Research Reporting**:
  - **AI Writing Engine**: Generates professional research articles using Gemini 1.5 Flash.
  - **Markdown & Prose**: Beautifully formatted reports with copy-to-clipboard support.
- **Ecosystem Health Monitoring**:
  - **Activity Status**: Categorize skills as Active, Stale, Decaying, or Dead based on update frequency.

## 🏗️ Architecture

### Backend (FastAPI)
- **Research Services**: Specialized logic in `analytics.py` for statistical distributions and predictive modeling.
- **AI Reporter**: `reporter.py` leverages Google Generative AI for automated content creation.
- **Collector & Metadata**: Ensures all indexed skills have research-ready metadata (author, last update).

### Frontend (React + TypeScript)
- **Visual Analytics**: Interactive Bar and Pie charts powered by Recharts.
- **Rich Content**: Markdown rendering with Tailwind Typography for professional report presentation.

## 🛠️ Tech Stack

- **Backend**: Python 3.8+, FastAPI, Uvicorn, google-generativeai, Requests.
- **Frontend**: React 19, TypeScript, Vite, Recharts, react-markdown, Tailwind CSS.

## 🏃 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+ & npm
- Google Gemini API Key (Optional, for AI reporting)

### Backend Setup
1. Enter directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Configure `.env`:
   ```env
   GOOGLE_API_KEY=your_gemini_key
   SKILLSMP_API_KEY=your_api_key
   ```
4. Run server: `python -m uvicorn app.main:app --reload`

### Frontend Setup
1. Enter directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Access dashboard: `http://localhost:5173`

## 📊 Core Research Metrics

- **Gini Coefficient**: Measures "wealth" (star) inequality. 1.0 = total monopoly; 0.0 = perfect equality.
- **Explosion Score**: Predicts high-momentum skills likely to go viral.
- **Death Risk**: Forecasts skills at risk of being abandoned or replaced.
- **Activity Status**: Measures the vitality of the ecosystem by tracking commit recency.

## 📝 License

MIT
