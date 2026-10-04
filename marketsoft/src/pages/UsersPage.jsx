import { useState } from 'react'
import { BsPencilSquare, BsTrash } from 'react-icons/bs'
import useFetch from '../hooks/useFetch'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.service'

const emptyForm = { name: '', email: '', role: 'employee' }

function UsersPage() {
  const { data: users, loading, error: loadError, reload } = useFetch(getUsers)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingId) {
        await updateUser(editingId, form)
      } else {
        await createUser(form)
      }

      resetForm()
      setError('')
      reload()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'No fue posible guardar el usuario')
    }
  }

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role })
    setEditingId(user.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return

    try {
      await deleteUser(id)
      setError('')
      reload()
    } catch (err) {
      console.error(err)
      setError('No fue posible eliminar el usuario')
    }
  }

  if (loading) {
    return <p>Cargando usuarios...</p>
  }

  return (
    <div>
      <h2 className="mb-4">Usuarios</h2>

      {(error || loadError) && (
        <div className="alert alert-danger">{error || loadError}</div>
      )}

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Rol</label>
            <input
              type="text"
              name="role"
              list="roles"
              className="form-control"
              value={form.role}
              onChange={handleChange}
              required
            />
            <datalist id="roles">
              <option value="employee" />
              <option value="admin" />
            </datalist>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Actualizar usuario' : 'Guardar usuario'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {users.length === 0 ? (
        <div className="alert alert-info">No hay usuarios registrados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle bg-white">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th className="table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Editar"
                      onClick={() => handleEdit(user)}
                    >
                      <BsPencilSquare />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(user.id)}
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

export default UsersPage
