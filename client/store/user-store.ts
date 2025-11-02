import { User } from "@/types/user"
import { create } from "zustand/react"

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
  isAuthenticated: boolean
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  isAuthenticated: false,
}))
