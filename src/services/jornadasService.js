import api from './api';

export const getJornadas = (temporada) =>
  api.get(`jornadas?temporada=${encodeURIComponent(temporada)}`);

export const getJornadasModalidad = (temporada, modalidad) =>
  api.get(`jornadas?temporada=${encodeURIComponent(temporada)}&modalidad=${encodeURIComponent(modalidad)}`);

export const buscarPartido = (temporada, modalidad, jornada) =>
  api.get(
    `jornadas?temporada=${encodeURIComponent(temporada)}`
    + `&modalidad=${encodeURIComponent(modalidad)}`
    + `&jornada=${jornada}`
  );

export const addPartido = (partido) => api.post('jornadas', partido);
export const updatePartido = (id, datos) => api.patch('jornadas', id, datos);
export const deleteJornada = (id) => api.delete('jornadas', id);
