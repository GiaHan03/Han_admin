import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { api } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    employees: 0,
    categories: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.dashboard.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Sản phẩm', value: stats.totalProducts || 0, icon: Package, color: '#f59e0b' },
    { label: 'Doanh thu', value: (stats.totalRevenue || 0).toLocaleString() + 'đ', icon: DollarSign, color: '#10b981' },
    { label: 'Khách hàng', value: stats.totalCustomers || 0, icon: Users, color: '#fb923c' },
    { label: 'Đơn hàng', value: stats.totalOrders || 0, icon: ShoppingCart, color: '#ea580c' }
  ];

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="page-title">
          <h1>Tổng quan hệ thống</h1>
          <p>Chào mừng trở lại, Han.</p>
        </div>
        <button className="btn btn-primary">
          <DollarSign size={18} />
          Xuất báo cáo
        </button>
      </header>

      <div className="stats-grid">
        {cards.map((card, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Thống kê doanh thu tuần</h2>
        <div className="table-container" style={{ padding: '2rem', height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
          {[65, 45, 75, 50, 90, 60, 85].map((val, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                style={{ 
                  width: '100%', 
                  height: `${val}%`, 
                  background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  opacity: 0.8,
                  transition: 'height 1s ease-out',
                  position: 'relative'
                }}
                className="chart-bar"
              >
                <div className="chart-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: 'var(--text)', color: 'var(--bg)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {val}tr
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>T{i+2}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Top 5 Sản phẩm bán chạy</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Bánh</th>
                  <th>Đã bán</th>
                </tr>
              </thead>
              <tbody>
                {stats.topSellingProducts?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.productName}</td>
                    <td><span className="badge badge-success">{item.totalSold}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Cảnh báo hết hàng</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Bánh</th>
                  <th>Còn lại</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockItems?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.tenBanh}</td>
                    <td><span className="badge badge-danger">{item.soLuongTon}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
