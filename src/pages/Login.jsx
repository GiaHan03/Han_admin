import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.auth.login(credentials);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLoginSuccess(response.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-glow"></div>
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <Package size={32} />
          </div>
          <h1>Han Admin</h1>
          <p>Hệ thống quản lý cửa hàng bánh</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <div className="input-with-icon">
              <User size={18} />
              <input
                type="text"
                required
                className="form-input"
                placeholder="Nhập username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                required
                className="form-input"
                placeholder="Nhập mật khẩu"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang xác thực...' : (
              <>
                <LogIn size={18} />
                Đăng nhập
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký nhân viên mới</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
