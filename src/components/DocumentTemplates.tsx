import { useState } from 'react'
import { 
  FileText, 
  ClipboardList, 
  Calendar, 
  Target, 
  Brain, 
  Plus, 
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  content: string
}

const templates: Template[] = [
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Capture key points and action items from meetings',
    icon: <ClipboardList size={24} />,
    content: `<h1>Meeting Notes</h1>
<h2>Meeting Details</h2>
<ul>
  <li><strong>Date:</strong> [Insert Date]</li>
  <li><strong>Time:</strong> [Insert Time]</li>
  <li><strong>Location:</strong> [Insert Location]</li>
  <li><strong>Attendees:</strong> [List attendees]</li>
</ul>

<h2>Agenda</h2>
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>

<h2>Discussion Points</h2>
<ul>
  <li><strong>Topic 1:</strong> [Details]</li>
  <li><strong>Topic 2:</strong> [Details]</li>
  <li><strong>Topic 3:</strong> [Details]</li>
</ul>

<h2>Action Items</h2>
<ul>
  <li>[ ] Action item 1 - Owner: [Name] - Due: [Date]</li>
  <li>[ ] Action item 2 - Owner: [Name] - Due: [Date]</li>
  <li>[ ] Action item 3 - Owner: [Name] - Due: [Date]</li>
</ul>

<h2>Next Steps</h2>
<ul>
  <li>[Next step details]</li>
</ul>`
  },
  {
    id: 'project-plan',
    name: 'Project Plan',
    description: 'Outline project goals, timeline, and milestones',
    icon: <Target size={24} />,
    content: `<h1>Project Plan</h1>
<h2>Project Overview</h2>
<p><strong>Project Name:</strong> [Insert Project Name]</p>
<p><strong>Project Manager:</strong> [Insert Name]</p>
<p><strong>Start Date:</strong> [Insert Date]</p>
<p><strong>End Date:</strong> [Insert Date]</p>

<h2>Project Goals</h2>
<ul>
  <li>Goal 1: [Description]</li>
  <li>Goal 2: [Description]</li>
  <li>Goal 3: [Description]</li>
</ul>

<h2>Scope</h2>
<h3>In Scope:</h3>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<h3>Out of Scope:</h3>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<h2>Timeline</h2>
<table>
  <thead>
    <tr>
      <th>Milestone</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Phase 1</td>
      <td>[Date]</td>
      <td>[Date]</td>
      <td>In Progress</td>
    </tr>
    <tr>
      <td>Phase 2</td>
      <td>[Date]</td>
      <td>[Date]</td>
      <td>Not Started</td>
    </tr>
  </tbody>
</table>

<h2>Risks & Mitigation</h2>
<ul>
  <li><strong>Risk:</strong> [Description] - <strong>Mitigation:</strong> [Plan]</li>
</ul>`
  },
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    description: 'Reflect on your day and track personal growth',
    icon: <Calendar size={24} />,
    content: `<h1>Daily Journal</h1>
<h2>Date: [Insert Date]</h2>

<h2>Today's Highlights</h2>
<ul>
  <li>Highlight 1</li>
  <li>Highlight 2</li>
  <li>Highlight 3</li>
</ul>

<h2>Challenges Faced</h2>
<ul>
  <li>Challenge 1 and how I handled it</li>
  <li>Challenge 2 and what I learned</li>
</ul>

<h2>Gratitude</h2>
<ul>
  <li>I'm grateful for...</li>
  <li>Today I appreciated...</li>
</ul>

<h2>Goals for Tomorrow</h2>
<ul>
  <li>Goal 1</li>
  <li>Goal 2</li>
  <li>Goal 3</li>
</ul>

<h2>Reflection</h2>
<p>[Write your thoughts, feelings, and insights from the day]</p>`
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm Session',
    description: 'Capture ideas and organize creative thoughts',
    icon: <Brain size={24} />,
    content: `<h1>Brainstorm Session</h1>
<h2>Topic: [Insert Topic]</h2>
<h2>Date: [Insert Date]</h2>

<h2>Ideas Generated</h2>
<ul>
  <li><strong>Idea 1:</strong> [Description]</li>
  <li><strong>Idea 2:</strong> [Description]</li>
  <li><strong>Idea 3:</strong> [Description]</li>
</ul>

<h2>Categorization</h2>
<h3>High Priority:</h3>
<ul>
  <li>Idea with high impact</li>
</ul>

<h3>Medium Priority:</h3>
<ul>
  <li>Idea with medium impact</li>
</ul>

<h3>Low Priority:</h3>
<ul>
  <li>Idea for future consideration</li>
</ul>

<h2>Next Steps</h2>
<ul>
  <li>Research idea 1 further</li>
  <li>Discuss idea 2 with team</li>
  <li>Prototype idea 3</li>
</ul>`
  },
  {
    id: 'task-list',
    name: 'Task List',
    description: 'Organize and track your to-dos efficiently',
    icon: <CheckCircle size={24} />,
    content: `<h1>Task List</h1>
<h2>Date: [Insert Date]</h2>

<h2>Today's Tasks</h2>
<ul>
  <li>[ ] Task 1 - Priority: High</li>
  <li>[ ] Task 2 - Priority: Medium</li>
  <li>[ ] Task 3 - Priority: Low</li>
</ul>

<h2>Project Tasks</h2>
<h3>Project: [Project Name]</h3>
<ul>
  <li>[ ] [Task description] - Due: [Date]</li>
  <li>[ ] [Task description] - Due: [Date]</li>
</ul>

<h2>Completed Tasks</h2>
<ul>
  <li>✓ [Completed task] - [Completion date]</li>
</ul>

<h2>Notes</h2>
<ul>
  <li>[Additional notes or reminders]</li>
</ul>`
  },
  {
    id: 'meeting-agenda',
    name: 'Meeting Agenda',
    description: 'Plan structured meetings with clear objectives',
    icon: <Clock size={24} />,
    content: `<h1>Meeting Agenda</h1>
<h2>Meeting: [Meeting Name]</h2>
<h2>Date: [Insert Date]</h2>
<h2>Time: [Insert Time]</h2>
<h2>Location: [Insert Location]</h2>

<h2>Objective</h2>
<p>[Clear statement of what this meeting aims to achieve]</p>

<h2>Agenda Items</h2>
<ol>
  <li>
    <strong>Opening & Check-in (5 min)</strong>
    <ul>
      <li>Welcome and attendance</li>
      <li>Quick round of updates</li>
    </ul>
  </li>
  <li>
    <strong>Topic 1: [Title] (15 min)</strong>
    <ul>
      <li>Presentation</li>
      <li>Discussion</li>
      <li>Decision needed</li>
    </ul>
  </li>
  <li>
    <strong>Topic 2: [Title] (20 min)</strong>
    <ul>
      <li>Presentation</li>
      <li>Group discussion</li>
      <li>Action items</li>
    </ul>
  </li>
  <li>
    <strong>Topic 3: [Title] (15 min)</strong>
    <ul>
      <li>Updates</li>
      <li>Questions</li>
    </ul>
  </li>
  <li>
    <strong>Wrap-up & Next Steps (5 min)</strong>
    <ul>
      <li>Summary of decisions</li>
      <li>Next meeting date</li>
      <li>Follow-up actions</li>
    </ul>
  </li>
</ol>

<h2>Preparation Required</h2>
<ul>
  <li>Review document A</li>
  <li>Prepare questions for topic 2</li>
  <li>Bring project updates</li>
</ul>

<h2>Materials Needed</h2>
<ul>
  <li>Projector</li>
  <li>Notebooks</li>
  <li>Agenda copies</li>
</ul>`
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Coordinate team efforts and share updates',
    icon: <Users size={24} />,
    content: `<h1>Team Collaboration</h1>
<h2>Team: [Team Name]</h2>
<h2>Project: [Project Name]</h2>
<h2>Last Updated: [Date]</h2>

<h2>Team Members</h2>
<ul>
  <li><strong>John Doe:</strong> Frontend Developer</li>
  <li><strong>Jane Smith:</strong> Backend Developer</li>
  <li><strong>Bob Johnson:</strong> Designer</li>
</ul>

<h2>Current Status</h2>
<p><strong>Overall Progress:</strong> [Percentage]% Complete</p>

<h2>Active Tasks</h2>
<table>
  <thead>
    <tr>
      <th>Task</th>
      <th>Owner</th>
      <th>Due Date</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Frontend Implementation</td>
      <td>John Doe</td>
      <td>2024-01-15</td>
      <td>In Progress</td>
    </tr>
    <tr>
      <td>API Development</td>
      <td>Jane Smith</td>
      <td>2024-01-20</td>
      <td>Not Started</td>
    </tr>
  </tbody>
</table>

<h2>Recent Updates</h2>
<ul>
  <li><strong>Jan 10:</strong> Design mockups completed</li>
  <li><strong>Jan 8:</strong> Project kickoff meeting held</li>
</ul>

<h2>Blockers</h2>
<ul>
  <li>Waiting for client feedback on design</li>
  <li>API documentation still in progress</li>
</ul>

<h2>Communication</h2>
<ul>
  <li>Slack channel: #project-name</li>
  <li>Weekly standup: Mondays 9 AM</li>
  <li>Project board: [Link to project management tool]</li>
</ul>`
  }
]

interface DocumentTemplatesProps {
  onUseTemplate: (template: Template) => void
  onClose: () => void
}

const DocumentTemplates = ({ onUseTemplate, onClose }: DocumentTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Document Templates</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">Choose a template to get started quickly</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-black dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-zinc-500 dark:text-zinc-400 mb-4">
                <FileText size={48} className="mx-auto" />
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">No templates found</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => onUseTemplate(template)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                      {template.icon}
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-black dark:text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Ready to use</span>
                    <span>{template.content.split('\n').length} lines</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>Tip: Templates are fully customizable after creation</span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentTemplates
