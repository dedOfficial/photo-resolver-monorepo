import axios from 'axios';

// Настроим axios с базовым адресом API Gateway
const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
});

// Добавим интерсептор для установки токена в заголовке, если он есть
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;