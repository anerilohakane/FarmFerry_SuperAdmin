// superadminApi.js

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'}/api/v1/superadmin`;

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