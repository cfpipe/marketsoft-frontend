import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProductsPage from './pages/ProductsPage'
import ProvidersPage from './pages/ProvidersPage'
import UsersPage from './pages/UsersPage'
import SalesPage from './pages/SalesPage'
import SaleDetailsPage from './pages/SaleDetailsPage'

function HomePage() {
  return <h2>Bienvenido a MarketSoft</h2>
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sale-details" element={<SaleDetailsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App