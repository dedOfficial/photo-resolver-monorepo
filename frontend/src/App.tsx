import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const App: React.FC = () => {
    const isAuthenticated = !!sessionStorage.getItem('accessToken');

    return (
        <Router>
            <React.Suspense fallback={<div>Загрузка...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/home"
                        element={
                            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
                        }
                        />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </React.Suspense>
        </Router>
    );
};

export default App;
