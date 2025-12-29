import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useDocuments } from "@/lib/hooks/useDocuments"
import { Plus, FileText, Database, Sparkles, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EnhancedDocumentList from "@/components/EnhancedDocumentList"
import DatabaseView from "@/components/DatabaseView"
import AIAssistant from "@/components/AIAssistant"
import { Document } from "@/lib/db"

export default function Home() {
  const { user, loading: authLoading, signIn } = useAuth()
  const { documents, loading: docsLoading } = useDocuments()
  const [activeTab, setActiveTab] = useState("documents")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const handleCreateDocument = async () => {
    if (!user) return
    // Implementation would go here
  }

  const mockDatabaseProperties = [
    {
      id: "title",
      name: "Title",
      type: "text" as const
    },
    {
      id: "status",
      name: "Status",
      type: "select" as const,
      options: ["To Do", "In Progress", "Done"]
    },
    {
      id: "priority",
      name: "Priority",
      type: "select" as const,
      options: ["High", "Medium", "Low"]
    },
    {
      id: "due_date",
      name: "Due Date",
      type: "date" as const
    }
  ]

  const mockDatabaseEntries = [
    {
      id: "1",
      properties: {
        title: "Project Planning",
        status: "In Progress",
        priority: "High",
        due_date: "2024-01-15"
      }
    },
    {
      id: "2",
      properties: {
        title: "Design Review",
        status: "To Do",
        priority: "Medium",
        due_date: "2024-01-20"
      }
    }
  ]

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Enhanced Notes</CardTitle>
            <CardDescription>
              Sign in to access your documents, databases, and AI-powered features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <FileText size={32} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-medium">Rich Documents</p>
                <p className="text-xs text-zinc-500">Create and organize documents</p>
              </div>
              <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <Database size={32} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-medium">Smart Databases</p>
                <p className="text-xs text-zinc-500">Organize data with views</p>
              </div>
              <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <Sparkles size={32} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-medium">AI Assistant</p>
                <p className="text-xs text-zinc-500">Get help writing and editing</p>
              </div>
              <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <Users size={32} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-medium">Collaboration</p>
                <p className="text-xs text-zinc-500">Work together in real-time</p>
              </div>
            </div>
            <Button onClick={signIn} className="w-full">
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      <div className="w-96 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Workspace</h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCreateDocument}
            >
              <Plus size={18} className="mr-2" />
              New Document
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Database size={18} className="mr-2" />
              New Database
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Sparkles size={18} className="mr-2" />
              AI Templates
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <EnhancedDocumentList
            onDocumentSelect={setSelectedDocument}
            selectedDocumentId={selectedDocument?.id}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {selectedDocument ? selectedDocument.title : "Enhanced Notes"}
            </h1>
            {selectedDocument && (
              <span className={`px-2 py-1 rounded text-sm ${
                selectedDocument.is_published 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}>
                {selectedDocument.is_published ? 'Published' : 'Draft'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <AIAssistant
              documentId={selectedDocument?.id || ""}
              onInsertContent={(content) => {
                // Handle AI content insertion
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDocument(null)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("databases")}
            >
              <Database size={18} className="mr-2" />
              Databases
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Settings size={18} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {selectedDocument ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
                    {selectedDocument.title}
                  </h1>
                  <div className="prose prose-lg max-w-none">
                    {selectedDocument.content ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedDocument.content }} />
                    ) : (
                      <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
                        This document is empty. Start writing to add content.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="databases">Databases</TabsTrigger>
                <TabsTrigger value="ai">AI Features</TabsTrigger>
              </TabsList>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Documents</CardTitle>
                    <CardDescription>
                      Create, organize, and collaborate on documents with rich formatting and AI assistance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <FileText size={48} className="text-blue-500 mb-4" />
                          <h3 className="font-semibold mb-2">Rich Documents</h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Create documents with headings, lists, tables, and more.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <Database size={48} className="text-green-500 mb-4" />
                          <h3 className="font-semibold mb-2">Smart Databases</h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Organize data with table, kanban, and list views.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <Sparkles size={48} className="text-purple-500 mb-4" />
                          <h3 className="font-semibold mb-2">AI Assistant</h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Get help writing, editing, and generating content.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="databases">
                <DatabaseView
                  databaseId="project-tracker"
                  title="Project Tracker"
                  properties={mockDatabaseProperties}
                  entries={mockDatabaseEntries}
                  onAddEntry={() => {}}
                  onEditEntry={() => {}}
                  onDeleteEntry={() => {}}
                />
              </TabsContent>

              <TabsContent value="ai">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Features</CardTitle>
                    <CardDescription>
                      Leverage AI to enhance your productivity and creativity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <Sparkles size={32} className="text-purple-500 mb-4" />
                          <h3 className="font-semibold mb-2">AI Assistant</h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            Chat with AI to get help writing, editing, and brainstorming.
                          </p>
                          <Button variant="outline">Open AI Assistant</Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <Users size={32} className="text-blue-500 mb-4" />
                          <h3 className="font-semibold mb-2">Smart Templates</h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            Generate documents from AI-powered templates.
                          </p>
                          <Button variant="outline">Browse Templates</Button>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">AI Writing Tools</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded">
                            <h4 className="font-medium mb-2">Summarize</h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Generate concise summaries of your documents.
                            </p>
                          </div>
                          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded">
                            <h4 className="font-medium mb-2">Expand</h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Elaborate on ideas and add more detail.
                            </p>
                          </div>
                          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded">
                            <h4 className="font-medium mb-2">Rewrite</h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Improve clarity and style of your writing.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
