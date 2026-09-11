import type { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { Session } from './session';
import axios from 'axios';

export { Session };
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Garante que toda requisição Axios tenha o token de autenticação no header
function injectTokenInterceptor(config: InternalAxiosRequestConfig) {
  if (config.url?.startsWith('/auth')) return config;
  const token = Session.AuthToken;

  if (!Session.isAuthenticated()) {
    Session.logoutAndRedirect();
    return Promise.reject(new Error('Sessão expirada'));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
}

// Garante que o token seja renovado automaticamente ao receber 401 (Unauthorized)
async function refreshTokenInterceptor(error: AxiosError) {
  const originalRequest = error.config;
  if (originalRequest.url?.startsWith('/auth')) {
    return Promise.reject(error);
  }

  if (error.response?.status !== 401 || originalRequest.headers.get('_retry')) {
    return Promise.reject(error);
  }
  originalRequest.headers.set('_retry', 'true');

  // Lógica de renovação /auth/refresh (ainda não implementada no backend)
  return Promise.reject(error);
}

api.interceptors.request.use(injectTokenInterceptor, (error) => Promise.reject(error));
api.interceptors.response.use((response) => response, refreshTokenInterceptor);
