import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Award, Upload } from 'lucide-react';
import { api } from '../services/api';
import { getImageUrl } from '../utils/helpers';

const Brands = ({ showToast }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ tenThuongHieu: '', moTa: '', hinhAnh: '' });

  const fetchBrands = async () => {
    try {
      const data = await api.brands.getAll();
      setBrands(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ 
        tenThuongHieu: brand.tenThuongHieu, 
        moTa: brand.moTa || '', 
        hinhAnh: brand.hinhAnh || '' 
      });
    } else {
      setEditingBrand(null);
      setFormData({ tenThuongHieu: '', moTa: '', hinhAnh: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        const idToUpdate = editingBrand.brandId || editingBrand.BrandId;
        await api.brands.update(idToUpdate, { ...formData, brandId: idToUpdate });
      } else {
        await api.brands.create(formData);
      }
      setModalOpen(false);
      fetchBrands();
      if (typeof showToast === 'function') showToast(editingBrand ? 'Cập nhật thương hiệu thành công!' : 'Thêm thương hiệu mới thành công!');
    } catch (error) {
      if (typeof showToast === 'function') showToast(error.message, 'error');
      else alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        await api.brands.delete(id);
        setBrands(prev => prev.filter(b => (b.brandId || b.BrandId) != id));
        if (typeof showToast === 'function') showToast('Xóa thương hiệu thành công!', 'success');
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
          <h1>Quản lý Thương hiệu</h1>
          <p>Danh sách các đối tác và thương hiệu bánh</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Thêm thương hiệu
        </button>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Thương hiệu</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Chưa có thương hiệu nào</td></tr>
            ) : brands.map((b) => (
              <tr key={b.brandId || b.BrandId}>
                <td>#{b.brandId || b.BrandId}</td>
                <td>
                  <img 
                    src={getImageUrl(b.hinhAnh)} 
                    alt={b.tenThuongHieu} 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{b.tenThuongHieu}</td>
                <td style={{ fontSize: '0.875rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.moTa || 'Không có mô tả'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => handleOpenModal(b)}>
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.4rem', color: '#ef4444' }}
                      onClick={() => handleDelete(b.brandId || b.BrandId)}
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
            <h2>{editingBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Tên thương hiệu</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.tenThuongHieu}
                  onChange={(e) => setFormData({...formData, tenThuongHieu: e.target.value})}
                  placeholder="Nhập tên thương hiệu..."
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  value={formData.moTa}
                  onChange={(e) => setFormData({...formData, moTa: e.target.value})}
                  placeholder="Nhập mô tả thương hiệu..."
                ></textarea>
              </div>
              <div className="form-group">
                <label>Hình ảnh thương hiệu (Logo)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img 
                    src={getImageUrl(formData.hinhAnh)} 
                    alt="Preview" 
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      id="brand-file-upload"
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
                    <label htmlFor="brand-file-upload" className="btn btn-outline" style={{ width: '100%', cursor: 'pointer' }}>
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

export default Brands;
