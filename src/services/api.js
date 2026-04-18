const API_BASE_URL = 'http://localhost:5023/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || response.statusText);
  }
  if (response.status === 204) return null;
  return response.json();
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
    // ... add more if needed
  },

  // Orders
  orders: {
    getAll: () => fetch(`${API_BASE_URL}/order`).then(handleResponse),
  }
};
