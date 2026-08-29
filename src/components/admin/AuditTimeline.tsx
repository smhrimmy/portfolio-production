import { useState, useEffect } from "react"
import { History, Clock } from "lucide-react"

interface AuditLog {
  id: string
  action: string
  user: string
  changes: string
  createdAt: string
}

interface AuditTimelineProps {
  entity: string
  entityId: string
  token: string | null
}

export function AuditTimeline({ entity, entityId, token }: AuditTimelineProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (entityId && token) {
      fetchLogs()
    }
  }, [entityId, token])

  const fetchLogs = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/audit/${entity}/${entityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setLogs(await res.json())
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-sm text-neutral-500 animate-pulse">Loading history...</div>

  if (logs.length === 0) return (
    <div className="flex flex-col items-center justify-center p-6 text-neutral-500 bg-neutral-900/50 rounded-lg border border-neutral-800 border-dashed">
      <History className="w-6 h-6 mb-2 text-neutral-600" />
      <p className="text-sm">No revision history yet.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
        <History className="w-4 h-4" />
        Revision History
      </h3>
      <div className="relative border-l border-neutral-800 ml-2 space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-6">
            <div className={`absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border-2 border-neutral-950 ${
              log.action === 'create' ? 'bg-emerald-500' :
              log.action === 'publish' ? 'bg-indigo-500' :
              log.action === 'delete' ? 'bg-red-500' :
              'bg-amber-500'
            }`} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-200 capitalize">
                {log.action}
              </span>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                <span>by {log.user}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
