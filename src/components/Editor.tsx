import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code, Undo, Redo } from 'lucide-react'
import { useState } from 'react'

interface EditorProps {
  content?: string
  onChange?: (content: string) => void
  className?: string
}

const Editor = ({ content, onChange, className }: EditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const addHeading = (level: 1 | 2) => {
    editor?.chain().focus().toggleHeading({ level }).run()
  }

  const addList = () => {
    editor?.chain().focus().toggleBulletList().run()
  }

  const addOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run()
  }

  const addCode = () => {
    editor?.chain().focus().toggleCodeBlock().run()
  }

  return (
    <div className={`border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${editor?.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${editor?.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

        <button
          onClick={() => addHeading(1)}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${editor?.isActive('heading', { level: 1 }) ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>

        <button
          onClick={() => addHeading(2)}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${editor?.isActive('heading', { level: 2 }) ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

        <button
          onClick={addList}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${editor?.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          onClick={addOrderedList}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${editor?.isActive('orderedList') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>

        <button
          onClick={addCode}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${editor?.isActive('codeBlock') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          title="Code Block"
        >
          <Code size={18} />
        </button>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

        <button
          onClick={() => editor?.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
          title="Undo"
          disabled={!editor?.can().undo()}
        >
          <Undo size={18} />
        </button>

        <button
          onClick={() => editor?.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
          title="Redo"
          disabled={!editor?.can().redo()}
        >
          <Redo size={18} />
        </button>

        <div className="flex-1" />

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isFullscreen ? (
              <>
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </>
            ) : (
              <>
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Editor Content */}
      <div className={`min-h-[300px] ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-black p-8 overflow-auto' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor
