import api from './api';

export const getTemporadas = () => api.get('temporadas');
export const getTemporada = (id) => api.get(`temporadas/${id}`);
export const addTemporada = (t) => api.post('temporadas', t);
export const updateTemporada = (id, datos) => api.patch('temporadas', id, datos);
export const deleteTemporada = (id) => api.delete('temporadas', id);
