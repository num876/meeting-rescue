import { create } from 'zustand'
import { db } from '@/lib/firebase'
import { collection, getDocs, setDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore'

export interface SavedMeeting {
  id: string
  title: string
  date: string
  durationStr: string
  decisionCount: number
  actionItemCount: number
  summary: string
  decisions: any[]
  actionItems: any[]
  userId?: string // New field to tie to user
}

interface MeetingStore {
  meetings: SavedMeeting[]
  isLoading: boolean
  fetchMeetings: (userId: string) => Promise<void>
  addMeeting: (meeting: SavedMeeting, userId: string) => Promise<void>
  removeMeeting: (id: string) => Promise<void>
  getMeeting: (id: string) => SavedMeeting | undefined
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: [],
  isLoading: false,
  fetchMeetings: async (userId: string) => {
    set({ isLoading: true })
    try {
      const q = query(collection(db, 'meetings'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      const meetings: SavedMeeting[] = []
      querySnapshot.forEach((doc) => {
        meetings.push(doc.data() as SavedMeeting)
      })
      // Sort client-side by date descending
      meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      set({ meetings, isLoading: false })
    } catch (error) {
      console.error("Error fetching meetings:", error)
      set({ isLoading: false })
    }
  },
  addMeeting: async (meeting, userId) => {
    const meetingWithUser = { ...meeting, userId }
    // Optimistic UI update
    set((state) => ({ 
      meetings: [meetingWithUser, ...state.meetings.filter(m => m.id !== meeting.id)] 
    }))
    try {
      await setDoc(doc(db, 'meetings', meeting.id), meetingWithUser)
    } catch (error) {
      console.error("Error saving meeting:", error)
    }
  },
  removeMeeting: async (id) => {
    // Optimistic UI update
    set((state) => ({ 
      meetings: state.meetings.filter(m => m.id !== id) 
    }))
    try {
      await deleteDoc(doc(db, 'meetings', id))
    } catch (error) {
      console.error("Error deleting meeting:", error)
    }
  },
  getMeeting: (id) => get().meetings.find(m => m.id === id),
}))
