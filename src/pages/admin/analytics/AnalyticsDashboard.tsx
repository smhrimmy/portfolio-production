import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Eye, Users, RefreshCcw, AlertCircle } from "lucide-react"

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [timeseries, setTimeseries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("adminToken")
      if (!token) throw new Error("No token")

      const [summaryRes, tsRes] = await Promise.all([
        fetch("/api/admin/analytics/summary", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("/api/admin/analytics/timeseries?days=30", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (!summaryRes.ok || !tsRes.ok) throw new Error("Failed to fetch analytics")

      setSummary(await summaryRes.json())
      setTimeseries(await tsRes.json())
      setError(null)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <RefreshCcw className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-950/50 border border-red-900/50 p-6 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          <div>
            <h3 className="text-red-500 font-medium mb-1">Failed to load analytics</h3>
            <p className="text-red-400/80 text-sm">{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-4 px-4 py-2 bg-red-950 hover:bg-red-900 text-red-400 text-sm rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-100 mb-1">Analytics</h1>
          <p className="text-neutral-400 text-sm">Traffic and engagement metrics (Last 30 Days)</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-lg transition-colors border border-neutral-800"
          title="Refresh"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-neutral-400 font-medium">Total Views</h3>
          </div>
          <div className="text-3xl font-semibold text-neutral-100">
            {summary?.totalViews?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-neutral-400 font-medium">Last 30 Days</h3>
          </div>
          <div className="text-3xl font-semibold text-neutral-100">
            {summary?.recentViews?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 mb-8">
        <h3 className="text-neutral-100 font-medium mb-6">Traffic Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#525252" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#525252" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#262626' }}
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e5e5e5' }}
              />
              <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h3 className="text-neutral-100 font-medium">Top Pages</h3>
          </div>
          <div className="divide-y divide-neutral-800">
            {summary?.topPages?.length > 0 ? (
              summary.topPages.map((page: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-900/50 transition-colors">
                  <div className="text-neutral-300 text-sm truncate pr-4">{page.path}</div>
                  <div className="text-neutral-400 font-medium text-sm whitespace-nowrap">
                    {page.views.toLocaleString()} views
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500 text-sm">No page data available</div>
            )}
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h3 className="text-neutral-100 font-medium">Top Referrers</h3>
          </div>
          <div className="divide-y divide-neutral-800">
            {summary?.topReferrers?.length > 0 ? (
              summary.topReferrers.map((ref: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-900/50 transition-colors">
                  <div className="text-neutral-300 text-sm truncate pr-4">{ref.referrer}</div>
                  <div className="text-neutral-400 font-medium text-sm whitespace-nowrap">
                    {ref.count.toLocaleString()} visits
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500 text-sm">No referrer data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
