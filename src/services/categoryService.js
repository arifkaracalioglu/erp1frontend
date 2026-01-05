import api from './api'

export default {
  getAll() {
    return api.get('/categories')
  },

  create(name) {
    return api.post('/categories', { name })
  },

  delete(id) {
    return api.delete(`/categories/${id}`)
  }
}
