const API_BASE_URL = 'http://localhost:5023/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      error = { message: text || 'Something went wrong' };
    }
    throw new Error(error.message || response.statusText);
  }
  if (response.status === 204) return null;
  
  const text = await response.text();
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const api = {
  // Employees
  employees: {
    getAll: () => fetch(`${API_BASE_URL}/employees`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/employees/${id}`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  // Products
  products: {
    getAll: () => fetch(`${API_BASE_URL}/product`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/product/${id}`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/product/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  // Categories
  categories: {
    getAll: () => fetch(`${API_BASE_URL}/category`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/category/${id}`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/category/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/category/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  // Brands
  brands: {
    getAll: () => fetch(`${API_BASE_URL}/brand`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/brand/${id}`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/brand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/brand/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/brand/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  // Customers
  customers: {
    getAll: () => fetch(`${API_BASE_URL}/customer`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/customer/${id}`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/customer/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  // Orders
  orders: {
    getAll: () => fetch(`${API_BASE_URL}/order`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/order/${id}`).then(handleResponse),
    updateStatus: (id, status) => fetch(`${API_BASE_URL}/order/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status),
    }).then(handleResponse),
    updatePayment: (id, status) => fetch(`${API_BASE_URL}/order/${id}/payment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status),
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/order/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  // Dashboard
  dashboard: {
    getStats: () => fetch(`${API_BASE_URL}/dashboard/stats`).then(handleResponse),
  },

  // Auth
  auth: {
    login: (credentials) => fetch(`${API_BASE_URL}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse),
    register: (data) => fetch(`${API_BASE_URL}/account/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    updateProfile: (id, data) => fetch(`${API_BASE_URL}/account/update-profile/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  },

  // Files
  files: {
    upload: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      }).then(handleResponse);
    }
  }
};
