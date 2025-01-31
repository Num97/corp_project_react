import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import RecoveryBlock from './components/Login/RecoveryBlock/RecoveryBlock';

// Компонент для проверки токена
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Проверяем наличие токена в localStorage
  if (!token) {
    return <Navigate to="/login" replace />; // Перенаправляем на страницу логина
  }
  return children; // Если токен есть, рендерим переданный компонент
};

function App() {
  return (
    <div>
      <Routes>
        {/* Защищённый маршрут */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<RecoveryBlock/>} />
      </Routes>
    </div>
  );
}

export default App;
