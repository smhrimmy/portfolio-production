import { useState, useEffect } from "react"
import { useAuthStore } from "../../../stores/authStore"
import { Upload, Image as ImageIcon, File, Video, Trash2, Link as LinkIcon, RefreshCw } from "lucide-react"

export default function MediaLibrary() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { token } = useAuthStore()

  const fetchMedia = async () => {
    try {
      const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
      const res = await fetch(`${apiUrl}/api/admin/media`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setMedia(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append("file", e.target.files[0])
    
    try {
      const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
      const res = await fetch(`${apiUrl}/api/admin/media/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      })
      
      if (res.ok) {
        await fetchMedia()
      } else {
        const error = await res.json()
        alert(error.error?.message || "Upload failed")
      }
    } catch (err) {
      console.error(err)
      alert("Error uploading file")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return
    try {
      const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
      await fetch(`${apiUrl}/api/admin/media/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      fetchMedia()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    // alert("Link copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            Media Library
          </h1>
          <p className="text-neutral-400 mt-1">Manage assets, images, and documents centralized in Google Drive.</p>
        </div>
        <div>
          <label className="cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            {uploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploading ? "Uploading..." : "Upload File"}
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="w-8 h-8 text-fuchsia-500 animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-200">No media found</h3>
          <p className="text-neutral-500 mt-2 max-w-md">Upload images, PDFs, or videos to use across your portfolio. Files will be stored permanently in Google Drive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group">
              <div className="aspect-square bg-neutral-950 relative flex items-center justify-center">
                {item.mimeType.startsWith("image/") ? (
                  <img src={item.thumbnailUrl || item.providerUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : item.mimeType.startsWith("video/") ? (
                  <Video className="w-12 h-12 text-neutral-600" />
                ) : (
                  <File className="w-12 h-12 text-neutral-600" />
                )}
                
                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleCopyLink(item.providerUrl)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors" title="Copy Link">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-900/50 hover:bg-red-600 text-white rounded-full transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-neutral-200 truncate" title={item.name}>{item.name}</p>
                <div className="flex items-center justify-between mt-1 text-xs text-neutral-500">
                  <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
