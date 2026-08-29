import { FolderOpen } from "lucide-react"

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionText, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-900/30">
      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-medium text-neutral-200 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
