import { useEffect, useState } from 'react'
import { getProducts } from '../services/product.service'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error(error)
        setError('No fue posible cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return <p>Cargando productos...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h2>Productos</h2>

      {products.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${Number(product.price).toLocaleString('es-CO')} - Stock: {product.stock}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductsPage