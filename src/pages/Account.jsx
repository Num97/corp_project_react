import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import InfoEditRow from '../components/Account/InfoEditRow';
import ImageLoader from '../components/MainPage/ImageLoader/ImageLoader';
import './PagesStyle/Account.css';
import editButton from '/editButton.svg';
import WorkerTable from '../components/MainPage/WorkerTable/WorkerTable'

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(''); // Новое состояние для уведомления
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

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setMessage(''); // Скрываем сообщение при новом редактировании
  };

const handleSave = (workerId) => {
  if (tableRef.current) {
      const inputs = tableRef.current.querySelectorAll('input');
      const formData = { id: workerId }; // Добавляем worker_id

      inputs.forEach((input) => {
          const value = input.value.trim();
          formData[input.name] = {
              String: value === "" ? "" : value, // Пустые строки оставляем пустыми
              Valid: value !== "" // Valid = true, если значение не пустое
          };
      });

      console.log("Отправляемые данные:", JSON.stringify(formData, null, 2));

      // Отправляем данные на сервер
      fetch('http://10.90.25.125:5002/api/v1/waiting_edit_list_add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(({ status, body }) => {
          if (status === 200) {
              console.log('Success:', body);
              setMessage('Данные отправлены на модерацию');
          } else {
              console.error('Ошибка:', body);
              setMessage(`Ошибка: ${body.error || "Неизвестная ошибка"}`);
          }
      })
      .catch((error) => {
          console.error('Ошибка сети:', error);
          setMessage('Ошибка сети при отправке данных');
      });

      // Закрываем режим редактирования
      setIsEditing(false);
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
        /></div>
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
      <WorkerTable searchQuery='' apiUrl="http://10.90.25.125:5002/api/v1/waiting_list_user_get/51" />
    </>
  );
}
