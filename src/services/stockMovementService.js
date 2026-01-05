import api from './api'

export default {
  getAll() {
    return api.get('/stock-movements')
  },

  getByProduct(productId) {
    return api.get(`/stock-movements/product/${productId}`)
  },
  getPaged(params) {
    return api.get('/stock-movements', {
      params: {
        page: params.page,
        size: params.size,
        sort: 'createdAt,desc',
        productId: params.productId || null
      }
    })
  },

  getPaged(params) {
    return api.get('/stock-movements', { params })
  },

  exportPdf(params) {
    return api.get('/stock-movements/pdf', {
      params,
      responseType: 'blob'
    })
  }


}
