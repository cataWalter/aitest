import { useState, useEffect } from 'react'
import { Plus, Table, Kanban, Calendar, List, Edit, Trash2, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DatabaseProperty {
  id: string
  name: string
  type: 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'checkbox' | 'url'
  options?: string[]
}

interface DatabaseEntry {
  id: string
  properties: Record<string, any>
}

interface DatabaseViewProps {
  databaseId: string
  title: string
  properties: DatabaseProperty[]
  entries: DatabaseEntry[]
  onAddEntry: () => void
  onEditEntry: (entryId: string) => void
  onDeleteEntry: (entryId: string) => void
  className?: string
}

const DatabaseView = ({ 
  databaseId, 
  title, 
  properties, 
  entries, 
  onAddEntry, 
  onEditEntry, 
  onDeleteEntry, 
  className 
}: DatabaseViewProps) => {
  const [viewType, setViewType] = useState<'table' | 'kanban' | 'calendar' | 'list'>('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})

  const filteredEntries = entries.filter(entry => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      return Object.values(entry.properties).some(value =>
        String(value).toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border border-zinc-200 dark:border-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-800">
          <tr>
            {properties.map(property => (
              <th key={property.id} className="px-4 py-2 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {property.name}
              </th>
            ))}
            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-zinc-200 dark:divide-zinc-800">
          {filteredEntries.map(entry => (
            <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
              {properties.map(property => (
                <td key={property.id} className="px-4 py-3">
                  {renderPropertyValue(entry.properties[property.id], property.type)}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditEntry(entry.id)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteEntry(entry.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderKanban = () => {
    const statusProperty = properties.find(p => p.type === 'select')
    if (!statusProperty) return renderTable()

    const columns = statusProperty.options || []
    
    return (
      <div className="flex gap-4 overflow-x-auto">
        {columns.map(column => (
          <div key={column} className="flex-1 min-w-80">
            <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium text-black dark:text-white">{column}</h3>
              <Badge variant="secondary">{filteredEntries.filter(e => e.properties[statusProperty.id] === column).length}</Badge>
            </div>
            <div className="p-3 space-y-3">
              {filteredEntries
                .filter(e => e.properties[statusProperty.id] === column)
                .map(entry => (
                  <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          {properties.slice(0, 2).map(property => (
                            <div key={property.id} className="text-sm">
                              <span className="text-zinc-600 dark:text-zinc-400">{property.name}:</span>
                              <span className="ml-2 text-black dark:text-white">
                                {renderPropertyValue(entry.properties[property.id], property.type)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => onEditEntry(entry.id)}>
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDeleteEntry(entry.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderList = () => (
    <div className="space-y-3">
      {filteredEntries.map(entry => (
        <Card key={entry.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-2 gap-4 flex-1">
                {properties.slice(0, 4).map(property => (
                  <div key={property.id} className="text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">{property.name}:</span>
                    <span className="ml-2 text-black dark:text-white font-medium">
                      {renderPropertyValue(entry.properties[property.id], property.type)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEditEntry(entry.id)}>
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteEntry(entry.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderPropertyValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '-'
    
    switch (type) {
      case 'select':
      case 'multi_select':
        return Array.isArray(value) 
          ? value.map(v => <Badge key={v} variant="secondary" className="mr-1">{v}</Badge>)
          : <Badge variant="secondary">{value}</Badge>
      case 'checkbox':
        return value ? '✓' : '✗'
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-'
      default:
        return String(value)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('table')}
          >
            <Table size={16} className="mr-2" />
            Table
          </Button>
          <Button
            variant={viewType === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('kanban')}
          >
            <Kanban size={16} className="mr-2" />
            Kanban
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('list')}
          >
            <List size={16} className="mr-2" />
            List
          </Button>
          <Button variant="outline" size="sm" onClick={onAddEntry}>
            <PlusCircle size={16} className="mr-2" />
            Add Entry
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewType === 'table' && renderTable()}
        {viewType === 'kanban' && renderKanban()}
        {viewType === 'list' && renderList()}
      </CardContent>
    </Card>
  )
}

export default DatabaseView
