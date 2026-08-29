import { useIntelligenceStore } from "../../stores/intelligenceStore"
import { AlertCircle, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

export function InsightsDigest() {
  const { insights, isIndexed } = useIntelligenceStore()

  if (!isIndexed) return null

  // Get top 3 insights sorted by severity
  const topInsights = insights.slice(0, 3)

  if (topInsights.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-lg font-bold">Health Scan</h2>
        </div>
        <p className="text-neutral-400 mt-2 text-sm">
          Your portfolio is in great shape! No major SEO or content issues found.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold">Portfolio Insights</h2>
        </div>
        <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded">
          {insights.length} total recommendations
        </span>
      </div>
      
      <div className="divide-y divide-neutral-800">
        {topInsights.map((insight) => (
          <div key={insight.id} className="p-4 hover:bg-neutral-800/50 transition-colors">
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                <AlertCircle className={`w-4 h-4 ${
                  insight.severity === 'high' ? 'text-red-400' :
                  insight.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-200 leading-snug">{insight.message}</p>
                {insight.actionUrl && (
                  <Link 
                    to={insight.actionUrl}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    {insight.actionLabel} <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
