import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useMutation, useQuery } from '@tanstack/react-query';

interface ImageInfo {
  id: string;
  status: string;
  uploadDate: string;
  processedUrl?: string;
  originalName: string;
}

const Home: React.FC = () => {
    const userID = sessionStorage.getItem('user');

    const [file, setFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    
    // Мутация для загрузки изображения
    const uploadMutation = useMutation<any, Error, FormData>({
        mutationFn: async (formData: FormData) => {
            const response = await apiClient.post('/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return response.data;
        },
        onError: (error: any) => {
            setUploadError(error.response?.data?.message || error.message);
        },
        onSuccess: (data) => {
            setUploadError('');
            alert('Изображение успешно загружено! Ожидайте обработки.');
        },
    });

    // Запрос для получения информации о последнем изображении (предполагается, что пользователь идентифицируется через JWT)
    // Здесь для демонстрации используем, например, email в качестве части идентификации или фиксированный параметр
    const { data: imageInfo, refetch } = useQuery<ImageInfo>({
        queryKey: ['lastImage'],
        queryFn: async () => {
            // Предположим, что API возвращает информацию о последнем изображении текущего пользователя
            // Если userId передается через токен, сервер должен его подтянуть
            const response = await apiClient.get(`/images/${userID}/last`);

            return response.data;
        },
        enabled: true, // Запрос запускается вручную после загрузки изображения
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    console.log(imageInfo);

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadMutation.mutateAsync(formData);
            // После успешной загрузки можно повторно запросить информацию об изображении
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>Главная страница</h2>
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Загрузить изображение</button>
            </div>
            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
        
            {imageInfo && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Информация об изображении:</h3>
                    <p><strong>ID:</strong> {imageInfo.id}</p>
                    <p><strong>Статус обработки:</strong> {imageInfo.status}</p>
                    <p><strong>Дата загрузки:</strong> {imageInfo.uploadDate}</p>
                    {imageInfo.processedUrl ? (
                        <img src={imageInfo.processedUrl} alt={imageInfo.originalName} style={{ maxWidth: '500px' }} />
                    ) : (
                        <p>Изображение еще обрабатывается...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
