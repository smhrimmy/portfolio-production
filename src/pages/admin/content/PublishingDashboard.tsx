// @ts-nocheck
import { Archive, Edit2, CheckCircle2, History } from "lucide-react"
import { useState } from "react"

export default function PublishingDashboard() {
  const [activities, setActivities] = useState<any[]>([])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            Publishing Center
          </h1>
          <p className="text-neutral-400 mt-1">Manage content states, audit logs, and release history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Edit2 className="w-8 h-8 text-yellow-500 mb-3" />
          <h3 className="text-xl font-bold text-neutral-200">12</h3>
          <p className="text-sm text-neutral-500">Active Drafts</p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="text-xl font-bold text-neutral-200">48</h3>
          <p className="text-sm text-neutral-500">Published Items</p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Archive className="w-8 h-8 text-neutral-500 mb-3" />
          <h3 className="text-xl font-bold text-neutral-200">5</h3>
          <p className="text-sm text-neutral-500">Archived Items</p>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-neutral-200">Recent Audit Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Entity</th>
                <th className="px-6 py-4 font-medium">User</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                  Connect Audit API here...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
