import { api } from './client.js';

export const auditoriaApi = {
  listar: () => api.get('/auditoria'),
};
