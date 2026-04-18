import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ShoppingCart, 
  Settings,
  Award
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Employees from './pages/Employees';
import Brands from './pages/Brands';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">
              <Package size={28} />
            </div>
            <span>Han Admin</span>
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
            <NavLink to="/employees" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Nhân viên</span>
            </NavLink>
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
              <Settings size={20} />
              <span>Cài đặt</span>
            </NavLink>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="bg-glow"></div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="*" element={<div className="animate-fade-in"><h1>Tính năng đang phát triển</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
