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
        const [products, employees, categories, orders] = await Promise.all([
          api.products.getAll(),
          api.employees.getAll(),
          api.categories.getAll(),
          api.orders.getAll()
        ]);
        setStats({
          products: products?.length || 0,
          employees: employees?.length || 0,
          categories: categories?.length || 0,
          orders: orders?.length || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Sản phẩm', value: stats.products, icon: Package, color: '#f59e0b' },
    { label: 'Nhân viên', value: stats.employees, icon: Users, color: '#fb923c' },
    { label: 'Danh mục', value: stats.categories, icon: TrendingUp, color: '#fcd34d' },
    { label: 'Đơn hàng', value: stats.orders, icon: ShoppingCart, color: '#ea580c' }
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
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Hoạt động gần đây</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Hoạt động</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10:45 AM</td>
                <td>Cập nhật kho bánh ngọt</td>
                <td><span className="badge badge-success">Thành công</span></td>
              </tr>
              <tr>
                <td>09:30 AM</td>
                <td>Thêm nhân viên mới: Gia Han</td>
                <td><span className="badge badge-success">Thành công</span></td>
              </tr>
              <tr>
                <td>Hôm qua</td>
                <td>Đơn hàng #ORD-123 hoàn tất</td>
                <td><span className="badge badge-success">Thành công</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
