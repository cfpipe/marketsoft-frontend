import { useState } from 'react'
import { BsPencilSquare, BsPlusLg, BsTrash, BsXLg } from 'react-icons/bs'
import useFetch from '../hooks/useFetch'
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} from '../services/sale.service'
import { getUsers } from '../services/user.service'
import { getProducts } from '../services/product.service'

const emptyLine = { productId: '', quantity: 1 }

const formatMoney = (value) => `$${Number(value).toLocaleString('es-CO')}`

// El input datetime-local necesita el formato YYYY-MM-DDTHH:mm en hora local
const toInputDate = (isoDate) => {
  const date = new Date(isoDate)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

function SalesPage() {
  const sales = useFetch(getSales)
  const users = useFetch(getUsers)
  const products = useFetch(getProducts)

  const [userId, setUserId] = useState('')
  const [date, setDate] = useState('')
  const [lines, setLines] = useState([emptyLine])
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const resetForm = () => {
    setUserId('')
    setDate('')
    setLines([emptyLine])
    setEditingId(null)
  }

  const handleLineChange = (index, field, value) => {
    setLines(
      lines.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    )
  }

  const addLine = () => setLines([...lines, emptyLine])

  const removeLine = (index) => setLines(lines.filter((_, i) => i !== index))

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingId) {
        await updateSale(editingId, {
          userId: Number(userId),
          date: new Date(date).toISOString(),
        })
      } else {
        await createSale({
          userId: Number(userId),
          products: lines.map((line) => ({
            productId: Number(line.productId),
            quantity: Number(line.quantity),
          })),
        })
      }

      resetForm()
      setError('')
      sales.reload()
      products.reload()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'No fue posible guardar la venta')
    }
  }

  const handleEdit = (sale) => {
    setUserId(sale.userId)
    setDate(toInputDate(sale.date))
    setEditingId(sale.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta venta?')) return

    try {
      await deleteSale(id)
      setError('')
      sales.reload()
    } catch (err) {
      console.error(err)
      setError('No fue posible eliminar la venta')
    }
  }

  if (sales.loading) {
    return <p>Cargando ventas...</p>
  }

  const shownError = error || sales.error || users.error || products.error

  return (
    <div>
      <h2 className="mb-4">Ventas</h2>

      {shownError && <div className="alert alert-danger">{shownError}</div>}

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Vendedor</label>
            <select
              className="form-select"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {users.data.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {editingId && (
            <div className="col-md-6">
              <label className="form-label">Fecha</label>
              <input
                type="datetime-local"
                className="form-control"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>
          )}
        </div>

        {!editingId && (
          <div className="mt-3">
            <label className="form-label">Productos</label>

            {lines.map((line, index) => (
              <div key={index} className="row g-2 mb-2">
                <div className="col-md-7">
                  <select
                    className="form-select"
                    value={line.productId}
                    onChange={(event) =>
                      handleLineChange(index, 'productId', event.target.value)
                    }
                    required
                  >
                    <option value="">Seleccione un producto...</option>
                    {products.data.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} — {formatMoney(product.price)} (stock:{' '}
                        {product.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={line.quantity}
                    onChange={(event) =>
                      handleLineChange(index, 'quantity', event.target.value)
                    }
                    required
                  />
                </div>

                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    title="Quitar producto"
                    disabled={lines.length === 1}
                    onClick={() => removeLine(index)}
                  >
                    <BsXLg />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={addLine}
            >
              <BsPlusLg className="me-1" />
              Agregar producto
            </button>
          </div>
        )}

        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Actualizar venta' : 'Registrar venta'}
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

      {sales.data.length === 0 ? (
        <div className="alert alert-info">No hay ventas registradas.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle bg-white">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Vendedor</th>
                <th>Productos</th>
                <th>Total</th>
                <th className="table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.data.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{new Date(sale.date).toLocaleString('es-CO')}</td>
                  <td>{sale.user?.name ?? sale.userId}</td>
                  <td>
                    {sale.details
                      ?.map(
                        (detail) =>
                          `${detail.product?.name ?? detail.productId} x${detail.quantity}`
                      )
                      .join(', ')}
                  </td>
                  <td>{formatMoney(sale.total)}</td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Editar"
                      onClick={() => handleEdit(sale)}
                    >
                      <BsPencilSquare />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(sale.id)}
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

export default SalesPage
