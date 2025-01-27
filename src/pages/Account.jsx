import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Account() {
  const [firstname, setFirstname] = useState('');

  useEffect(() => {
    // Получаем токен из локального хранилища
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Декодируем токен
        const decodedToken = jwtDecode(token);
        
        // Извлекаем username из токена
        if (decodedToken.username) {
          setFirstname(decodedToken.firstname);
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);  // useEffect с пустым массивом зависимостей для вызова только при монтировании компонента

  return (
    <div>
      <h1>Добро пожаловать, {firstname || 'Guest'}!</h1>
    </div>
  );
}