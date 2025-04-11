import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const mutation = useMutation<any, Error, { email: string; password: string; confirmPassword: string }>({
        mutationFn: async (data: { email: string; password: string; confirmPassword: string }) => {
            const response = await apiClient.post('/auth/register', data);
            return response.data;
        },
        onSuccess: () => {
            alert('Регистрация прошла успешно! Теперь войдите в систему.');
            navigate('/login');
        },
        onError: (error: any) => {
            alert(`Ошибка регистрации: ${error.response?.data?.message || error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        mutation.mutate({ email, password, confirmPassword });
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>Регистрация</h2>
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
                <div>
                    <label>Подтверждение пароля:</label>
                    <br />
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <br />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
