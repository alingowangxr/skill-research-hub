import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, BarChart3, AlertCircle, RefreshCw, TrendingUp, Activity, ShieldCheck } from 'lucide-react'
import { StatCard } from './components/StatCard'
import { RankingsTable } from './components/RankingsTable'
import { TrendingGrid } from './components/TrendingGrid'
import { DistributionChart } from './components/DistributionChart'
import { ActivityHealth } from './components/ActivityHealth'
import { PredictionForecast } from './components/PredictionForecast'
import { ResearchReport } from './components/ResearchReport'
import { fetchMarketStats, fetchRankings, fetchTrending } from './api/client'
import type { MarketStats, Skill } from './api/client'

function App() {
  const [stats, setStats] = useState<MarketStats | null>(null)
  const [rankings, setRankings] = useState<Skill[]>([])
  const [trending, setTrending] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, r, t] = await Promise.all([
        fetchMarketStats(),
        fetchRankings(),
        fetchTrending()
      ])
      setStats(s)
      setRankings(r)
      setTrending(t)
    } catch (err) {
      setError('Failed to connect to the backend. Make sure the FastAPI server is running on port 8000.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight leading-none">Skill Research Hub</h1>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Powered by Blue Book Analytics</span>
            </div>
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Core Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Skills" 
            value={stats?.total || 0} 
            icon={Users} 
            description="Total indexed unique skills"
          />
          <StatCard 
            title="Gini Coefficient" 
            value={stats?.gini || '0.000'} 
            icon={LayoutDashboard} 
            description="Wealth inequality (Stars)"
          />
          <StatCard 
            title="Zero Star %" 
            value={`${stats?.zero_star_pct || 0}%`} 
            icon={AlertCircle} 
            description="Skills with no star recognition"
          />
          <StatCard 
            title="Top 1% Share" 
            value={`${stats?.top_1_pct || 0}%`} 
            icon={TrendingUp} 
            description="Star share of top 1% skills"
          />
        </div>

        {/* AI Research Report Section */}
        <ResearchReport />

        {/* Research Charts */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DistributionChart data={stats.star_buckets} />
            <ActivityHealth data={stats.activity_health} />
          </div>
        )}

        {/* Future Forecast */}
        {stats && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500 fill-current" />
              <h2 className="text-lg font-bold">Future Forecast (AI Predictions)</h2>
            </div>
            <PredictionForecast predictions={stats.predictions} />
          </div>
        )}

        {/* Creator Insights */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Top 10 Creator Share" 
              value={`${stats.author_concentration.top_10_share}%`} 
              icon={TrendingUp} 
              description="Star share of top 10 authors"
            />
            <StatCard 
              title="Single-Skill Authors" 
              value={`${stats.author_concentration.single_author_pct}%`} 
              icon={Users} 
              description="Authors with only one skill"
            />
            <StatCard 
              title="Total Authors" 
              value={stats.author_concentration.total_authors} 
              icon={ShieldCheck} 
              description="Unique skill creators indexed"
            />
          </div>
        )}

        {/* Trending Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">Trending Growth (Delta)</h2>
          </div>
          <TrendingGrid skills={trending} />
        </div>

        {/* Rankings Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">Skill Rankings (Quality Score)</h2>
          </div>
          <RankingsTable skills={rankings} />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        <p className="text-center text-gray-400 text-xs">
          Skill Research Hub &copy; 2026. Inspired by Agent Skills Blue Book.
        </p>
      </footer>
    </div>
  )
}

export default App
