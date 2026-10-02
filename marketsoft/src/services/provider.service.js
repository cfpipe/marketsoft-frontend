import api from './api'

export const getProviders = async () => {
  const response = await api.get('/providers')
  return response.data
}

export const getProviderById = async (id) => {
  const response = await api.get(`/providers/${id}`)
  return response.data
}

export const createProvider = async (provider) => {
  const response = await api.post('/providers', provider)
  return response.data
}

export const updateProvider = async (id, provider) => {
  const response = await api.put(`/providers/${id}`, provider)
  return response.data
}

export const deleteProvider = async (id) => {
  const response = await api.delete(`/providers/${id}`)
  return response.data
}