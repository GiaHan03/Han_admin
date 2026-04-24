import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Lock, User, UserPlus, AlertCircle, Phone, MapPin, Briefcase } from 'lucide-react';
import { api } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    employeeCode: '',
    phone: '',
    address: '',
    position: 'Staff',
    birthday: '2000-01-01'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.auth.register(formData);
      alert('Đăng ký tài khoản nhân viên thành công!');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-glow"></div>
      <div className="login-card animate-fade-in" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <div className="login-logo">
            <Package size={32} />
          </div>
          <h1>Đăng ký nhân viên</h1>
          <p>Tạo tài khoản quản lý mới</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Họ và Tên</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <User size={16} />
              <input
                type="text"
                required
                className="form-input"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type="password"
                required
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mã Nhân viên</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="VD: NV01"
              value={formData.employeeCode}
              onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <div className="input-with-icon">
              <Phone size={16} />
              <input
                type="text"
                required
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Địa chỉ</label>
            <div className="input-with-icon">
              <MapPin size={16} />
              <input
                type="text"
                required
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Chức vụ</label>
            <div className="input-with-icon">
              <Briefcase size={16} />
              <select 
                className="form-input"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              >
                <option value="Staff">Nhân viên</option>
                <option value="Manager">Quản lý</option>
                <option value="Baker">Thợ bánh</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              required
              className="form-input"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ gridColumn: 'span 2', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : (
              <>
                <UserPlus size={18} />
                Đăng ký ngay
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
