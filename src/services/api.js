const BASE_URL = 'http://localhost:3001';

const request = (endpoint, options = {}) =>
  fetch(`${BASE_URL}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }).then(res => {
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  });

const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  patch: (endpoint, id, data) => request(`${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  put: (endpoint, id, data) => request(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, id) => request(`${endpoint}/${id}`, { method: 'DELETE' }),
};

export default api;
