import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, BarChart3, AlertCircle, RefreshCw, TrendingUp, Activity, ShieldCheck, Zap } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'market' | 'trends' | 'rankings' | 'research'>('market')

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-100/40 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">Skill Research Hub</h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Live Intelligence: {stats?.total.toLocaleString() || 0} Skills</span>
              </div>
            </div>
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="group relative flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-slate-200 disabled:opacity-50 overflow-hidden"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>Sync Intelligence</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex p-1 gap-1 bg-slate-200/50 rounded-2xl w-fit">
          {[
            { id: 'market', label: 'Market Overview', icon: LayoutDashboard },
            { id: 'trends', label: 'Discovery & Trends', icon: Zap },
            { id: 'rankings', label: 'Skill Rankings', icon: TrendingUp },
            { id: 'research', label: 'AI Reports', icon: ShieldCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'market' && (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

            {/* Research Charts */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DistributionChart data={stats.star_buckets} />
                <ActivityHealth data={stats.activity_health} />
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
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

            {/* Trending Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Trending Growth</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Momentum Intelligence (Delta)</p>
                </div>
              </div>
              <div className="glass p-2 rounded-[2rem] shadow-soft">
                <TrendingGrid skills={trending} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rankings' && (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Rankings Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Skill Rankings</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Quality Scoring Matrix (Top 50)</p>
                </div>
              </div>
              <div className="glass p-2 rounded-[2rem] shadow-soft overflow-hidden">
                <RankingsTable skills={rankings} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Research Report Section */}
            <ResearchReport />
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/50 mt-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Skill Research Hub</span>
          </div>
          <p className="text-slate-400 text-[11px] font-medium leading-loose max-w-sm">
            A premium intelligence platform for AI Agent ecosystems. <br />
            Inspired by Agent Skills Blue Book &copy; 2026.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
