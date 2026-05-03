# MCP Analytics MVP - Improvements Progress

## ✅ 1. 移除模擬欄位，建立可追溯資料來源 (Completed)
- 新增欄位：`source`, `source_url`, `fetched_at`, `is_inferred`, `metadata_quality`, `stars`
- `simulate_metadata()` 會標記 `is_inferred=True` 並降低質量分
- 存儲時保留原始資料與系統補值的差異

## ✅ 2. 建立歷史快照，支援真正的趨勢分析 (Completed)
- 新增 `snapshots` 資料表，記錄每日星數
- 收集時自動寫入快照
- `cache.get_all_deltas()` 支援計算 7 天變化

## ✅ 3. 重做 trending 定義，改成成長榜 (Completed)
- `/trending` API 拆分為 `growth`, `new_comers`, `revivals`
- 前端 `TrendingGrid` 更新以顯示分類榜單與成長值 (Delta)

## ✅ 4. 優化 SQLite 寫入效能與資料結構 (Completed)
- 實作 `save_skills_batch()` 使用 `executemany`
- 新增索引：`updated_at`, `author`, `name`
- 減少 Transaction 開銷

## ✅ 5. 把本機硬編碼設定改成可部署設定 (Completed)
- 前端 `BASE_URL` 使用 `import.meta.env.VITE_API_BASE_URL`
- 後端 CORS Origins 使用 `ALLOW_ORIGINS` 環境變數

---

## 下一步建議
1.  **前端可視化增強**：在 `RankingsTable` 中加入小圖表 (Sparklines) 顯示星數變化趨勢。
2.  **增量更新策略**：目前的收集器每次都是全量掃描，當資料量破萬時會太慢，應改為只抓取 `updated_at` 在上次收集之後的資料。
3.  **自動化任務**：建立 GitHub Action 或 Cron Job 定期執行 `warmup.py` 以維持歷史快照的連續性。
