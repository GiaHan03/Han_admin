import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ShoppingCart, 
  Settings as SettingsIcon,
  Award,
  Lock,
  Sun,
  Moon,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Employees from './pages/Employees';
import Brands from './pages/Brands';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import { Navigate } from 'react-router-dom';

function App() {
  const [theme, setTheme] = React.useState('dark');
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  React.useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isManager = user?.position === 'Manager';

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className={`app-container ${theme}-theme`}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="logo-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="logo-icon-wrapper" style={{ 
                background: 'var(--glass-bg)', 
                padding: '0.6rem', 
                borderRadius: '1rem', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)'
              }}>
                <Package size={24} color="var(--primary)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1
                }}>Han</span>
                <span style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1
                }}>Admin</span>
              </div>
            </div>
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(15deg) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0) scale(1)'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="user-profile" style={{ 
            padding: '1.25rem', 
            background: 'var(--glass-bg)',
            borderRadius: '1.25rem',
            border: '1px solid var(--glass-border)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
             <div style={{ 
               width: '40px', 
               height: '40px', 
               borderRadius: '50%', 
               background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontWeight: 700,
               color: '#000'
             }}>
               {user.fullName.charAt(0)}
             </div>
             <div>
               <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.fullName}</div>
               <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{user.position}</div>
             </div>
          </div>
          
          <nav className="nav-links">
            <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/products" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Package size={20} />
              <span>Sản phẩm</span>
            </NavLink>
            <NavLink to="/categories" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Tags size={20} />
              <span>Danh mục</span>
            </NavLink>
            <NavLink to="/brands" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Award size={20} />
              <span>Thương hiệu</span>
            </NavLink>
            
            {isManager && (
              <NavLink to="/employees" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                <Users size={20} />
                <span>Nhân viên</span>
              </NavLink>
            )}

            <NavLink to="/customers" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Khách hàng</span>
            </NavLink>
            <NavLink to="/orders" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <ShoppingCart size={20} />
              <span>Đơn hàng</span>
            </NavLink>
          </nav>

          <div style={{ marginTop: 'auto' }}>
            <NavLink to="/settings" className="nav-link">
              <SettingsIcon size={20} />
              <span>Cài đặt</span>
            </NavLink>
            <button onClick={handleLogout} className="nav-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <Lock size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="bg-glow"></div>
          <Routes>
            <Route path="/" element={<Dashboard user={user} showToast={showToast} />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="/products" element={<Products user={user} showToast={showToast} />} />
            <Route path="/categories" element={<Categories user={user} showToast={showToast} />} />
            <Route path="/brands" element={<Brands user={user} showToast={showToast} />} />
            
            <Route 
              path="/employees" 
              element={isManager ? <Employees showToast={showToast} /> : <Navigate to="/" replace />} 
            />
            
            <Route path="/customers" element={<Customers user={user} showToast={showToast} />} />
            <Route path="/orders" element={<Orders user={user} showToast={showToast} />} />
            <Route path="/settings" element={<Settings user={user} onUpdateUser={setUser} showToast={showToast} />} />
            <Route path="*" element={<div className="animate-fade-in"><h1>Tính năng đang phát triển</h1></div>} />
          </Routes>
        </main>

        {/* Simple Toast Notification */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 1000,
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span style={{ fontWeight: 600 }}>{toast.message}</span>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
