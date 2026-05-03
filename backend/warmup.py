import sys
import os

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from app.services.collector import collect_dataset
from app.cache import load_cache

def main():
    print("========================================")
    print("🚀 Skill Research Hub - 全站資料預熱程序")
    print("========================================")
    print("正在連接 API 並掃描多個來源 (SkillsMP + GitHub)...")
    print("這可能需要 3-10 分鐘，請保持網路連線。")
    
    try:
        # Trigger the full collection, force=True to bypass cooldown
        collect_dataset(force=True)
        
        # Verify result
        final_data = load_cache()
        print("========================================")
        print(f"✅ 預熱完成！")
        print(f"📊 目前資料庫中共有 {len(final_data)} 筆 Skill 資料。")
        print("========================================")
        print("您現在可以啟動後端並打開儀表板了。")
        
    except Exception as e:
        print(f"❌ 預熱過程中發生錯誤: {e}")

if __name__ == "__main__":
    main()
