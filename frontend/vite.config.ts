import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        host: true,
        port: 4000, // или любой другой порт по твоему усмотрению
    },
    preview: {
        host: true,  // слушаем на всех интерфейсах в режиме предпросмотра
        port: 4000,  // явно задаём порт для preview
    },
});