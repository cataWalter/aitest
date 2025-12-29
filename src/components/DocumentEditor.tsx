import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useDocuments } from '@/lib/hooks/useDocuments'
import Editor from './Editor'
import { Document } from '@/lib/db'
import { 
  Save, 
  Share2, 
  Eye, 
  EyeOff, 
  Tag, 
  Calendar, 
  FileText, 
  MoreHorizontal 
} from 'lucide-react'

interface DocumentEditorProps {
  document?: Document
}

const DocumentEditor = ({ document }: DocumentEditorProps) => {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { updateDocument, archiveDocument } = useDocuments()
  
  const [title, setTitle] = useState(document?.title || 'Untitled')
  const [content, setContent] = useState(document?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublished, setIsPublished] = useState(document?.is_published || false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    if (document) {
      setTitle(document.title)
      setContent(document.content || '')
      setIsPublished(document.is_published)
    }
  }, [document])

  const handleSave = async () => {
    if (!user || !document) return
    
    setIsSaving(true)
    try {
      await updateDocument(document.id, {
        title,
        content,
        is_published: isPublished
      })
    } catch (error) {
      console.error('Error saving document:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchive = async () => {
    if (!user || !document) return
    
    try {
      await archiveDocument(document.id)
      router.push('/documents')
    } catch (error) {
      console.error('Error archiving document:', error)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/documents/${document?.id}`
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-black dark:text-white">Document Settings</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Document Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPublished(!isPublished)}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  isPublished 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                {isPublished ? 'Published' : 'Draft'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Calendar size={16} />
                Created: {document?.created_at ? new Date(document.created_at).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Calendar size={16} />
                Updated: {document?.updated_at ? new Date(document.updated_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleArchive}
                className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded w-full"
              >
                <FileText size={16} />
                Archive Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="flex items-center gap-4">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <MoreHorizontal size={20} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-black dark:text-white truncate max-w-md">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm ${
              isPublished 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}>
              {isPublished ? 'Published' : 'Draft'}
            </span>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-8 overflow-auto">
          <Editor
            content={content}
            onChange={setContent}
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentEditor
