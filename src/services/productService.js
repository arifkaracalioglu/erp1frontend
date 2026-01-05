import api from './api'

export default {
  getAll() {
    return api.get('/products')
  },

  getByCategory(categoryId) {
    return api.get(`/products/category/${categoryId}`)
  },

  create(data) {
    return api.post('/products', data)
  },

  delete(id) {
    return api.delete(`/products/${id}`)
  },

  getPdf() {
    return api.get('/products/pdf', {
      responseType: 'blob'
    })
  },

  stockIn(productId, quantity) {
    return api.post(`/products/${productId}/stock/in`, { quantity })
  },

  stockOut(productId, quantity) {
    return api.post(`/products/${productId}/stock/out`, { quantity })
  },

  getStockForecast(productId) {
    return api.get(`/products/${productId}/stock-forecast`)
  }

}
