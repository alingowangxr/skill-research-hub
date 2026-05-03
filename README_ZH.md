# 🔍 Skill Research Hub (中文版)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)

這是一個專業的全端研究儀表板，旨在抓取、分析並視覺化 AI Agent Skill 生態系統。本工具深受 **《Skill 藍皮書 2026》** 啟發，提供市場分佈、趨勢預測及自動化 AI 報告的深度洞察。

---

## 🚀 核心功能

### 📊 進階市場分析 (藍皮書標準)
- **基尼係數優化**：精準衡量生態系統中「星星財富」的不平等程度。
- **長尾分佈**：互動式視覺化展示「沈默的大多數」（0 星技能）。
- **海量數據規模**：具備 20,000+ 筆真實資料的分析能力，對標專業研究標準。

### 🕸️ 多源智慧探測系統
- **深度遍歷**：自動對 SkillsMP API 進行全量分頁抓取。
- **GitHub 原生整合**：直接探索 `mcp-server` 主題及 `SKILL.md` 特徵檔案。
- **持久化冷卻機制**：內建 12 小時持久化冷卻檢查，防止 API 頻率超限。

### 🏗️ 穩定性技術架構
- **高效存儲**：採用 SQLite **WAL 模式**，支援背景採集與前端讀取併發執行。
- **非同步採集**：基於 FastAPI BackgroundTasks，進入網頁即秒開，更新在後台默默進行。
- **預熱工具**：提供 CLI 預熱腳本，一鍵完成初始資料庫的大量填充。

### ✍️ 自動化研究報告生成
- **AI 撰稿引擎**：整合 Gemini 1.5 Flash，自動撰寫專業級市場分析文章。
- **Markdown 專業排版**：使用 Tailwind Typography 打造期刊級的閱讀體驗。
- **範例報告**：[查看自動生成的示範報告](./docs/reports/sample_report_zh.md)


### 🩺 生態健康診斷
- **活躍生命週期**：根據更新頻率將技能分類為 *活躍、停滯、衰退* 或 *死亡*。

---

## 🏗️ 專案結構

```text
.
├── backend/                # FastAPI 後端應用
│   ├── app/
│   │   ├── api/           # API 接口 (市場、預測、報告)
│   │   ├── services/      # 核心邏輯 (分析、AI 報告、採集)
│   │   └── cache.py       # 數據持久化層
│   └── requirements.txt    # Python 依賴
├── frontend/               # React TypeScript 前端應用 (Vite)
│   ├── src/
│   │   ├── components/    # Recharts 與 UI 組件
│   │   ├── api/           # 型別定義的 API 客戶端
│   │   └── App.tsx        # 主儀表板佈局
│   └── package.json        # Node 依賴
└── README_ZH.md
```

---

## 🛠️ 技術棧

- **後端**: Python 3.8+, FastAPI, Uvicorn, google-generativeai.
- **前端**: React 19, TypeScript, Vite, Recharts, Tailwind CSS.
- **數據**: 決定性元數據模擬，確保研究數據集的一致性。

---

## 🏃 快速開始

### 環境要求
- Python 3.8+
- Node.js 18+ & npm
- [Google Gemini API Key](https://aistudio.google.com/) (選填，用於自動報告生成)

### 設置與運行

1. **克隆倉庫**
   ```bash
   git clone https://github.com/alingowangxr/skill-research-hub.git
   cd skill-research-hub
   ```

2. **後端設置**
   ```bash
   cd backend
   pip install -r requirements.txt
   # 創建 .env 並加入：
   # GOOGLE_API_KEY=您的金鑰
   python -m uvicorn app.main:app --reload
   ```

3. **前端設置**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **訪問儀表板**: `http://localhost:5173`

---

## 🤝 參與貢獻

歡迎任何形式的貢獻！無論是增加新的數據源、優化預測模型還是改進 UI。

1. Fork 本專案
2. 創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📝 授權協議

本專案採用 MIT 授權協議。詳見 `README.md`。

## 🙏 鳴謝

- 啟發自 [Agent Skills Blue Book 2026](https://github.com/zhuyansen/skill-blue-book)。
- 為 AI Agent 社群用心打造 ❤️。
