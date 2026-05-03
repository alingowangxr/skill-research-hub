import math
from datetime import datetime, timezone
from collections import Counter

def predict_trends(skills, deltas=None):
    """
    Predict which skills will explode or die.
    Explosion: High delta, active, good base quality.
    Death: Low stars, zero delta, long inactivity.
    """
    if not deltas:
        deltas = {}

    exploding = []
    dying = []

    now = datetime.now(timezone.utc)

    for s in skills:
        s_id = s.get("id")
        delta = deltas.get(s_id, 0)
        stars = s.get("stars", 0)
        
        # Calculate updated_at days
        updated_at = s.get("updated_at")
        days_inactive = 365 # Default to old
        if updated_at:
            try:
                if isinstance(updated_at, (int, float)):
                    dt = datetime.fromtimestamp(updated_at, tz=timezone.utc)
                else:
                    dt = datetime.fromisoformat(str(updated_at).replace("Z", "+00:00"))
                days_inactive = (now - dt).days
            except:
                pass

        # Explosion Score (0-100)
        # Weight: 60% delta momentum, 20% activity, 20% base stars
        momentum_score = min(delta * 10, 60) # Max out at 6 stars growth
        activity_score = 20 if days_inactive <= 30 else (10 if days_inactive <= 90 else 0)
        base_score = min(math.log(stars + 1) * 4, 20)
        
        explosion_score = momentum_score + activity_score + base_score
        
        if explosion_score > 50 and days_inactive <= 60:
            exploding.append({
                "id": s_id,
                "name": s.get("name", "Unknown"),
                "score": round(explosion_score, 1),
                "delta": delta,
                "stars": stars
            })

    # Death Risk (0-100)
    for s in skills:
        s_id = s.get("id")
        delta = deltas.get(s_id, 0)
        stars = s.get("stars", 0)
        updated_at = s.get("updated_at")
        days_inactive = 365
        if updated_at:
            try:
                if isinstance(updated_at, (int, float)):
                    dt = datetime.fromtimestamp(updated_at, tz=timezone.utc)
                else:
                    dt = datetime.fromisoformat(str(updated_at).replace("Z", "+00:00"))
                days_inactive = (now - dt).days
            except:
                pass

        inactivity_risk = min(days_inactive / 2, 50) # 100 days = 50 risk
        growth_risk = 30 if delta <= 0 else 0
        low_stars_risk = 20 if stars < 10 else 0
        
        death_risk = inactivity_risk + growth_risk + low_stars_risk
        
        if death_risk > 70:
            dying.append({
                "id": s_id,
                "name": s.get("name", "Unknown"),
                "risk": round(death_risk, 1),
                "last_active": days_inactive,
                "stars": stars
            })

    # Sort results
    exploding.sort(key=lambda x: x["score"], reverse=True)
    dying.sort(key=lambda x: x["risk"], reverse=True)

    return {
        "exploding": exploding[:5],
        "dying": dying[:5]
    }

def compute_stats(skills, deltas=None):
    total = len(skills)
    if total == 0:
        return {}

    stars = [s.get("stars", 0) for s in skills]
    sorted_stars = sorted(stars)
    n = len(sorted_stars)
    
    # Improved Gini Calculation (Blue Book Style)
    total_stars = sum(stars)
    if total_stars > 0:
        stars_asc = sorted_stars
        cumsum = 0
        gini_sum = 0
        for v in stars_asc:
            cumsum += v
            gini_sum += cumsum
        # Formula: (n + 1 - 2 * (sum of cumulative sums) / total_stars) / n
        gini = (n + 1 - 2 * gini_sum / total_stars) / n
    else:
        gini = 0

    # Star Buckets (Long Tail)
    buckets = {
        "0": 0,
        "1-9": 0,
        "10-49": 0,
        "50-99": 0,
        "100+": 0
    }
    for s in stars:
        if s == 0: buckets["0"] += 1
        elif s < 10: buckets["1-9"] += 1
        elif s < 50: buckets["10-49"] += 1
        elif s < 100: buckets["50-99"] += 1
        else: buckets["100+"] += 1

    # Activity Status
    now = datetime.now(timezone.utc)
    activity = {"active": 0, "stale": 0, "decaying": 0, "dead": 0}
    for s in skills:
        updated_at = s.get("updated_at")
        if not updated_at:
            activity["dead"] += 1
            continue
        
        try:
            if isinstance(updated_at, (int, float)):
                dt = datetime.fromtimestamp(updated_at, tz=timezone.utc)
            else:
                dt = datetime.fromisoformat(str(updated_at).replace("Z", "+00:00"))
            
            days = (now - dt).days
            if days <= 30: activity["active"] += 1
            elif days <= 90: activity["stale"] += 1
            elif days <= 180: activity["decaying"] += 1
            else: activity["dead"] += 1
        except:
            activity["dead"] += 1

    # Author Concentration
    authors = [s.get("author", "unknown") for s in skills]
    author_counts = Counter(authors)
    author_stars = {}
    for s in skills:
        a = s.get("author", "unknown")
        author_stars[a] = author_stars.get(a, 0) + s.get("stars", 0)
    
    sorted_author_stars = sorted(author_stars.values(), reverse=True)
    top_10_author_share = sum(sorted_author_stars[:10]) / total_stars * 100 if total_stars > 0 else 0
    single_skill_authors = sum(1 for count in author_counts.values() if count == 1)
    single_author_pct = single_skill_authors / len(author_counts) * 100 if author_counts else 0

    zero_pct = buckets["0"] / total * 100
    top_n = max(int(total * 0.01), 1)
    top_share = sum(sorted(stars, reverse=True)[:top_n]) / total_stars * 100 if total_stars else 0

    return {
        "total": total,
        "gini": round(gini, 3),
        "zero_star_pct": round(zero_pct, 1),
        "top_1_pct": round(top_share, 1),
        "star_buckets": buckets,
        "activity_health": activity,
        "author_concentration": {
            "top_10_share": round(top_10_author_share, 1),
            "single_author_pct": round(single_author_pct, 1),
            "total_authors": len(author_counts)
        },
        "predictions": predict_trends(skills, deltas)
    }

def skill_score(s):
    stars = (s.get("stars") or 0)
    updated_at = s.get("updated_at")
    activity_bonus = 1.0
    if updated_at:
        try:
            now = datetime.now(timezone.utc)
            if isinstance(updated_at, (int, float)):
                dt = datetime.fromtimestamp(updated_at, tz=timezone.utc)
            else:
                dt = datetime.fromisoformat(str(updated_at).replace("Z", "+00:00"))
            days = (now - dt).days
            if days <= 30: activity_bonus = 1.2
            elif days > 180: activity_bonus = 0.5
        except:
            pass
    return math.log(stars + 1) * 0.7 * activity_bonus
