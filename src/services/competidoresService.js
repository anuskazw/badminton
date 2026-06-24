import api from './api';

export const getCompetidores = (temporada) =>
  api.get(`participantes?temporada=${encodeURIComponent(temporada)}`);

export const actualizarPista = (id, pista) => api.patch('participantes', id, { pista });
