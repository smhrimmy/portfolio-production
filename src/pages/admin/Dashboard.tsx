import { motion } from "framer-motion"
import { Activity, Users, Database, FileText, ArrowRight } from "lucide-react"
import { InsightsDigest } from "../../components/admin/InsightsDigest"

export default function Dashboard() {
  const stats = [
    { label: "Total Projects", value: "14", icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Visitors", value: "24", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Published Articles", value: "8", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "System Health", value: "98%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">Dashboard</h1>
        <p className="text-neutral-400 mt-2">Welcome to your Portfolio OS Control Center.</p>
      </div>

      <InsightsDigest />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between z-10">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="z-10">
              <h3 className="text-3xl font-bold text-neutral-50">{stat.value}</h3>
              <p className="text-sm font-medium text-neutral-400 mt-1">{stat.label}</p>
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-50">Recent Activity</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { text: "Deployed new theme 'Terminal IDE'", time: "2 hours ago" },
              { text: "Updated project 'Portfolio OS'", time: "5 hours ago" },
              { text: "Added new skill 'PostgreSQL'", time: "1 day ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-neutral-300 flex-1">{activity.text}</span>
                <span className="text-neutral-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-50">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 transition-colors flex flex-col items-center justify-center gap-2 text-neutral-300 hover:text-neutral-50">
              <FileText className="w-6 h-6" />
              <span className="text-sm font-medium">New Article</span>
            </button>
            <button className="p-4 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 transition-colors flex flex-col items-center justify-center gap-2 text-neutral-300 hover:text-neutral-50">
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Update Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
