import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Upload } from 'lucide-react';
import { api } from '../services/api';
import { getImageUrl } from '../utils/helpers';

const Products = ({ user, showToast }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const isManager = user?.position === 'Manager';
  const [formData, setFormData] = useState({ 
    tenBanh: '', 
    gia: '', 
    soLuong: '', 
    categoryId: '', 
    brandId: '',
    hinhAnh: '',
    moTa: ''
  });

  const fetchData = async () => {
    try {
      const [pData, cData, bData] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
        api.brands.getAll()
      ]);
      setProducts(pData);
      setCategories(cData);
      setBrands(bData);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        tenBanh: product.tenBanh,
        gia: product.gia,
        soLuong: product.soLuong,
        categoryId: product.categoryId || product.CategoryId,
        brandId: product.brandId || product.BrandId,
        hinhAnh: product.hinhAnh || '',
        moTa: product.moTa || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ 
        tenBanh: '', 
        gia: '', 
        soLuong: '', 
        categoryId: categories[0]?.categoryId || '',
        brandId: brands[0]?.brandId || '',
        hinhAnh: '',
        moTa: ''
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const idToUpdate = editingProduct.productId || editingProduct.ProductId;
        await api.products.update(idToUpdate, { ...formData, productId: idToUpdate });
      } else {
        await api.products.create(formData);
      }
      setModalOpen(false);
      fetchData();
      showToast(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
    } catch (error) {
      showToast('Lỗi: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await api.products.delete(id);
        setProducts(prev => prev.filter(p => (p.productId || p.ProductId) != id));
        if (typeof showToast === 'function') showToast('Xóa sản phẩm thành công!', 'success');
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
          <h1>Quản lý Sản phẩm</h1>
          <p>Danh sách các loại bánh trong cửa hàng</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </header>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="form-input" 
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <button className="btn btn-outline">
          <Filter size={18} />
          Lọc
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên Bánh</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
            ) : products.map((p) => (
              <tr key={p.productId || p.ProductId}>
                <td>#{p.productId || p.ProductId}</td>
                <td>
                  <img 
                    src={getImageUrl(p.hinhAnh)} 
                    alt={p.tenBanh} 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ fontWeight: 500 }}>{p.tenBanh}</td>
                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.gia)}</td>
                <td>
                  <span className={`badge ${p.soLuong > 10 ? 'badge-success' : 'badge-warning'}`}>
                    {p.soLuong} cái
                  </span>
                </td>
                <td>{p.category?.tenDanhMuc || 'N/A'}</td>
                <td>{p.brand?.tenThuongHieu || 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => handleOpenModal(p)}>
                      <Edit2 size={16} />
                    </button>
                    {isManager && (
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#ef4444' }} onClick={() => handleDelete(p.productId || p.ProductId)}>
                        <Trash2 size={16} />
                      </button>
                    )}
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
            <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Tên Bánh</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.tenBanh}
                  onChange={(e) => setFormData({...formData, tenBanh: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Giá (VND)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  required 
                  value={formData.gia}
                  onChange={(e) => setFormData({...formData, gia: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Số lượng</label>
                <input 
                  type="number" 
                  className="form-input" 
                  required 
                  value={formData.soLuong}
                  onChange={(e) => setFormData({...formData, soLuong: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <select 
                  className="form-input" 
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>{c.tenDanhMuc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Thương hiệu</label>
                <select 
                  className="form-input" 
                  required
                  value={formData.brandId}
                  onChange={(e) => setFormData({...formData, brandId: e.target.value})}
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map(b => (
                    <option key={b.brandId} value={b.brandId}>{b.tenThuongHieu}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Hình ảnh sản phẩm</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img 
                    src={getImageUrl(formData.hinhAnh)} 
                    alt="Preview" 
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      id="file-upload"
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
                    <label htmlFor="file-upload" className="btn btn-outline" style={{ width: '100%', cursor: 'pointer' }}>
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
              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={formData.moTa}
                  onChange={(e) => setFormData({...formData, moTa: e.target.value})}
                  placeholder="Nhập mô tả sản phẩm..."
                ></textarea>
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

export default Products;
