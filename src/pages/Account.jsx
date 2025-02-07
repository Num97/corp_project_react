import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import InfoEditRow from '../components/Account/InfoEditRow';
import ImageLoader from '../components/MainPage/ImageLoader/ImageLoader';
import './PagesStyle/Account.css';
import editButton from '/editButton.svg';
import WorkerTable from '../components/MainPage/WorkerTable/WorkerTable';

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [isApiAvailableAllUsers, setIsApiAvailableAllUsers] = useState(false);
  const [tableKey, setTableKey] = useState(0);  // Используем ключ для принудительного рендера
  const tableRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken) {
          setUserData({
            id: decodedToken.id || null,
            department: { String: decodedToken.department || '', Valid: !!decodedToken.department },
            position: { String: decodedToken.position || '', Valid: !!decodedToken.position },
            surname: { String: decodedToken.surname || '', Valid: !!decodedToken.surname },
            first_name: { String: decodedToken.firstname || '', Valid: !!decodedToken.firstname },
            second_name: { String: decodedToken.secondname || '', Valid: !!decodedToken.secondname },
            outside_number: { String: decodedToken.outside_number || '', Valid: !!decodedToken.outside_number },
            inside_number: { String: decodedToken.inside_number || '', Valid: !!decodedToken.inside_number },
            first_mobile_number: { String: decodedToken.first_mobile_number || '', Valid: !!decodedToken.first_mobile_number },
            second_mobile_number: { String: decodedToken.second_mobile_number || '', Valid: !!decodedToken.second_mobile_number },
            email: { String: decodedToken.email || '', Valid: !!decodedToken.email }
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  // const handleTableUpdate = () => {
  //   setTableKey(prevKey => prevKey + 1); // Изменяем ключ для принудительного рендера
  //   console.log("onUpdate вызван!");
  // };

  const handleTableUpdate = (newMessage) => {
    setTableKey((prevKey) => prevKey + 1); // Принудительный рендер
    if (newMessage) {
      setMessage(newMessage); // Устанавливаем сообщение
    }
  };

  // Функция проверки доступности API
  const checkApiAvailability = () => {
    if (!userData?.id) return;

    const apiUrl = `http://localhost:5002/api/v1/waiting_list_user_get/${userData.id}`;
    
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

    // Функция проверки доступности API
    const checkApiAvailabilityAllUsers = () => {
  
      const apiUrl = `http://localhost:5002/api/v1/waiting_list_user_get`;
      
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

  // Запускаем проверку API при изменении userData.id и при обновлениях
  useEffect(() => {
    checkApiAvailability();
    checkApiAvailabilityAllUsers();
  }, [userData?.id]); // Перезапускаем при изменении userData.id

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setMessage('');
  };

  const handleSave = (workerId) => {
    if (tableRef.current) {
      const inputs = tableRef.current.querySelectorAll('input');
      const formData = { id: workerId };
  
      inputs.forEach((input) => {
        const value = input.value.trim();
        formData[input.name] = {
          String: value === "" ? "" : value,
          Valid: value !== ""
        };
      });
  
      const apiUrl = `http://localhost:5002/api/v1/waiting_edit_list_add`;
  
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
          if (status === 200) {
            setMessage('Данные отправлены на модерацию');
  
            // Повторно проверяем доступность API
            checkApiAvailability();
            checkApiAvailabilityAllUsers();
  
            // Обновляем ключ для принудительного рендера
            setTableKey(prevKey => prevKey + 1);
            setIsEditing(false);
          } else {
            console.error('Ошибка:', body);
            setMessage(`Ошибка: ${body.error || "Неизвестная ошибка"}`);
          }
        })
        .catch((error) => {
          console.error('Ошибка сети:', error);
          setMessage('Ошибка сети при отправке данных');
        });
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

        {message && (
          <div className="success-message">
            <h2>{message}</h2>
          </div>
        )}
      </div>

      <div className='account-info-box'>
        {userData && <InfoEditRow data={userData} isEditing={isEditing} ref={tableRef} />}
        <div className='account-image'>
          {userData && <ImageLoader id={userData.id} alt={'Фото'} />}
        </div>
      </div>

      {/* Используем ключ для принудительного рендера таблицы */}
      {isApiAvailable && userData.department.String != 'Служба управления персоналом' && (
        <div className='info-moderation-user'>
          <h3>Ваши данные на модерации</h3>
          <WorkerTable 
            key={tableKey}  // Принудительно меняем ключ для рендера
            searchQuery='' 
            apiUrl={`http://localhost:5002/api/v1/waiting_list_user_get/${userData.id}`} 
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
            apiUrl={`http://localhost:5002/api/v1/waiting_list_user_get`}
            onUpdate={handleTableUpdate} 
          />
        </div>
      )}
    </>
  );
}