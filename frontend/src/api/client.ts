const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export interface MarketStats {
  total: number;
  gini: number;
  zero_star_pct: number;
  top_1_pct: number;
  star_buckets: Record<string, number>;
  activity_health: {
    active: number;
    stale: number;
    decaying: number;
    dead: number;
  };
  author_concentration: {
    top_10_share: number;
    single_author_pct: number;
    total_authors: number;
  };
  predictions: {
    exploding: Array<{ id: string; name: string; score: number; delta: number; stars: number }>;
    dying: Array<{ id: string; name: string; risk: number; last_active: number; stars: number }>;
  };
}

export interface Skill {
  id: string;
  name?: string;
  stars: number;
  source?: string;
  source_url?: string;
  fetched_at?: string;
  is_inferred?: boolean;
  metadata_quality?: number;
  delta?: number;
  [key: string]: any;
}

export interface TrendingResults {
  growth: Skill[];
  new_comers: Skill[];
  revivals: Skill[];
}

export const fetchMarketStats = async (): Promise<MarketStats> => {
  const response = await fetch(`${BASE_URL}/market/`);
  if (!response.ok) throw new Error('Failed to fetch market stats');
  return response.json();
};

export const fetchRankings = async (): Promise<Skill[]> => {
  const response = await fetch(`${BASE_URL}/rankings/`);
  if (!response.ok) throw new Error('Failed to fetch rankings');
  return response.json();
};

export const fetchTrending = async (): Promise<TrendingResults> => {
  const response = await fetch(`${BASE_URL}/trending/`);
  if (!response.ok) throw new Error('Failed to fetch trending');
  return response.json();
};

export const fetchReport = async (): Promise<{ report: string }> => {
  const response = await fetch(`${BASE_URL}/market/report`);
  if (!response.ok) throw new Error('Failed to generate report');
  return response.json();
};
