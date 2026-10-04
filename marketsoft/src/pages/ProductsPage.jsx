import { useEffect, useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service'
import { BsPencilSquare, BsTrash } from 'react-icons/bs'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingProduct, setEditingProduct] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    providerId: '',
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
      setError('No fue posible cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        providerId: Number(form.providerId),
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await createProduct(productData)
      }

      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        providerId: '',
      })

      setEditingProduct(null)
      setError('')

      await loadProducts()
    } catch (error) {
      console.error(error)
      setError('No fue posible guardar el producto')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      providerId: product.providerId,
    })
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      '¿Está seguro de eliminar este producto?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (error) {
      console.error(error)
      setError('No fue posible eliminar el producto')
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)

    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      providerId: '',
    })
  }

  if (loading) {
    return <p>Cargando productos...</p>
  }

  return (
    <div>
      <h2 className="mb-4">Productos</h2>

      {error && <div className="alert alert-danger">{error}</div>}

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

          <div className="col-md-8">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              name="description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">ID del proveedor</label>
            <input
              type="number"
              name="providerId"
              className="form-control"
              value={form.providerId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editingProduct ? 'Actualizar producto' : 'Guardar producto'}
          </button>

          {editingProduct && (
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

      {products.length === 0 ? (
        <div className="alert alert-info">No hay productos registrados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle bg-white">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Proveedor</th>
                <th className="table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${Number(product.price).toLocaleString('es-CO')}</td>
                  <td>{product.stock}</td>
                  <td>{product.providerId}</td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Editar"
                      onClick={() => handleEdit(product)}
                    >
                      <BsPencilSquare />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(product.id)}
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

export default ProductsPage
