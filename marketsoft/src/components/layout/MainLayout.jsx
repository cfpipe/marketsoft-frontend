import { Link } from 'react-router-dom'

function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      <aside
        style={{
          width: '220px',
          backgroundColor: '#212529',
          color: 'white',
          padding: '20px',
        }}
      >
        <h2>MarketSoft</h2>

        <nav style={{ marginTop: '30px' }}>
          <div style={{ marginBottom: '15px' }}>
            <Link to="/" style={{ color: 'white' }}>
              Home
            </Link>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Link to="/users" style={{ color: 'white' }}>
              Users
            </Link>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Link to="/products" style={{ color: 'white' }}>
              Products
            </Link>
          </div>

          <div>
            <Link to="/providers" style={{ color: 'white' }}>
              Providers
            </Link>
          </div>
        </nav>
      </aside>

      <div style={{ flex: 1 }}>
        
        <header
          style={{
            padding: '20px',
            backgroundColor: 'white',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h1>MarketSoft</h1>
        </header>

        <main style={{ padding: '30px' }}>
          {children}
        </main>

      </div>
    </div>
  )
}

export default MainLayout