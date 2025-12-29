# Notion Clone

A full-stack Notion clone built with Next.js 15, React 19, Prisma, PostgreSQL, and Tailwind CSS. This application mimics core Notion functionalities, including document creation, nested pages, real-time editing, and more.

## 🚀 Features

- **Real-time Editor**: Powered by BlockNote for a seamless writing experience.
- **Nested Documents**: Organize your notes with infinite nesting capabilities.
- **Authentication**: Secure login and session management using NextAuth.js.
- **File Management**: Upload and manage cover images and icons using EdgeStore.
- **Trash & Archiving**: Move documents to trash and restore or permanently delete them.
- **Publishing**: Make your documents public and shareable.
- **Responsive Design**: Fully functional on desktop and mobile devices.
- **Dark Mode Support**: Aesthetic UI with dark and light mode options.
- **Sidebar Customization**: Collapsible and resizable sidebar for a personalized workspace.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Rich Text Editor**: [BlockNote](https://www.blocknotejs.org/)
- **File Uploads**: [EdgeStore](https://edgestore.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- EdgeStore account (for file uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/notion-clone.git
   cd notion-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/notion_clone"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # NextAuth Providers (e.g., GitHub)
   GITHUB_ID="your-github-id"
   GITHUB_SECRET="your-github-secret"

   # EdgeStore
   EDGE_STORE_ACCESS_KEY="your-access-key"
   EDGE_STORE_SECRET_KEY="your-secret-key"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

- `src/app`: Next.js App Router and API routes.
- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks for state and UI management.
- `src/lib`: Utility functions and shared libraries.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
