import os
import google.generativeai as genai
from typing import Dict, Any

def generate_report_prompt(stats: Dict[str, Any]) -> str:
    """Construct a professional research prompt based on market data."""
    return f"""
你是一位資深的 AI 生態研究員，請根據以下提供的最新技能市場統計數據，撰寫一份專業的研究報告（中文）。

### 市場統計數據概要
- 總技能數：{stats.get('total')}
- 基尼係數：{stats.get('gini')} (衡量市場不平等程度，越接近 1 代表越壟斷)
- 零星佔比：{stats.get('zero_star_pct')}% (從未獲得星星的技能比例)
- 前 1% 份額：{stats.get('top_1_pct')}% (頂部 1% 技能佔有的星星總數比例)

### 生態健康度 (Activity Health)
- 活躍技能：{stats.get('activity_health', {}).get('active')}
- 停滯技能：{stats.get('activity_health', {}).get('stale')}
- 衰退技能：{stats.get('activity_health', {}).get('decaying')}
- 死亡技能：{stats.get('activity_health', {}).get('dead')}

### 創作者分析
- 前 10 名作者佔有率：{stats.get('author_concentration', {}).get('top_10_share')}%
- 單一技能創作者比例：{stats.get('author_concentration', {}).get('single_author_pct')}%
- 總創作者人數：{stats.get('author_concentration', {}).get('total_authors')}

### 未來預測
- 爆紅潛力技能：{', '.join([s['name'] for s in stats.get('predictions', {}).get('exploding', [])])}
- 死亡風險技能：{', '.join([s['name'] for s in stats.get('predictions', {}).get('dying', [])])}

### 報告要求
1. **標題**：吸引人且專業的標題。
2. **市場現狀分析**：解讀基尼係數與長尾分佈的意義。
3. **生態活力診斷**：分析活躍與死亡技能的比例，給出生態健康建議。
4. **創作者生態**：評論創作者的集中度對新人的機會。
5. **趨勢展望**：針對預測的爆紅技能進行點評。
6. **結論**：給開發者或投資者的三條核心建議。

請使用 Markdown 格式撰寫，語言風格要專業、客觀且具備洞察力。
"""

def get_ai_report(stats: Dict[str, Any]) -> str:
    """Generate report using Gemini API if key is provided, else return prompt."""
    api_key = os.getenv("GOOGLE_API_KEY")
    prompt = generate_report_prompt(stats)
    
    if not api_key:
        return f"MISSING_API_KEY: 尚未配置 GOOGLE_API_KEY。請手動使用以下 Prompt：\n\n{prompt}"
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"ERROR: AI 生成失敗。{str(e)}\n\n手動 Prompt：\n\n{prompt}"
