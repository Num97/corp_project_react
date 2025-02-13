import Header from "../components/MainPage/Header/Header"
import WorkerTable from "../components/MainPage/WorkerTable/WorkerTable"
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Account from "../pages/Account";
import { jwtDecode } from 'jwt-decode';
import AddUser from '../pages/AddUser';

function getUserDepartment() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Токен отсутствует в localStorage");
    return "";
  }

  try {
    const decoded = jwtDecode(token);
    return decoded.department || "";
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return "";
  }
}

const ProtectedRouteHR = ({ children }) => {
  // Получаем токен из localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />; // Если токена нет, перенаправляем на логин
  }

  try {
    // Декодируем токен (если он в формате JWT)
    const userDepartment = getUserDepartment(); // Получаем department из токена

    // Проверяем, есть ли в токене department и равен ли он "Служба управления персоналом"
    const hasAccess = token && userDepartment === 'Служба управления персоналом';

    // Если доступ есть, отображаем children (защищённый компонент)
    // Если доступа нет, перенаправляем на главную страницу
    return hasAccess ? children : <Navigate to="/account" replace />;
  } catch (error) {
    console.error('Ошибка при декодировании токена:', error);
    return <Navigate to="/login" replace />; // В случае ошибки перенаправляем на логин
  }
};

function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value) => {
    setSearchQuery(value); // Обновляем состояние строки поиска
  };


  return (
    <div>
      <Header onSearchChange={handleSearchChange}/>
      <main>
          <Routes>
          <Route 
            path="/" 
            element={<WorkerTable searchQuery={searchQuery} apiUrl="/api/v1/workers" />} 
          />
            <Route path="/account" element={<Account/>} />
                    {/* Защищенный маршрут для HR */}
                    <Route
                      path="/add_user"
                      element={
                        <ProtectedRouteHR>
                          <AddUser />
                        </ProtectedRouteHR>
                      }
                    />

          </Routes>
      </main>
    </div>
  )
}

export default MainPage