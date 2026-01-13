// superadminApi.js

const API_BASE = 'https://farm-ferry-backend-new.vercel.app/api/v1' + '/superadmin';

export async function getProfile() {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  const res = await fetch(`${API_BASE}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data) {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function changePassword({ currentPassword, newPassword, confirmPassword }) {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  const res = await fetch(`${API_BASE}/change-password`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
  if (!res.ok) throw new Error('Failed to change password');
  return res.json();
}

export async function uploadAvatar(file) {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${API_BASE}/avatar`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
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

export async function getNotifications() {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  // API_BASE is .../api/v1/superadmin
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationRead(id, markAll = false) {
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  const res = await fetch(`${API_BASE}/notifications`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, markAll }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to mark notification read');
  return res.json();
}