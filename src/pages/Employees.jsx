import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Contact } from 'lucide-react';
import { api } from '../services/api';

const Employees = ({ showToast }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    employeeCode: '', 
    birthday: '',
    phone: '',
    address: '',
    position: '',
    username: '',
    password: ''
  });

  const fetchEmployees = async () => {
    try {
      const data = await api.employees.getAll();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      // Format date for input type="date" (YYYY-MM-DD)
      const date = employee.birthday ? new Date(employee.birthday).toISOString().split('T')[0] : '';
      setFormData({ 
        fullName: employee.fullName, 
        employeeCode: employee.employeeCode, 
        birthday: date,
        phone: employee.phone || '',
        address: employee.address || '',
        position: employee.position || '',
        username: employee.username || '',
        password: employee.password || ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({ 
        fullName: '', 
        employeeCode: '', 
        birthday: '',
        phone: '',
        address: '',
        position: '',
        username: '',
        password: ''
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.employees.update(editingEmployee.id, { ...formData, id: editingEmployee.id });
      } else {
        await api.employees.create(formData);
      }
      setModalOpen(false);
      fetchEmployees();
      if (typeof showToast === 'function') showToast(editingEmployee ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên mới thành công!');
    } catch (error) {
      if (typeof showToast === 'function') showToast(error.message, 'error');
      else alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await api.employees.delete(id);
        setEmployees(prev => prev.filter(e => (e.id || e.Id) != id));
        if (typeof showToast === 'function') showToast('Xóa nhân viên thành công!', 'success');
      } catch (error) {
        if (typeof showToast === 'function') showToast(error.message, 'error');
        else alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="page-title">
          <h1>Quản lý Nhân viên</h1>
          <p>Hệ thống quản lý thông tin nhân viên</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Thêm nhân viên
        </button>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
               <th>ID</th>
               <th>Mã NV</th>
               <th>Họ tên</th>
               <th>Chức vụ</th>
               <th>SĐT</th>
               <th>Ngày sinh</th>
               <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
             {loading ? (
               <tr><td colSpan="7" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
             ) : employees.length === 0 ? (
               <tr><td colSpan="7" style={{ textAlign: 'center' }}>Chưa có nhân viên nào</td></tr>
            ) : employees.map((e) => (
              <tr key={e.id}>
                 <td>#{e.id}</td>
                 <td>{e.employeeCode}</td>
                 <td style={{ fontWeight: 500 }}>{e.fullName}</td>
                 <td><span className="badge">{e.position || 'N/A'}</span></td>
                 <td>{e.phone}</td>
                 <td>{e.birthday ? new Date(e.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => handleOpenModal(e)}>
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.4rem', color: '#ef4444' }}
                      onClick={() => handleDelete(e.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-fade-in">
            <h2>{editingEmployee ? 'Sửa thông tin' : 'Thêm nhân viên mới'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Mã nhân viên</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({...formData, employeeCode: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Họ tên</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
               <div className="form-group">
                 <label>Ngày sinh</label>
                 <input 
                   type="date" 
                   className="form-input" 
                   value={formData.birthday}
                   onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                 />
               </div>
               <div className="form-group">
                 <label>Số điện thoại</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   required
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 />
               </div>
               <div className="form-group">
                 <label>Địa chỉ</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   required
                   value={formData.address}
                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                 />
               </div>
               <div className="form-group">
                 <label>Chức vụ</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   required
                   value={formData.position}
                   onChange={(e) => setFormData({...formData, position: e.target.value})}
                 />
               </div>
               <div className="form-group">
                 <label>Tên đăng nhập</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   required
                   value={formData.username}
                   onChange={(e) => setFormData({...formData, username: e.target.value})}
                 />
               </div>
               <div className="form-group">
                 <label>Mật khẩu</label>
                 <input 
                   type="password" 
                   className="form-input" 
                   required
                   value={formData.password}
                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                 />
               </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
