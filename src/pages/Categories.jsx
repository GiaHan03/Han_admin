import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ tenDanhMuc: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.categories.getAll();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.categories.update(editingCategory.categoryId, { ...formData, categoryId: editingCategory.categoryId });
      } else {
        await api.categories.create(formData);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await api.categories.delete(id);
        fetchCategories();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="page-title">
          <h1>Danh mục</h1>
          <p>Quản lý phân loại sản phẩm</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setFormData({tenDanhMuc: ''}); setModalOpen(true); }}>
          <Plus size={18} />
          Thêm danh mục
        </button>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
            ) : categories.map((c) => (
              <tr key={c.categoryId}>
                <td>#{c.categoryId}</td>
                <td style={{ fontWeight: 500 }}>{c.tenDanhMuc}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => { setEditingCategory(c); setFormData({tenDanhMuc: c.tenDanhMuc}); setModalOpen(true); }}>
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.4rem', color: '#ef4444' }}
                      onClick={() => handleDelete(c.categoryId)}
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
            <h2>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Tên Danh mục</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.tenDanhMuc}
                  onChange={(e) => setFormData({tenDanhMuc: e.target.value})}
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

export default Categories;
