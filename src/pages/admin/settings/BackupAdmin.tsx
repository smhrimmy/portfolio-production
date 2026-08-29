import { useState } from "react"
import { Download, Upload, Database, AlertTriangle } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"
import { toast } from "react-hot-toast"

export default function BackupAdmin() {
  const { token } = useAuthStore()
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const response = await fetch(`${apiUrl}/api/admin/backup/export`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) throw new Error("Export failed")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `portfolio-os-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success("Backup downloaded successfully!")
    } catch (err) {
      toast.error("Failed to download backup")
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/backup/import`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      if (res.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.error?.message || "Import failed")
      }
    } catch (err) {
      toast.error("Invalid backup file")
    } finally {
      setIsImporting(false)
      e.target.value = "" // Reset input
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-400" /> Backup & Restore
        </h1>
        <p className="text-neutral-400 mt-1">Export your entire database to a local JSON file or validate an import.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
            <Download className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-200 mb-2">Export Data</h2>
          <p className="text-neutral-400 text-sm mb-6 flex-1">
            Download a full JSON snapshot of your entire database, including articles, projects, and settings.
          </p>
          <button 
            onClick={handleExport}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Download Backup
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-200 mb-2">Import Data</h2>
          <p className="text-neutral-400 text-sm mb-6 flex-1">
            Validate a JSON backup file. (Note: Full automated restore is disabled in this UI to prevent accidental data overwrites).
          </p>
          
          <div className="relative w-full">
            <input 
              type="file" 
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button 
              disabled={isImporting}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isImporting ? (
                <span className="animate-pulse">Validating...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Select Backup File
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
        <div className="text-sm text-amber-200/80">
          <p className="font-medium text-amber-400 mb-1">Important Note</p>
          Your JSON backup does NOT include media files (images/videos) stored in Google Drive. It only backs up the database records (including the Drive file IDs). To fully migrate your site, ensure you also retain access to your connected Google Drive folder.
        </div>
      </div>
    </div>
  )
}
