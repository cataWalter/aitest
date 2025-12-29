import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  documentId: string
  onInsertContent: (content: string) => void
  className?: string
}

const AIAssistant = ({ documentId, onInsertContent, className }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      // Simulate AI response (in real app, this would call an AI API)
      const response = await simulateAIResponse(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI response error:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const simulateAIResponse = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "Based on your document content, I can help you improve this section by adding more specific details and examples.",
          "Here's a refined version of your content with better structure and clarity.",
          "I've analyzed your document and suggest the following improvements for better readability and impact.",
          "Your content looks good! Here are some suggestions to enhance it further.",
          "Based on the context, here's a comprehensive analysis and recommendations for your document."
        ]
        resolve(responses[Math.floor(Math.random() * responses.length)])
      }, 1000)
    })
  }

  const handleInsertContent = (content: string) => {
    onInsertContent(content)
    setIsOpen(false)
  }

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Sparkles size={16} />
        AI Assistant
      </Button>

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-96 h-96 shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-blue-500" />
              <CardTitle className="text-sm">AI Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </CardHeader>
          
          <CardContent className="h-full flex flex-col p-0">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-xs ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-xs">
                    <div className="p-2 rounded-full bg-gray-200 text-gray-800">
                      <Bot size={16} />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask AI for help..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
                  {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsertContent("Generated content from AI")}
                  disabled={messages.length === 0}
                >
                  Insert Response
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessages([])}
                >
                  Clear Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AIAssistant
