-- Enhanced Supabase Schema for Notion-like Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT DEFAULT 'Untitled',
    content TEXT,
    parent_document_id UUID,
    is_archived BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    icon TEXT,
    cover_image TEXT,
    document_type TEXT DEFAULT 'document',
    is_favorite BOOLEAN DEFAULT FALSE,
    word_count INTEGER DEFAULT 0,
    tags TEXT[],
    collaborators UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_blocks table for rich content
CREATE TABLE document_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    block_type TEXT NOT NULL,
    content JSONB,
    position INTEGER NOT NULL,
    parent_block_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create databases table for Notion-style databases
CREATE TABLE databases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    icon TEXT,
    view_type TEXT DEFAULT 'table',
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create database_entries table for database records
CREATE TABLE database_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    database_id UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table for collaboration
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    position INTEGER,
    resolved BOOLEAN DEFAULT FALSE,
    parent_comment_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content JSONB,
    category TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_prompts table for AI features
CREATE TABLE ai_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    theme TEXT DEFAULT 'system',
    editor_mode TEXT DEFAULT 'rich',
    default_view TEXT DEFAULT 'grid',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_parent_document_id ON documents(parent_document_id);
CREATE INDEX idx_documents_is_archived ON documents(is_archived);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_document_blocks_document_id ON document_blocks(document_id);
CREATE INDEX idx_document_blocks_position ON document_blocks(position);
CREATE INDEX idx_databases_user_id ON databases(user_id);
CREATE INDEX idx_database_entries_database_id ON database_entries(database_id);
CREATE INDEX idx_comments_document_id ON comments(document_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_ai_prompts_user_id ON ai_prompts(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_blocks_updated_at 
    BEFORE UPDATE ON document_blocks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_databases_updated_at 
    BEFORE UPDATE ON databases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_database_entries_updated_at 
    BEFORE UPDATE ON database_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for document_blocks
CREATE POLICY "Users can view document blocks" ON document_blocks
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM documents WHERE documents.id = document_blocks.document_id AND documents.user_id = auth.uid()));

CREATE POLICY "Users can insert document blocks" ON document_blocks
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM documents WHERE documents.id = document_blocks.document_id AND documents.user_id = auth.uid()));

CREATE POLICY "Users can update document blocks" ON document_blocks
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM documents WHERE documents.id = document_blocks.document_id AND documents.user_id = auth.uid()));

CREATE POLICY "Users can delete document blocks" ON document_blocks
    FOR DELETE
    USING (EXISTS (SELECT 1 FROM documents WHERE documents.id = document_blocks.document_id AND documents.user_id = auth.uid()));

-- Create RLS policies for databases
CREATE POLICY "Users can view their own databases" ON databases
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own databases" ON databases
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own databases" ON databases
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own databases" ON databases
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for database_entries
CREATE POLICY "Users can view database entries" ON database_entries
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM databases WHERE databases.id = database_entries.database_id AND databases.user_id = auth.uid()));

CREATE POLICY "Users can insert database entries" ON database_entries
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM databases WHERE databases.id = database_entries.database_id AND databases.user_id = auth.uid()));

CREATE POLICY "Users can update database entries" ON database_entries
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM databases WHERE databases.id = database_entries.database_id AND databases.user_id = auth.uid()));

CREATE POLICY "Users can delete database entries" ON database_entries
    FOR DELETE
    USING (EXISTS (SELECT 1 FROM databases WHERE databases.id = database_entries.database_id AND databases.user_id = auth.uid()));

-- Create RLS policies for comments
CREATE POLICY "Users can view comments on their documents" ON comments
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM documents WHERE documents.id = comments.document_id AND documents.user_id = auth.uid()));

CREATE POLICY "Users can insert comments on their documents" ON comments
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM documents WHERE documents.id = comments.document_id AND documents.user_id = auth.uid()));

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for templates
CREATE POLICY "Users can view their own templates" ON templates
    FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own templates" ON templates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON templates
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON templates
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for ai_prompts
CREATE POLICY "Users can view their own AI prompts" ON ai_prompts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI prompts" ON ai_prompts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI prompts" ON ai_prompts
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI prompts" ON ai_prompts
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS
