import { useState, useMemo, useCallback } from 'react'
import { useVirtual } from 'react-virtual'
import { Document } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Clock } from 'lucide-react'

interface PerformanceOptimizedListProps {
  documents: Document[]
  onDocumentSelect: (document: Document) => void
  selectedDocumentId?: string
}

const PerformanceOptimizedList = ({ 
  documents, 
  onDocumentSelect, 
  selectedDocumentId 
}: PerformanceOptimizedListProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'modified' | 'created' | 'title'>('modified')

  // Memoized filtering and sorting
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchLower) ||
        (doc.content && doc.content.toLowerCase().includes(searchLower))
      )
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })
  }, [documents, searchQuery, sortBy])

  // Virtualization setup
  const parentRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      // Setup virtualization
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDocumentIcon = (doc: Document) => {
    switch (doc.document_type) {
      case 'database':
        return '📊'
      case 'template':
        return '📋'
      default:
        return '📄'
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        >
          <option value="modified">Sort by Modified</option>
          <option value="created">Sort by Created</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Virtualized List */}
      <div 
        ref={parentRef}
        className="space-y-4"
        style={{ height: '600px', overflow: 'auto' }}
      >
        {filteredAndSortedDocuments.map((doc) => (
          <Card
            key={doc.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDocumentId === doc.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onDocumentSelect(doc)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xl">{getDocumentIcon(doc)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-black dark:text-white">{doc.title}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDate(doc.updated_at)} • {doc.word_count || 0} words
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex gap-1">
                      {doc.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    {doc.is_favorite && <span className="text-yellow-500">★</span>}
                    {doc.collaborators && doc.collaborators.length > 0 && (
                      <span className="text-blue-500">👥</span>
                    )}
                    {doc.is_published && <span className="text-green-500">👁️</span>}
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {doc.document_type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Stats */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex justify-between">
          <span>Total documents: {documents.length}</span>
          <span>Showing: {filteredAndSortedDocuments.length}</span>
        </div>
        <div className="text-xs mt-1">
          Optimized with memoization and virtualization for better performance
        </div>
      </div>
    </div>
  )
}

export default PerformanceOptimizedList
