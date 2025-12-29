import { useEffect } from 'react'

interface KeyboardShortcutsProps {
  onNewDocument: () => void
  onSave: () => void
  onClose: () => void
  onToggleSidebar: () => void
}

const KeyboardShortcuts = ({ onNewDocument, onSave, onClose, onToggleSidebar }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs or textareas
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl/Cmd + N: New Document
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        onNewDocument()
      }

      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSave()
      }

      // Ctrl/Cmd + W: Close Document
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault()
        onClose()
      }

      // Ctrl/Cmd + B: Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        onToggleSidebar()
      }

      // Escape: Close Document
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNewDocument, onSave, onClose, onToggleSidebar])

  return null
}

export default KeyboardShortcuts
