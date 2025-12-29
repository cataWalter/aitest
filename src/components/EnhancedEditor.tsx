import { useState, useEffect } from 'react'
import { Plus, Heading1, Heading2, List, Code, Image, Table, GripVertical, Trash2, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface DocumentBlock {
  id: string
  type: string
  content: any
  position: number
}

interface EnhancedEditorProps {
  documentId: string
  blocks: DocumentBlock[]
  onBlocksChange: (blocks: DocumentBlock[]) => void
  className?: string
}

const EnhancedEditor = ({ documentId, blocks, onBlocksChange, className }: EnhancedEditorProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const addBlock = (type: string) => {
    const newBlock: DocumentBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'paragraph' ? 'New paragraph' : type === 'heading1' ? 'New Heading 1' : type === 'heading2' ? 'New Heading 2' : type === 'list' ? ['Item 1'] : type === 'code' ? 'console.log("Hello World");' : type === 'image' ? { url: '', alt: '' } : type === 'table' ? { rows: 2, cols: 2, data: [['', ''], ['', '']] } : '',
      position: blocks.length
    }
    onBlocksChange([...blocks, newBlock])
  }

  const updateBlock = (id: string, content: any) => {
    onBlocksChange(blocks.map(block => block.id === id ? { ...block, content } : block))
  }

  const deleteBlock = (id: string) => {
    onBlocksChange(blocks.filter(block => block.id !== id))
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id)
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks]
      ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
      onBlocksChange(newBlocks)
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks]
      ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
      onBlocksChange(newBlocks)
    }
  }

  const renderBlock = (block: DocumentBlock) => {
    switch (block.type) {
      case 'paragraph':
        return isEditing === block.id ? (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onBlur={() => setIsEditing(null)}
            className="w-full"
            autoFocus
          />
        ) : (
          <p 
            className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded"
            onClick={() => setIsEditing(block.id)}
          >
            {block.content}
          </p>
        )

      case 'heading1':
        return isEditing === block.id ? (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onBlur={() => setIsEditing(null)}
            className="text-2xl font-bold"
            autoFocus
          />
        ) : (
          <h1 
            className="text-2xl font-bold cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded"
            onClick={() => setIsEditing(block.id)}
          >
            {block.content}
          </h1>
        )

      case 'heading2':
        return isEditing === block.id ? (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onBlur={() => setIsEditing(null)}
            className="text-xl font-semibold"
            autoFocus
          />
        ) : (
          <h2 
            className="text-xl font-semibold cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded"
            onClick={() => setIsEditing(block.id)}
          >
            {block.content}
          </h2>
        )

      case 'list':
        return isEditing === block.id ? (
          <Textarea
            value={block.content.join('\n')}
            onChange={(e) => updateBlock(block.id, e.target.value.split('\n'))}
            onBlur={() => setIsEditing(null)}
            className="w-full"
            autoFocus
          />
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {block.content.map((item: string, index: number) => (
              <li key={index} className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-1 rounded">
                {item}
              </li>
            ))}
          </ul>
        )

      case 'code':
        return isEditing === block.id ? (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onBlur={() => setIsEditing(null)}
            className="font-mono bg-zinc-100 dark:bg-zinc-800 p-2 rounded"
            autoFocus
          />
        ) : (
          <pre 
            className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded font-mono cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
            onClick={() => setIsEditing(block.id)}
          >
            {block.content}
          </pre>
        )

      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Block Toolbar */}
      <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <Button variant="outline" size="sm" onClick={() => addBlock('paragraph')}>
          <Heading1 size={16} className="mr-2" />
          Paragraph
        </Button>
        <Button variant="outline" size="sm" onClick={() => addBlock('heading1')}>
          <Heading1 size={16} className="mr-2" />
          H1
        </Button>
        <Button variant="outline" size="sm" onClick={() => addBlock('heading2')}>
          <Heading2 size={16} className="mr-2" />
          H2
        </Button>
        <Button variant="outline" size="sm" onClick={() => addBlock('list')}>
          <List size={16} className="mr-2" />
          List
        </Button>
        <Button variant="outline" size="sm" onClick={() => addBlock('code')}>
          <Code size={16} className="mr-2" />
          Code
        </Button>
        <Button variant="outline" size="sm" onClick={() => addBlock('image')}>
          <Image size={16} className="mr-2" />
          Image
        </Button>
        <Button variant="outline" size="sm" onClick={() => addBlock('table')}>
          <Table size={16} className="mr-2" />
          Table
        </Button>
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <Card key={block.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-zinc-400 cursor-move" />
                  <Badge variant="secondary">{block.type}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveBlock(block.id, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveBlock(block.id, 'down')}
                    disabled={index === blocks.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(block.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBlock(block.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2">
                {renderBlock(block)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default EnhancedEditor
