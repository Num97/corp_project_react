// import React, { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';

// export default function Account() {
//   const [firstname, setFirstname] = useState('');

//   useEffect(() => {
//     // Получаем токен из локального хранилища
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       try {
//         // Декодируем токен
//         const decodedToken = jwtDecode(token);
//         console.log(decodedToken);
        
//         // Извлекаем username из токена
//         if (decodedToken.username) {
//           setFirstname(decodedToken.firstname);
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//       }
//     }
//   }, []);  // useEffect с пустым массивом зависимостей для вызова только при монтировании компонента

//   return (
//     <div>
//       <h1>Добро пожаловать, {firstname || 'Guest'}!</h1>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import InfoEditRow from '../components/Account/InfoEditRow';

export default function Account() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken);
        
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

  return (
    <div>
      <h1>Добро пожаловать, {userData ? userData.firstname.String : 'Гость'}!</h1>
      {userData && <InfoEditRow data={userData} />}
    </div>
  );
}