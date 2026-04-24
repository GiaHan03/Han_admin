import React, { useState } from 'react';
import { User, Lock, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

const Settings = ({ user, onUpdateUser, showToast }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    address: user.address || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.updateProfile(user.id || user.employeeId, formData);
      localStorage.setItem('user', JSON.stringify(res.user));
      onUpdateUser(res.user);
      showToast('Cập nhật hồ sơ thành công!', 'success');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="page-title">
          <h1>Cài đặt hệ thống</h1>
          <p>Quản lý hồ sơ cá nhân và cấu hình tài khoản.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="table-container" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: 700,
            color: '#000',
            boxShadow: '0 8px 24px var(--primary-glow)'
          }}>
            {user.fullName.charAt(0)}
          </div>
          <h2>{user.fullName}</h2>
          <p style={{ opacity: 0.6, marginBottom: '1.5rem' }}>{user.position}</p>
          <div className="badge badge-primary">
            <ShieldCheck size={14} style={{ marginRight: '4px' }} /> 
            {user.position === 'Manager' ? 'Quản trị viên' : 'Nhân viên'}
          </div>
        </div>

        <div className="table-container" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} className="auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Họ và Tên</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <div className="input-with-icon">
                  <Phone size={18} />
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Địa chỉ</label>
                <div className="input-with-icon">
                  <MapPin size={18} />
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
              
              <div style={{ gridColumn: 'span 2', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Đổi mật khẩu</h3>
              </div>

              <div className="form-group">
                <label>Mật khẩu mới</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Để trống nếu không muốn đổi"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input 
                    type="password" 
                    className="form-input" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={18} />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
