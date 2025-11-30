
import axios from 'axios';

// Detecta URL automaticamente
// Em produção, a API estará em /api (proxy do Nginx)
// Em desenvolvimento local, assume porta 3000
const baseURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar Token JWT automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('katalogo_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper para tratar erros
export const handleApiError = (error: any) => {
    console.error("API Error:", error);
    return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Erro de conexão' 
    };
};
