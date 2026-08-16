import { create } from 'zustand'

interface User {
  id: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
}

const storedToken = localStorage.getItem("admin_token")
const storedUser = localStorage.getItem("admin_user")

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedToken,
  setAuth: (token, user) => {
    localStorage.setItem("admin_token", token)
    localStorage.setItem("admin_user", JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    set({ token: null, user: null, isAuthenticated: false })
  }
}))
