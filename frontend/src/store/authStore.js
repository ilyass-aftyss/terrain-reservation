import { create } from 'zustand'
import apiClient from '../api/axiosConfig'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await apiClient.post('/auth/login', { email, password })
      const { token, userId, nom, prenom, role } = res.data
      const user = { id: userId, email: res.data.email, nom, prenom, role }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, loading: false })
      return user
    } catch (err) {
      const msg = err.response?.data?.error || 'Erreur de connexion'
      set({ error: msg, loading: false })
      throw new Error(msg)
    }
  },

  register: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await apiClient.post('/auth/register', data)
      const { token, userId, nom, prenom, role } = res.data
      const user = { id: userId, email: res.data.email, nom, prenom, role }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, loading: false })
      return user
    } catch (err) {
      const msg = err.response?.data?.error || "Erreur lors de l'inscription"
      set({ error: msg, loading: false })
      throw new Error(msg)
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    const token = get().token
    if (!token) return
    try {
      const res = await apiClient.get('/auth/me')
      const user = res.data
      localStorage.setItem('user', JSON.stringify(user))
      set({ user })
    } catch {
      get().logout()
    }
  },

  isAuthenticated: () => !!get().token,
  isJoueur: () => get().user?.role === 'JOUEUR',
  isPresident: () => get().user?.role === 'PRESIDENT',
  isAdmin: () => get().user?.role === 'ADMIN',
}))

export default useAuthStore
