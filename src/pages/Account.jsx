// import React, { useEffect, useState, useRef } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import InfoEditRow from '../components/Account/InfoEditRow';
// import ImageLoader from '../components/MainPage/ImageLoader/ImageLoader';
// import './PagesStyle/Account.css';
// import editButton from '/editButton.svg';

// export default function Account() {
//   const [userData, setUserData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const tableRef = useRef(null); // Создаем ref для доступа к input внутри InfoEditRow

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
        
//         if (decodedToken) {
//           setUserData({
//             id: decodedToken.id || null,
//             department: { String: decodedToken.department || '', Valid: !!decodedToken.department },
//             position: { String: decodedToken.position || '', Valid: !!decodedToken.position },
//             surname: { String: decodedToken.surname || '', Valid: !!decodedToken.surname },
//             firstname: { String: decodedToken.firstname || '', Valid: !!decodedToken.firstname },
//             second_name: { String: decodedToken.secondname || '', Valid: !!decodedToken.secondname },
//             outside_number: { String: decodedToken.outside_number || '', Valid: !!decodedToken.outside_number },
//             inside_number: { String: decodedToken.inside_number || '', Valid: !!decodedToken.inside_number },
//             first_mobile_number: { String: decodedToken.first_mobile_number || '', Valid: !!decodedToken.first_mobile_number },
//             second_mobile_number: { String: decodedToken.second_mobile_number || '', Valid: !!decodedToken.second_mobile_number },
//             email: { String: decodedToken.email || '', Valid: !!decodedToken.email }
//           });
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//       }
//     }
//   }, []);

//   const toggleEditMode = () => {
//     setIsEditing((prev) => !prev);
//   };

//   const handleSave = () => {
//     if (tableRef.current) {
//       const inputs = tableRef.current.querySelectorAll('input');
//       const formData = {};
      
//       inputs.forEach((input) => {
//         formData[input.name] = input.value;
//       });

//       console.log('Сохраненные данные:', formData);
//     }
//   };

//   return (
//     <>
//       <div className='account-welcome'>
//         <h1>Добро пожаловать, {userData ? userData.firstname.String : 'Гость'}!</h1>
//         <img 
//           src={editButton} 
//           alt="Edit Button" 
//           width={40} 
//           onClick={toggleEditMode}
//         />
        
//       {isEditing && (
//         <div className="info-btn-active">
//           <button 
//             type="button" 
//             className="btn btn-primary btn-block btn-large btn-save" 
//             onClick={handleSave}
//           >
//             Сохранить
//           </button>
//         </div>
//       )}
//       </div>

//       <div className='account-info-box'>
//         {userData && <InfoEditRow data={userData} isEditing={isEditing} ref={tableRef} />}
//         <div className='account-image'>
//           {userData && <ImageLoader id={userData.id} alt={'Фото'} />}
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import InfoEditRow from '../components/Account/InfoEditRow';
import ImageLoader from '../components/MainPage/ImageLoader/ImageLoader';
import './PagesStyle/Account.css';
import editButton from '/editButton.svg';

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
            firstname: { String: decodedToken.firstname || '', Valid: !!decodedToken.firstname },
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

  const handleSave = () => {
    if (tableRef.current) {
      const inputs = tableRef.current.querySelectorAll('input');
      const formData = {};
      
      inputs.forEach((input) => {
        formData[input.name] = input.value;
      });

      console.log(formData);
      
      // Показываем сообщение
      setMessage('Данные отправлены на модерацию');
      
      // Закрываем режим редактирования
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className='account-welcome'>
        <h1>Добро пожаловать, {userData ? userData.firstname.String : 'Гость'}!</h1>
        <img 
          src={editButton} 
          alt="Edit Button" 
          width={40} 
          onClick={toggleEditMode}
        />
        {isEditing && (
        <div className="info-btn-active">
          <button 
            type="button" 
            className="btn btn-primary btn-block btn-large btn-save" 
            onClick={handleSave}
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
    </>
  );
}
