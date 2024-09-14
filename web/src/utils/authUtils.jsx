import axios from 'axios';
import { store } from '../redux/store.js'
import { signInSuccess, signOut } from '../redux/user/userSlice.js';

export const refreshToken = async () => {
  try {
    const response = await axios.post('/api/auth/refresh-token', {}, {
      withCredentials: true
    });
    
    const { token } = response.data;
    
    store.dispatch(signInSuccess({ ...store.getState().user.currentUser, token }));
    
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    store.dispatch(signOut());
    throw error;
  }
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};