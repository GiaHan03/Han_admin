import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { api } from '../services/api';
import { getImageUrl } from '../utils/helpers';

const Categories = ({ showToast }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ tenDanhMuc: '', hinhAnh: '' });

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const idToUpdate = editingCategory.categoryId || editingCategory.CategoryId;
        await api.categories.update(idToUpdate, { ...formData, categoryId: idToUpdate });
      } else {
        await api.categories.create(formData);
      }
      setModalOpen(false);
      fetchCategories();
      if (typeof showToast === 'function') showToast(editingCategory ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục mới thành công!');
    } catch (error) {
      if (typeof showToast === 'function') showToast(error.message, 'error');
      else alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await api.categories.delete(id);
        setCategories(prev => prev.filter(c => (c.categoryId || c.CategoryId) != id));
        if (typeof showToast === 'function') showToast('Xóa danh mục thành công!', 'success');
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
          <h1>Danh mục</h1>
          <p>Quản lý phân loại sản phẩm</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setFormData({tenDanhMuc: '', hinhAnh: ''}); setModalOpen(true); }}>
          <Plus size={18} />
          Thêm danh mục
        </button>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
               <th>ID</th>
               <th>Ảnh</th>
               <th>Tên Danh mục</th>
               <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
            ) : categories.map((c) => (
               <tr key={c.categoryId || c.CategoryId}>
                 <td>#{c.categoryId || c.CategoryId}</td>
                 <td>
                   <img 
                     src={getImageUrl(c.hinhAnh)} 
                     alt={c.tenDanhMuc} 
                     style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                   />
                 </td>
                 <td style={{ fontWeight: 500 }}>{c.tenDanhMuc}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => { setEditingCategory(c); setFormData({tenDanhMuc: c.tenDanhMuc, hinhAnh: c.hinhAnh || ''}); setModalOpen(true); }}>
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.4rem', color: '#ef4444' }}
                      onClick={() => handleDelete(c.categoryId || c.CategoryId)}
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
                   onChange={(e) => setFormData({...formData, tenDanhMuc: e.target.value})}
                 />
               </div>
               <div className="form-group">
                 <label>Hình ảnh danh mục</label>
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                   <img 
                     src={getImageUrl(formData.hinhAnh)} 
                     alt="Preview" 
                     style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                   />
                   <div style={{ flex: 1 }}>
                     <input 
                       type="file" 
                       id="category-file-upload"
                       style={{ display: 'none' }}
                       onChange={async (e) => {
                         const file = e.target.files[0];
                         if (file) {
                           try {
                             const res = await api.files.upload(file);
                             setFormData({ ...formData, hinhAnh: res.url });
                           } catch (err) {
                             alert('Lỗi upload: ' + err.message);
                           }
                         }
                       }}
                     />
                     <label htmlFor="category-file-upload" className="btn btn-outline" style={{ width: '100%', cursor: 'pointer' }}>
                       <Upload size={16} /> Chọn ảnh từ máy
                     </label>
                   </div>
                 </div>
                 <input 
                   type="text" 
                   className="form-input" 
                   style={{ marginTop: '0.5rem' }}
                   value={formData.hinhAnh}
                   onChange={(e) => setFormData({...formData, hinhAnh: e.target.value})}
                   placeholder="Hoặc dán URL ảnh tại đây"
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
