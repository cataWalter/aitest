import { useState, useEffect } from 'react'
import { useDocuments } from '@/lib/hooks/useDocuments'
import { useAuth } from '@/lib/hooks/useAuth'
import { Document } from '@/lib/db'
import { 
  Search, Filter, Plus, Folder, Calendar, Clock, Star, 
  Users, Share2, MoreHorizontal, Trash2, Edit, Eye
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface EnhancedDocumentListProps {
  onDocumentSelect: (document: Document) => void
  selectedDocumentId?: string
}

type ViewMode = 'grid' | 'list'
type SortOption = 'modified' | 'created' | 'title' | 'type'
type FilterOption = 'all' | 'favorites' | 'shared' | 'archived' | 'templates'

const EnhancedDocumentList = ({ 
  onDocumentSelect, 
  selectedDocumentId 
}: EnhancedDocumentListProps) => {
  const { user } = useAuth()
  const { documents, loading } = useDocuments()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortOption, setSortOption] = useState<SortOption>('modified')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        return (
          doc.title.toLowerCase().includes(searchLower) ||
          (doc.content && doc.content.toLowerCase().includes(searchLower))
        )
      }
      return true
    })
    .filter(doc => {
      // Type filter
      switch (filterOption) {
        case 'favorites':
          return doc.is_favorite
        case 'shared':
          return doc.collaborators && doc.collaborators.length > 0
        case 'archived':
          return doc.is_archived
        case 'templates':
          return doc.document_type === 'template'
        default:
          return !doc.is_archived
      }
    })
    .filter(doc => {
      // Tag filter
      if (selectedTags.length > 0 && doc.tags) {
        return selectedTags.some(tag => doc.tags?.includes(tag))
      }
      return true
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'type':
          return (a.document_type || '').localeCompare(b.document_type || '')
        default: // modified
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

  // Extract unique tags for filtering
  const allTags = Array.from(
    new Set(documents.flatMap(doc => doc.tags || []))
  )

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">My Documents</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 mr-2">Tags:</span>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-zinc-400 mb-4">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </div>
            {!searchQuery && (
              <Button onClick={() => {}}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first document
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map(doc => (
              <Card
                key={doc.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedDocumentId === doc.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onDocumentSelect(doc)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getDocumentIcon(doc)}</span>
                      <CardTitle className="text-sm truncate">{doc.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      {doc.is_favorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      {doc.collaborators && doc.collaborators.length > 0 && (
                        <Users className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-3 w-3" />
                    <span>Modified {formatDate(doc.updated_at)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    <span>{doc.word_count || 0} words</span>
                    <Badge variant="outline">{doc.document_type}</Badge>
                  </div>
                  
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {doc.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{doc.collaborators?.length || 0} collaborators</span>
                    {doc.is_published && <Eye className="h-3 w-3 text-green-500" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map(doc => (
              <Card
                key={doc.id}
                className={`cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
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
                        {doc.is_favorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        {doc.collaborators && doc.collaborators.length > 0 && (
                          <Users className="h-4 w-4 text-blue-500" />
                        )}
                        {doc.is_published && <Eye className="h-4 w-4 text-green-500" />}
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
        )}
      </ScrollArea>
    </div>
  )
}

export default EnhancedDocumentList
