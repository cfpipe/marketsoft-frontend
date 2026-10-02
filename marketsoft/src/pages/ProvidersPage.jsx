import { useEffect, useState } from 'react'
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider
} from '../services/provider.service'

function ProvidersPage() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  })

  const [editingId, setEditingId] = useState(null)

  const loadProviders = async () => {
    try {
      setLoading(true)
      const data = await getProviders()
      setProviders(data)
      setError('')
    } catch (error) {
      console.error(error)
      setError('No fue posible cargar los proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProviders()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingId) {
        await updateProvider(editingId, form)
      } else {
        await createProvider(form)
      }

      setForm({
        name: '',
        phone: '',
        email: '',
        city: ''
      })

      setEditingId(null)

      await loadProviders()
    } catch (error) {
      console.error(error)
      setError('No fue posible guardar el proveedor')
    }
  }

  const handleEdit = (provider) => {
    setForm({
      name: provider.name || '',
      phone: provider.phone || '',
      email: provider.email || '',
      city: provider.city || ''
    })

    setEditingId(provider.id)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      '¿Está seguro de eliminar este proveedor?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await deleteProvider(id)
      await loadProviders()
    } catch (error) {
      console.error(error)
      setError('No fue posible eliminar el proveedor')
    }
  }

  const handleCancel = () => {
    setForm({
      name: '',
      phone: '',
      email: '',
      city: ''
    })

    setEditingId(null)
  }

  if (loading) {
    return <p>Cargando proveedores...</p>
  }

  return (
    <div>
      <h2>Proveedores</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={form.city}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? 'Actualizar proveedor' : 'Guardar proveedor'}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </form>

      <hr />

      {providers.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <ul>
          {providers.map((provider) => (
            <li key={provider.id}>
              <strong>{provider.name}</strong>
              {' - '}
              {provider.phone}
              {' - '}
              {provider.email}
              {' - '}
              {provider.city}

              {' '}

              <button onClick={() => handleEdit(provider)}>
                Editar
              </button>

              <button onClick={() => handleDelete(provider.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProvidersPage