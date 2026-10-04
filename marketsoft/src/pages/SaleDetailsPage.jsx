import { useState } from 'react'
import { BsPencilSquare, BsTrash } from 'react-icons/bs'
import useFetch from '../hooks/useFetch'
import {
  getSaleDetails,
  createSaleDetail,
  updateSaleDetail,
  deleteSaleDetail,
} from '../services/saleDetail.service'
import { getSales } from '../services/sale.service'
import { getProducts } from '../services/product.service'

const emptyForm = { saleId: '', productId: '', quantity: '', price: '' }

function SaleDetailsPage() {
  const details = useFetch(getSaleDetails)
  const sales = useFetch(getSales)
  const products = useFetch(getProducts)

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  // Al elegir un producto nuevo se sugiere su precio actual
  const handleProductChange = (event) => {
    const product = products.data.find((p) => p.id === Number(event.target.value))

    setForm({
      ...form,
      productId: event.target.value,
      price: product ? product.price : form.price,
    })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const detailData = {
      saleId: Number(form.saleId),
      productId: Number(form.productId),
      quantity: Number(form.quantity),
      price: Number(form.price),
    }

    try {
      if (editingId) {
        await updateSaleDetail(editingId, detailData)
      } else {
        await createSaleDetail(detailData)
      }

      resetForm()
      setError('')
      details.reload()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'No fue posible guardar el detalle')
    }
  }

  const handleEdit = (detail) => {
    setForm({
      saleId: detail.saleId,
      productId: detail.productId,
      quantity: detail.quantity,
      price: detail.price,
    })
    setEditingId(detail.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este detalle?')) return

    try {
      await deleteSaleDetail(id)
      setError('')
      details.reload()
    } catch (err) {
      console.error(err)
      setError('No fue posible eliminar el detalle')
    }
  }

  if (details.loading) {
    return <p>Cargando detalles de venta...</p>
  }

  const shownError = error || details.error || sales.error || products.error

  return (
    <div>
      <h2 className="mb-4">Detalles de venta</h2>

      {shownError && <div className="alert alert-danger">{shownError}</div>}

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Venta</label>
            <select
              name="saleId"
              className="form-select"
              value={form.saleId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {sales.data.map((sale) => (
                <option key={sale.id} value={sale.id}>
                  Venta #{sale.id}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Producto</label>
            <select
              name="productId"
              className="form-select"
              value={form.productId}
              onChange={handleProductChange}
              required
            >
              <option value="">Seleccione...</option>
              {products.data.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Cantidad</label>
            <input
              type="number"
              min="1"
              name="quantity"
              className="form-control"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Precio unitario</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              className="form-control"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Actualizar detalle' : 'Guardar detalle'}
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

      {details.data.length === 0 ? (
        <div className="alert alert-info">No hay detalles registrados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle bg-white">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Venta</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th className="table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {details.data.map((detail) => (
                <tr key={detail.id}>
                  <td>{detail.id}</td>
                  <td>#{detail.saleId}</td>
                  <td>{detail.product?.name ?? detail.productId}</td>
                  <td>{detail.quantity}</td>
                  <td>${Number(detail.price).toLocaleString('es-CO')}</td>
                  <td>
                    $
                    {(detail.quantity * Number(detail.price)).toLocaleString(
                      'es-CO'
                    )}
                  </td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Editar"
                      onClick={() => handleEdit(detail)}
                    >
                      <BsPencilSquare />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(detail.id)}
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

export default SaleDetailsPage
