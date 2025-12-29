import { useState } from 'react'
import { useDocuments } from '@/lib/hooks/useDocuments'
import { useAuth } from '@/lib/hooks/useAuth'
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Clock, 
  Calendar, 
  Tag,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface DocumentListProps {
  onDocumentSelect: (document: any) => void
  selectedDocumentId?: string
}

const DocumentList = ({ onDocumentSelect, selectedDocumentId }: DocumentListProps) => {
  const { documents, loading, createDocument } = useDocuments()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'title'>('updated')
  const [showFilters, setShowFilters] = useState(false)

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filter === 'all' || 
        (filter === 'published' && doc.is_published) ||
        (filter === 'draft' && !doc.is_published) ||
        (filter === 'archived' && doc.is_archived)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

  const handleCreateDocument = async () => {
    if (!user) return
    await createDocument('Untitled Document')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black w-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">Documents</h2>
          <button
            onClick={handleCreateDocument}
            className="p-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-zinc-800 dark:hover:bg-zinc-200"
            title="New Document"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Filters</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
          >
            <Filter size={18} />
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3">
            <div className="flex gap-2">
              {['all', 'published', 'draft'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-3 py-1 rounded text-sm ${
                    filter === filterOption
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {['updated', 'created', 'title'].map((sortOption) => (
                <button
                  key={sortOption}
                  onClick={() => setSortBy(sortOption as any)}
                  className={`px-3 py-1 rounded text-sm ${
                    sortBy === sortOption
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  Sort by {sortOption}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 text-center text-zinc-600 dark:text-zinc-400">Loading...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-4 text-center text-zinc-600 dark:text-zinc-400">
            No documents found
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer ${
                  selectedDocumentId === doc.id ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                }`}
                onClick={() => onDocumentSelect(doc)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                      <h3 className="font-medium text-black dark:text-white truncate">{doc.title}</h3>
                      {doc.is_published && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                          Published
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Updated {formatDate(doc.updated_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDocumentSelect(doc)
                      }}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Edit functionality
                      }}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Archive functionality
                      }}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                      title="Archive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentList
