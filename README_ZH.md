# Skill Research Hub (原 SkillSMP Analytics)

這是一個專業的全端研究儀表板，旨在抓取、分析並視覺化 AI Agent Skill 生態系統。本工具深受 **《Skill 藍皮書 2026》** 啟發，能深入洞察市場分佈、預測趨勢並自動生成 AI 研究報告。

## 🚀 核心功能 (藍皮書增強版)

- **進階市場分析**：
  - **優化基尼係數 (Gini Coefficient)**：精準衡量星星分佈的不平等程度。
  - **長尾分佈 (Star Buckets)**：視覺化展示「沈默的大多數」，將技能按星數分組 (0, 1-9, 10-49 等)。
  - **創作者集中度**：分析前 10 名作者的市場佔有率及「單次創作者」比例。
- **未來趨勢預測 (Future Forecast)**：
  - **爆紅預測**：基於動態增長率、活躍度與基礎質量的 AI 評分模型。
  - **死亡風險評估**：識別因停滯不前或缺乏關注而面臨淘汰風險的技能。
- **自動化研究報告生成**：
  - **AI 撰稿引擎**：整合 Gemini 1.5 Flash，自動撰寫專業級市場分析文章。
  - **Markdown 專業排版**：支持 Markdown 渲染與一鍵複製，具備論文級展示效果。
- **生態健康監測**：
  - **活躍度狀態 (Activity Status)**：根據更新頻率將技能分類為「活躍」、「停滯」、「衰退」或「死亡」。

## 🏗️ 系統架構

### 後端 (FastAPI)
- **研究服務層**：在 `analytics.py` 中實現統計分佈與趨勢預測算法。
- **AI 報告服務**：`reporter.py` 利用 Google Generative AI 進行自動化內容創作。
- **採集與元數據**：確保所有索引技能具備研究用的元數據（作者、最後更新時間）。

### 前端 (React + TypeScript)
- **視覺化分析**：基於 Recharts 的互動式柱狀圖與環形圖。
- **富文本呈現**：整合 `react-markdown` 與 Tailwind Typography，實現專業的報告展示。

## 🛠️ 技術棧

- **後端**：Python 3.8+, FastAPI, Uvicorn, google-generativeai, Requests。
- **前端**：React 19, TypeScript, Vite, Recharts, react-markdown, Tailwind CSS。

## 🏃 快速開始

### 環境需求
- Python 3.8+
- Node.js 18+ & npm
- Google Gemini API Key (選填，用於自動報告生成)

### 後端設置
1. 進入目錄：`cd backend`
2. 安裝依賴：`pip install -r requirements.txt`
3. 配置 `.env` 檔案：
   ```env
   GOOGLE_API_KEY=您的Gemini金鑰
   SKILLSMP_API_KEY=您的API金鑰
   ```
4. 啟動伺服器：`python -m uvicorn app.main:app --reload`

### 前端設置
1. 進入目錄：`cd frontend`
2. 安裝依賴：`npm install`
3. 啟動開發伺服器：`npm run dev`
4. 訪問儀表板：`http://localhost:5173`

## 📊 核心研究指標

- **基尼係數 (Gini Coefficient)**：衡量市場財富（Stars）不平等程度。
- **爆紅指數 (Explosion Score)**：預測具備病毒式增長潛力的熱門技能。
- **死亡風險 (Death Risk)**：預警可能被市場遺忘或替代的技能。
- **活躍狀態**：透過追蹤提交時間來衡量生態系統的生命力。

## 📝 授權協議

MIT
