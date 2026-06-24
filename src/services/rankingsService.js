import api from './api';

export const getRankings = (temporada) =>
  api.get(`rankings?temporada=${encodeURIComponent(temporada)}`);

export const getRankingsByTipo = (temporada, tipo) =>
  api.get(`rankings?temporada=${encodeURIComponent(temporada)}&tipo=${encodeURIComponent(tipo)}`);

export const addRanking = (entrada) => api.post('rankings', entrada);

export const updateRanking = (id, datos) => api.patch('rankings', id, datos);
