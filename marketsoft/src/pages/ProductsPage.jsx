import { useEffect, useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service'

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
      <h2>Productos</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descripción</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Precio</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>ID del proveedor</label>
          <input
            type="number"
            name="providerId"
            value={form.providerId}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {editingProduct ? 'Actualizar producto' : 'Guardar producto'}
        </button>

        {editingProduct && (
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </form>

      <hr />

      {products.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - $
              {Number(product.price).toLocaleString('es-CO')} - Stock:{' '}
              {product.stock}

              <button type="button" onClick={() => handleEdit(product)}>
                Editar
              </button>

              <button type="button" onClick={() => handleDelete(product.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductsPage