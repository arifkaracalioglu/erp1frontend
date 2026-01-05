import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null,
    company: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    companyName: (state) => state.company?.name || ''
  },

  actions: {
    async login(username, password) {
      const res = await api.post('/auth/login', {
        username,
        password
      })

      /**
       * Beklenen backend response:
       * {
       *   token: "...",
       *   user: {...},
       *   company: { id, name }
       * }
       */
      this.token = res.data.token
      this.user = res.data.user
      this.company = res.data.company

      localStorage.setItem('token', this.token)
    },
    
    async register(companyName, username, password) {
      const res = await api.post('/auth/register', {
        companyName,
        username,
        password
      })

      this.token = res.data.token
      this.user = res.data.user
      this.company = res.data.company

      localStorage.setItem('token', this.token)
    },

    async loadMe() {
      if (!this.token) return

      const res = await api.get('/auth/me')
      this.user = res.data.user
      this.company = res.data.company
    },

    logout() {
      this.token = null
      this.user = null
      this.company = null

      localStorage.removeItem('token')
    }
  }
})
