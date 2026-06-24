import api from './api';

export const getJugadores = () => api.get('jugadores');
export const getJugador = (id) => api.get(`jugadores/${id}`);
export const addJugador = (j) => api.post('jugadores', j);
