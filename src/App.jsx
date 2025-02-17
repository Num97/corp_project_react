import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import RecoveryBlock from './components/Login/RecoveryBlock/RecoveryBlock';

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Получаем payload
    if (!base64Url) return null; // Если нет payload — ошибка

    // Декодируем Base64URL в Base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Дополняем '=' до кратности 4 (иначе `atob()` ломается)
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

    return JSON.parse(atob(paddedBase64));
  } catch (error) {
    return null; // Если ошибка декодирования
  }
};

const isTokenValid = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return false;

  const expirationTime = payload.exp * 1000; // Преобразуем в миллисекунды
  return expirationTime > Date.now(); // Проверяем, не истёк ли токен
};

// Компонент для проверки токена
// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token'); // Проверяем наличие токена в localStorage
//   if (!token) {
//     return <Navigate to="/login" replace />; // Перенаправляем на страницу логина
//   }
//   return children; // Если токен есть, рендерим переданный компонент
// };

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />; // Перенаправляем, если токена нет или он истёк
  }

  return children; // Если токен валиден, рендерим переданный компонент
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
