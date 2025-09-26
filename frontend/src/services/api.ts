// src/services/api.js
import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  baseURL: process.env.BACKEND_URL, // URL base da sua API
});

// Adiciona um "interceptor" que será executado antes de cada requisição
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');

    // Se o token existir, adiciona ao cabeçalho de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

export default api;