// superadminApi.js

const API_BASE = (process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api/v1'
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://farm-ferry-backend-new.vercel.app/api/v1')) + '/superadmin';

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function changePassword({ currentPassword, newPassword, confirmPassword }) {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
  if (!res.ok) throw new Error('Failed to change password');
  return res.json();
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${API_BASE}/avatar`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload avatar');
  return res.json();
}

export async function getCustomers(page = 1, limit = 10, search = '') {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  // API_BASE is .../api/v1/superadmin, so valid path is replace /superadmin with /admin
  const baseUrl = API_BASE.replace('/superadmin', '/admin');
  const res = await fetch(`${baseUrl}/customers?page=${page}&limit=${limit}&search=${search}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Get Customers Failed:', res.status, errorText);
    throw new Error(`Failed to fetch customers: ${res.statusText}`);
  }
  return res.json();
}

export async function getSuppliers(page = 1, limit = 10, search = '', status = '') {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  const baseUrl = API_BASE.replace('/superadmin', '/admin');
  const res = await fetch(`${baseUrl}/suppliers?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch suppliers');
  return res.json();
}

export async function getDeliveryAssociates(page = 1, limit = 10, search = '', status = '') {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  const baseUrl = API_BASE.replace('/superadmin', '/admin');
  const res = await fetch(`${baseUrl}/delivery-associates?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch delivery associates');
  return res.json();
}