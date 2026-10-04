import { NavLink } from 'react-router-dom'
import {
  BsHouse,
  BsPeople,
  BsBoxSeam,
  BsTruck,
  BsReceipt,
  BsListUl,
} from 'react-icons/bs'

const menuItems = [
  { to: '/', label: 'Inicio', icon: BsHouse },
  { to: '/users', label: 'Usuarios', icon: BsPeople },
  { to: '/products', label: 'Productos', icon: BsBoxSeam },
  { to: '/providers', label: 'Proveedores', icon: BsTruck },
  { to: '/sales', label: 'Ventas', icon: BsReceipt },
  { to: '/sale-details', label: 'Detalles de venta', icon: BsListUl },
]

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar text-white p-3">
        <h4 className="mb-4">MarketSoft</h4>

        <nav className="nav flex-column gap-1">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className="nav-link">
              <Icon className="me-2" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-content">
        <header className="app-header px-4 py-3">
          <h1 className="h4 m-0">MarketSoft</h1>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
