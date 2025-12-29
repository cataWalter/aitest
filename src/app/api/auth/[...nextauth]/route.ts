import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase-server"

// Custom adapter for Supabase
const SupabaseAdapter = {
  async createUser(profile: any) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: profile.name,
        email: profile.email,
        image: profile.image,
        email_verified: profile.email_verified,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating user: ${error.message}`)
    }

    return data
  },

  async getUser(id: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching user: ${error.message}`)
    }

    return data || null
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching user by email: ${error.message}`)
    }

    return data || null
  },

  async getUserByAccount(providerAccountId: any) {
    const { data, error } = await supabaseAdmin
      .from('accounts')
      .select('users (*)')
      .eq('provider_account_id', providerAccountId.providerAccountId)
      .eq('provider', providerAccountId.provider)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching user by account: ${error.message}`)
    }

    return data?.users || null
  },

  async updateUser(user: any) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        name: user.name,
        email: user.email,
        image: user.image,
        email_verified: user.email_verified,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error updating user: ${error.message}`)
    }

    return data
  },

  async deleteUser(userId: string) {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`)
    }
  },

  async linkAccount(data: any) {
    const { data: accountData, error } = await supabaseAdmin
      .from('accounts')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Error linking account: ${error.message}`)
    }

    return accountData
  },

  async unlinkAccount(providerAccountId: string, provider: string) {
    const { error } = await supabaseAdmin
      .from('accounts')
      .delete()
      .eq('provider_account_id', providerAccountId)
      .eq('provider', provider)

    if (error) {
      throw new Error(`Error unlinking account: ${error.message}`)
    }
  },

  async createSession(data: any) {
    const { data: sessionData, error } = await supabaseAdmin
      .from('sessions')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating session: ${error.message}`)
    }

    return sessionData
  },

  async getSessionAndUser(sessionToken: string) {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select('*, users (*)')
      .eq('session_token', sessionToken)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching session and user: ${error.message}`)
    }

    return data || null
  },

  async updateSession(data: any) {
    const { data: sessionData, error } = await supabaseAdmin
      .from('sessions')
      .update(data)
      .eq('session_token', data.sessionToken)
      .select()
      .single()

    if (error) {
      throw new Error(`Error updating session: ${error.message}`)
    }

    return sessionData
  },

  async deleteSession(sessionToken: string) {
    const { error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken)

    if (error) {
      throw new Error(`Error deleting session: ${error.message}`)
    }
  },

  async createVerificationToken(data: any) {
    const { data: tokenData, error } = await supabaseAdmin
      .from('verification_tokens')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating verification token: ${error.message}`)
    }

    return tokenData
  },

  async useVerificationToken(identifier: string, token: string) {
    const { data, error } = await supabaseAdmin
      .from('verification_tokens')
      .delete()
      .eq('identifier', identifier)
      .eq('token', token)
      .select()
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error using verification token: ${error.message}`)
    }

    return data || null
  }
}

export const authOptions = {
  adapter: SupabaseAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
