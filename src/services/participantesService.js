import api from './api';

export const getParticipantes = (temporada, modalidad) => {
  const q = [`temporada=${encodeURIComponent(temporada)}`];
  if (modalidad) q.push(`modalidad=${encodeURIComponent(modalidad)}`);
  return api.get(`participantes?${q.join('&')}`);
};

export const addParticipante = (p) => api.post('participantes', p);
export const updateParticipante = (id, datos) => api.patch('participantes', id, datos);
export const deleteParticipante = (id) => api.delete('participantes', id);
