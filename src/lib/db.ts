import { supabaseAdmin } from './supabase-server'

export interface Document {
  id: string
  user_id: string
  title: string
  content: string | null
  parent_document_id: string | null
  is_archived: boolean
  is_published: boolean
  icon: string | null
  cover_image: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string | null
  email: string | null
  email_verified: string | null
  image: string | null
}

export async function getDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error fetching documents: ${error.message}`)
  }

  return data || []
}

export async function getDocument(id: string, userId: string): Promise<Document | null> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching document: ${error.message}`)
  }

  return data || null
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching document: ${error.message}`)
  }

  return data || null
}

export async function createDocument(
  userId: string,
  title: string,
  parentDocumentId?: string
): Promise<Document> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert({
      user_id: userId,
      title,
      parent_document_id: parentDocumentId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating document: ${error.message}`)
  }

  return data
}

export async function updateDocument(
  id: string,
  updates: Partial<Omit<Document, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Document> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating document: ${error.message}`)
  }

  return data
}

export async function archiveDocument(id: string, userId: string): Promise<Document> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .update({ is_archived: true })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Error archiving document: ${error.message}`)
  }

  return data
}

export async function getChildrenDocuments(parentId: string, userId: string): Promise<Document[]> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('parent_document_id', parentId)
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error fetching children documents: ${error.message}`)
  }

  return data || []
}
