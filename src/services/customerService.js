import api from './api'

export default {
  getAll() {
    return api.get('/customers')
  },

  create(data) {
    return api.post('/customers', data)
  },

  delete(id) {
    return api.delete(`/customers/${id}`)
  }
}
