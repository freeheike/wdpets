import { create } from 'zustand'
import type { UserProfile } from '../types'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import { loadUser, saveUser, clearUserData } from '../lib/storage'

interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
  init: () => Promise<void>
  signInGuest: () => void
  signUp: (email: string, password: string, nickname: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

function guestUser(): UserProfile {
  return {
    id: `guest_${Date.now()}`,
    email: 'guest@webpet.local',
    nickname: '游客',
    isGuest: true,
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  init: async () => {
    const saved = loadUser<UserProfile | null>(null)
    if (saved) {
      set({ user: saved, loading: false })
      return
    }

    const supabase = getSupabase()
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        const profile: UserProfile = {
          id: data.session.user.id,
          email: data.session.user.email ?? '',
          nickname: data.session.user.user_metadata?.nickname ?? '宠物主人',
          isGuest: false,
        }
        saveUser(profile)
        set({ user: profile, loading: false })
        return
      }
    }
    set({ loading: false })
  },

  signInGuest: () => {
    const user = guestUser()
    saveUser(user)
    set({ user, error: null })
  },

  signUp: async (email, password, nickname) => {
    if (!isSupabaseConfigured) {
      const user: UserProfile = {
        id: `local_${Date.now()}`,
        email,
        nickname,
        isGuest: false,
      }
      saveUser(user)
      set({ user, error: null })
      return true
    }
    const supabase = getSupabase()!
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    })
    if (error) {
      set({ error: error.message })
      return false
    }
    const user: UserProfile = { id: `pending_${Date.now()}`, email, nickname, isGuest: false }
    saveUser(user)
    set({ user, error: null })
    return true
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured) {
      const user: UserProfile = {
        id: `local_${Date.now()}`,
        email,
        nickname: email.split('@')[0],
        isGuest: false,
      }
      saveUser(user)
      set({ user, error: null })
      return true
    }
    const supabase = getSupabase()!
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: error.message })
      return false
    }
    const profile: UserProfile = {
      id: data.user.id,
      email: data.user.email ?? email,
      nickname: data.user.user_metadata?.nickname ?? '宠物主人',
      isGuest: false,
    }
    saveUser(profile)
    set({ user: profile, error: null })
    return true
  },

  signOut: async () => {
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
    clearUserData()
    set({ user: null, error: null })
  },
}))
