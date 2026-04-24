import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Edit2, Trash2 } from 'lucide-react';
import { api } from '../services/api';

const Customers = ({ showToast }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await api.customers.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await api.customers.delete(id);
        // Lọc lại danh sách (hỗ trợ cả customerId và CustomerId)
        setCustomers(prev => prev.filter(c => (c.customerId || c.CustomerId) != id));
        if (typeof showToast === 'function') showToast('Xóa khách hàng thành công!', 'success');
      } catch (error) {
        if (typeof showToast === 'function') showToast(error.message, 'error');
        else alert(error.message);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="page-title">
          <h1>Quản lý Khách hàng</h1>
          <p>Danh sách khách hàng đã đăng ký mua bánh.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} />
          Thêm khách hàng
        </button>
      </header>

      <div className="table-container">
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng..." 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Khách Hàng</th>
                <th>Số Điện Thoại</th>
                <th>Địa Chỉ</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>#{customer.customerId}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{customer.ten}</div>
                  </td>
                  <td>{customer.soDienThoai}</td>
                  <td>{customer.diaChi}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => handleDelete(customer.customerId)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Chưa có khách hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Customers;
