// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const e = error as any;

    if (e?.isAxiosError === true || (e && typeof e === 'object' && 'response' in e)) {
      console.error('Error en la API (axios):', e.response?.data ?? e.message);
    } else {
      console.error('Error no-axios en la API:', (error as Error)?.message ?? error);
    }

    return Promise.reject(error);
  }
);

export default api;
