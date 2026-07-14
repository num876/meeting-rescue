import { create } from 'zustand'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'

interface AuthState {
  user: FirebaseUser | null
  isLoading: boolean
  init: () => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start true while Firebase initializes
  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, isLoading: false })
    })
  },
  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null })
    } catch (error) {
      console.error('Error logging out:', error)
    }
  },
}))
