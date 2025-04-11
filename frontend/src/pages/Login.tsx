import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const mutation = useMutation<any, Error, { email: string; password: string }>({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await apiClient.post('/auth/login', data);
            return response.data;
        },
        onSuccess: (data) => {
            // Сохраним токен, если он получен
            sessionStorage.setItem('accessToken', data.accessToken);
            sessionStorage.setItem('user', data.user);
            navigate('/home');
        },
        onError: (error: Error) => {
            alert(`Ошибка аутентификации: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>Войти</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <br />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label>Пароль:</label>
                    <br />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <br />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;
