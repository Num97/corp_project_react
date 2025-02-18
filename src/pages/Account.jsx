import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import InfoEditRow from '../components/Account/InfoEditRow/InfoEditRow';
import ImageLoader from '../components/MainPage/ImageLoader/ImageLoader';
import './PagesStyle/Account.css';
import editButton from '/images/editButton.svg';
import WorkerTable from '../components/MainPage/WorkerTable/WorkerTable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [isApiAvailableAllUsers, setIsApiAvailableAllUsers] = useState(false);
  const [tableKey, setTableKey] = useState(0);  // Используем ключ для принудительного рендера
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Декодируем токен, чтобы получить id
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;

          if (userId) {
            // Запрашиваем данные о пользователе с сервера
            const response = await axios.get(`/api/v1/worker?id=${userId}`);
            const workerData = response.data[0]; // Извлекаем первый элемент массива
          
            // Обновляем состояние с полученными данными
            setUserData({
              id: workerData.id,
              department: { String: workerData.department.String, Valid: workerData.department.Valid },
              position: { String: workerData.position.String, Valid: workerData.position.Valid },
              surname: { String: workerData.surname.String, Valid: workerData.surname.Valid },
              first_name: { String: workerData.first_name.String, Valid: workerData.first_name.Valid },
              second_name: { String: workerData.second_name.String, Valid: workerData.second_name.Valid },
              outside_number: { String: workerData.outside_number.String, Valid: workerData.outside_number.Valid },
              inside_number: { String: workerData.inside_number.String, Valid: workerData.inside_number.Valid },
              first_mobile_number: { String: workerData.first_mobile_number.String, Valid: workerData.first_mobile_number.Valid },
              second_mobile_number: { String: workerData.second_mobile_number.String, Valid: workerData.second_mobile_number.Valid },
              email: { String: workerData.email.String, Valid: workerData.email.Valid },
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleTableUpdate = (newMessage) => {
    setTableKey((prevKey) => prevKey + 1); // Принудительный рендер
    if (newMessage) {
      setMessage(newMessage); // Устанавливаем сообщение
    }
  };

  // Функция проверки доступности API
  const checkApiAvailability = () => {
    if (!userData?.id) return;

    const apiUrl = `/api/v1/waiting_list_user_get/${userData.id}`;
    
    fetch(apiUrl)
      .then((res) => {
        if (res.ok) {
          setIsApiAvailable(true);
        } else {
          setIsApiAvailable(false);
        }
      })
      .catch(() => setIsApiAvailable(false));
  };

  // Функция проверки доступности API для всех пользователей
  const checkApiAvailabilityAllUsers = () => {
    const apiUrl = `/api/v1/waiting_list_user_get`;
    
    fetch(apiUrl)
      .then((res) => {
        if (res.ok) {
          setIsApiAvailableAllUsers(true);
        } else {
          setIsApiAvailableAllUsers(false);
        }
      })
      .catch(() => setIsApiAvailableAllUsers(false));
  };

  const handleAddUserClick = () => {
    navigate('/add_user');
  };

  // Запускаем проверку API при изменении userData.id и при обновлениях
  useEffect(() => {
    checkApiAvailability();
    checkApiAvailabilityAllUsers();
  }, [userData?.id]); // Перезапускаем при изменении userData.id

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setMessage('');
  };

  const handleSave = async (workerId) => {
    if (tableRef.current) {
      const inputs = tableRef.current.querySelectorAll('input');
      const textData = { id: workerId }; // Текстовые данные
      const fileInput = tableRef.current.querySelector('input[type="file"]');
      const imageFile = fileInput && fileInput.files[0]; // Файл изображения, если есть
  
      // Собираем текстовые данные
      inputs.forEach((input) => {
        if (input.type !== 'file') {
          const value = input.value.trim();
          textData[input.name] = {
            String: value === "" ? "" : value,
            Valid: value !== ""
          };
        }
      });
  
      try {
        // Отправляем текстовые данные на первый эндпоинт
        const textResponse = await fetch('/api/v1/waiting_edit_list_add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(textData),
        });
  
        const textResult = await textResponse.json();
  
        if (textResponse.status !== 200) {
          throw new Error(textResult.error || "Ошибка при отправке текстовых данных");
        }
  
        // Если есть изображение, отправляем его на второй эндпоинт
        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          formData.append('id', workerId); // Можно добавить workerId для связи с текстовыми данными
  
          const imageResponse = await fetch('/api/v1/upload_image_moderation', {
            method: 'POST',
            body: formData,
          });
  
          const imageResult = await imageResponse.json();
  
          if (imageResponse.status !== 200) {
            throw new Error(imageResult.error || "Ошибка при отправке изображения");
          }
        }
  
        // Если всё успешно
        setMessage('Данные отправлены на модерацию');
        checkApiAvailability();
        checkApiAvailabilityAllUsers();
        setTableKey(prevKey => prevKey + 1);
        setIsEditing(false);
      } catch (error) {
        console.error('Ошибка:', error);
        setMessage(error.message || 'Ошибка при отправке данных');
      }
    }
  };

  return (
    <>
      <div className='account-welcome'>
        <h1>Добро пожаловать, {userData ? userData.first_name.String : 'Гость'}!</h1>
        <div>
          <img 
            src={editButton} 
            alt="Edit Button" 
            width={40} 
            onClick={toggleEditMode}
          />
        </div>
        {isEditing && (
          <div className="info-btn-active">
            <button 
              type="button" 
              className="btn btn-primary btn-block btn-large btn-save" 
              onClick={() => handleSave(userData.id)}
            >
              Сохранить
            </button>
          </div>
        )}

      {userData && userData.department.String === 'Служба управления персоналом' && (
        <div className='add-user-block'>
            <button className='add-user-button-navigate' onClick={handleAddUserClick}>Добавить пользователя</button>
        </div>
      )}

        {message && (
          <div className="success-message">
            <h2>{message}</h2>
          </div>
        )}
      </div>

      <div className='account-info-box'>
        {userData && <InfoEditRow data={userData} isEditing={isEditing} ref={tableRef} />}
        <div className='account-image'>
          {userData && <ImageLoader id={userData.id} alt={'Фото'} photoOnly={true} updateTrigger={Math.floor(Date.now() / 300000)}/>}
        </div>
      </div>

      {/* {userData && userData.department.String === 'Служба управления персоналом' && (
      <div className='add-user-block'>
          <button className='add-user-button-navigate' onClick={handleAddUserClick}>Добавить пользователя</button>
      </div>
      )} */}

      {/* Используем ключ для принудительного рендера таблицы */}
      {isApiAvailable && userData?.department.String !== 'Служба управления персоналом' && (
        <div className='info-moderation-user'>
          <h3>Ваши данные на модерации</h3>
          <WorkerTable 
            key={tableKey}  // Принудительно меняем ключ для рендера
            searchQuery='' 
            apiUrl={`/api/v1/waiting_list_user_get/${userData.id}`} 
            onUpdate={handleTableUpdate} 
          />
        </div>
      )}

      {/* Модерация для кадрового отдела */}
      {userData && userData.department.String === 'Служба управления персоналом' && isApiAvailableAllUsers && (
        <div className='info-moderation-user'>
          <h3>Данные пользователей на модерации</h3>
          <WorkerTable 
            searchQuery=''
            key={tableKey} 
            apiUrl={`/api/v1/waiting_list_user_get`}
            onUpdate={handleTableUpdate} 
          />
        </div>
      )}
    </>
  );
}