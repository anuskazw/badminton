const IS_STATIC = process.env.NODE_ENV === 'production';

// --- Capa estática (producción / GitHub Pages) ---

let _dbCache = null;

const fetchStaticDb = async () => {
  if (!_dbCache) {
    const res = await fetch(`${process.env.PUBLIC_URL}/database.json`);
    if (!res.ok) throw new Error('No se pudo cargar la base de datos estática');
    _dbCache = await res.json();
  }
  return _dbCache;
};

function resolveStatic(db, endpoint) {
  const [pathPart, qs] = endpoint.split('?');
  const [collectionName, id] = pathPart.split('/');
  const collection = db[collectionName];
  if (!collection) throw new Error(`Colección no encontrada: ${collectionName}`);

  if (id !== undefined) {
    const item = collection.find(x => String(x.id) === String(id));
    if (!item) throw new Error(`No encontrado: ${collectionName}/${id}`);
    return item;
  }

  const params = qs ? Object.fromEntries(new URLSearchParams(qs)) : {};
  const entries = Object.entries(params);
  return entries.length
    ? collection.filter(item => entries.every(([k, v]) => String(item[k]) === String(v)))
    : collection;
}

const staticApi = {
  get: async (endpoint) => {
    const db = await fetchStaticDb();
    return resolveStatic(db, endpoint);
  },
  post: () => Promise.resolve({}),
  patch: () => Promise.resolve({}),
  put: () => Promise.resolve({}),
  delete: () => Promise.resolve({}),
};

// --- Capa en vivo (desarrollo, con json-server) ---

const BASE_URL = 'http://localhost:3001';

const request = (endpoint, options = {}) =>
  fetch(`${BASE_URL}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }).then(res => {
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  });

const liveApi = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  patch: (endpoint, id, data) => request(`${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  put: (endpoint, id, data) => request(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, id) => request(`${endpoint}/${id}`, { method: 'DELETE' }),
};

export default IS_STATIC ? staticApi : liveApi;
