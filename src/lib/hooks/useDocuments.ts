import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Document } from '../db'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setDocuments(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createDocument = async (title: string, parentDocumentId?: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title,
          parent_document_id: parentDocumentId,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setDocuments(prev => [data, ...prev])
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateDocument = async (id: string, updates: Partial<Omit<Document, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setDocuments(prev => prev.map(doc => doc.id === id ? data : doc))
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const archiveDocument = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update({ is_archived: true })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id))
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    archiveDocument,
    refetch: fetchDocuments,
  }
}
