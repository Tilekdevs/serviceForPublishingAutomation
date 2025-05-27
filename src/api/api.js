import axios from 'axios';

const API = axios.create({
  baseURL: 'http://77.105.133.23:8087/swagger-ui/index.html#/',
});

// Авторизация
export const login = (credentials) => API.post('/auth/login', credentials);

// Посты
export const getPosts = (userId) => API.get(`/posts/${userId}`);
export const createPost = (userId, data) => API.post(`/posts/${userId}`, data);
export const deletePost = (userId, postId) => API.delete(`/posts/${userId}/${postId}`);

// Каналы
export const getChannels = (userId) => API.get(`/channels/${userId}`);
export const addChannel = (userId, data) => API.post(`/channels/${userId}`, data);
export const deleteChannel = (userId) => API.delete(`/channels/${userId}`);
