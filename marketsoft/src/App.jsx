import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProductsPage from './pages/ProductsPage'

function HomePage() {
  return <h2>Bienvenido a MarketSoft</h2>
}

function UsersPage() {
  return <h2>Usuarios</h2>
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App