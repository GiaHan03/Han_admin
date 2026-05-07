import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Trash2, CheckCircle, Truck, Clock, FileDown } from 'lucide-react';
import { api } from '../services/api';
import { getImageUrl } from '../utils/helpers';

const Orders = ({ showToast }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const handleExport = () => {
    const headers = ['Mã Đơn', 'Ngày Đặt', 'Khách Hàng', 'Tổng Tiền', 'Trạng Thái'];
    const csvData = orders.map(o => [
      `ORD-${o.orderId || o.OrderId}`,
      new Date(o.ngayBan).toLocaleDateString('vi-VN'),
      o.customer?.ten,
      o.tongTien,
      o.status
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toLocaleDateString()}.csv`;
    link.click();
    showToast('Đã xuất file báo cáo!');
  };

  const fetchData = async () => {
    try {
      const [orderData, productData, customerData] = await Promise.all([
        api.orders.getAll(),
        api.products.getAll(),
        api.customers.getAll()
      ]);
      setOrders(orderData);
      setProducts(productData);
      setCustomers(customerData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <span className="badge badge-success">Đã giao</span>;
      case 'Shipping': return <span className="badge badge-warning">Đang giao</span>;
      case 'Processing': return <span className="badge badge-primary">Đang xử lý</span>;
      case 'Cancelled': return <span className="badge badge-danger">Đã hủy</span>;
      default: return <span className="badge badge-secondary">Chờ xử lý</span>;
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.orders.updateStatus(id, newStatus);
      setOrders(orders.map(o => (o.orderId || o.OrderId) === id ? { ...o, status: newStatus } : o));
      showToast('Cập nhật trạng thái thành công!');
    } catch (error) {
      showToast('Lỗi cập nhật: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await api.orders.delete(id);
        setOrders(prev => prev.filter(o => (o.orderId || o.OrderId) != id));
        showToast('Xóa đơn hàng thành công!', 'success');
      } catch (error) {
        showToast('Lỗi khi xóa: ' + error.message, 'error');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="page-title">
          <h1>Quản lý Đơn hàng</h1>
          <p>Theo dõi và xử lý đơn hàng từ khách hàng.</p>
        </div>
        <button className="btn btn-outline" onClick={handleExport}>
          <FileDown size={18} />
          Xuất báo cáo (CSV)
        </button>
      </header>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Ngày Đặt</th>
                <th>Khách Hàng</th>
                <th>Tổng Tiền</th>
                <th>Thanh Toán</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId || order.OrderId}>
                  <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>ORD-{order.orderId || order.OrderId}</span></td>
                  <td>{new Date(order.ngayBan).toLocaleDateString('vi-VN')}</td>
                  <td>{customers.find(c => (c.customerId || c.CustomerId) === (order.customerId || order.CustomerId))?.ten || `Khách hàng #${order.customerId || order.CustomerId}`}</td>
                  <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>{order.tongTien.toLocaleString()}đ</span></td>
                  <td>
                    {order.paymentStatus === 'Paid' ? 
                      <span style={{ color: '#10b981' }}>Đã trả</span> : 
                      <span style={{ opacity: 0.5 }}>Chưa trả</span>
                    }
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" title="Đang xử lý" onClick={() => handleStatusUpdate(order.orderId || order.OrderId, 'Processing')}>
                        <Clock size={16} />
                      </button>
                      <button className="btn-icon" title="Đang giao" onClick={() => handleStatusUpdate(order.orderId || order.OrderId, 'Shipping')}>
                        <Truck size={16} />
                      </button>
                      <button className="btn-icon" title="Đã hoàn thành" style={{ color: '#10b981' }} onClick={() => handleStatusUpdate(order.orderId || order.OrderId, 'Delivered')}>
                        <CheckCircle size={16} />
                      </button>
                      <button className="btn-icon" title="Xem chi tiết" onClick={() => handleViewDetails(order)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon" title="Xóa đơn hàng" style={{ color: '#ef4444' }} onClick={() => handleDelete(order.orderId || order.OrderId)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Chưa có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showDetailModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal animate-fade-in" style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Chi tiết đơn hàng #ORD-{selectedOrder.orderId || selectedOrder.OrderId}</h2>
              <button className="btn-icon" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>Khách hàng</p>
                <p style={{ fontWeight: 600 }}>{customers.find(c => (c.customerId || c.CustomerId) === (selectedOrder.customerId || selectedOrder.CustomerId))?.ten || 'N/A'}</p>
                <p style={{ fontSize: '0.875rem' }}>{customers.find(c => (c.customerId || c.CustomerId) === (selectedOrder.customerId || selectedOrder.CustomerId))?.soDienThoai || ''}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>Ngày đặt</p>
                <p style={{ fontWeight: 600 }}>{new Date(selectedOrder.ngayBan).toLocaleString('vi-VN')}</p>
              </div>
            </div>

            <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderDetails?.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={getImageUrl(products.find(p => (p.productId || p.ProductId) === (item.productId || item.ProductId))?.hinhAnh)} 
                            style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} 
                          />
                          <span>{products.find(p => (p.productId || p.ProductId) === (item.productId || item.ProductId))?.tenBanh || `Sản phẩm #${item.productId}`}</span>
                        </div>
                      </td>
                      <td>{item.soLuong}</td>
                      <td>{item.gia.toLocaleString()}đ</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{(item.soLuong * item.gia).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <p style={{ fontSize: '1rem', opacity: 0.8 }}>Tổng cộng</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{selectedOrder.tongTien.toLocaleString()}đ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
