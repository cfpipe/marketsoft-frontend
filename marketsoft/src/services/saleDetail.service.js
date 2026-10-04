import api from './api'

export const getSaleDetails = async () => {
  const response = await api.get('/sale-details')
  return response.data
}

export const createSaleDetail = async (data) => {
  const response = await api.post('/sale-details', data)
  return response.data
}

export const updateSaleDetail = async (id, data) => {
  const response = await api.put(`/sale-details/${id}`, data)
  return response.data
}

export const deleteSaleDetail = async (id) => {
  const response = await api.delete(`/sale-details/${id}`)
  return response.data
}
