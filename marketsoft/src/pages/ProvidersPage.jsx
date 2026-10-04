import { useEffect, useState } from 'react'
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider
} from '../services/provider.service'
import { BsPencilSquare, BsTrash } from 'react-icons/bs'

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
      <h2 className="mb-4">Proveedores</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="Ciudad"
              value={form.city}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Actualizar proveedor' : 'Guardar proveedor'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {providers.length === 0 ? (
        <div className="alert alert-info">No hay proveedores registrados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle bg-white">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Ciudad</th>
                <th className="table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.name}</td>
                  <td>{provider.phone}</td>
                  <td>{provider.email}</td>
                  <td>{provider.city}</td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Editar"
                      onClick={() => handleEdit(provider)}
                    >
                      <BsPencilSquare />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(provider.id)}
                    >
                      <BsTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProvidersPage
