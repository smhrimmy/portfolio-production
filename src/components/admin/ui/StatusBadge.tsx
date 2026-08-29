import { Clock, CheckCircle2, FileEdit, Archive } from "lucide-react"

interface StatusBadgeProps {
  status: string
  publishDate?: string | null
}

export function StatusBadge({ status, publishDate }: StatusBadgeProps) {
  const isScheduled = status === "published" && publishDate && new Date(publishDate) > new Date()
  
  if (isScheduled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
        <Clock className="w-3.5 h-3.5" />
        Scheduled
      </span>
    )
  }

  switch (status) {
    case "published":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Published
        </span>
      )
    case "draft":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
          <FileEdit className="w-3.5 h-3.5" />
          Draft
        </span>
      )
    case "archived":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
          <Archive className="w-3.5 h-3.5" />
          Archived
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
          {status}
        </span>
      )
  }
}
