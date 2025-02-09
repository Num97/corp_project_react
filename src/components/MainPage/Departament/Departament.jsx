import React, { useState } from 'react'; // Импортируем useState
import './Departament.css';
import Worker from '../Worker/Worker';
import TheadRow from '../TheadRow/TheadRow';
import { jwtDecode } from 'jwt-decode';

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

export default function Departament({ data, onUpdate }) {
  const userDepartment = getUserDepartment();
  const [workers, setWorkers] = useState(data); // Состояние для хранения данных о сотрудниках

  // Функция для обновления состояния после увольнения сотрудника
  const handleWorkerDismissed = (dismissedWorkerId) => {
    setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker.id !== dismissedWorkerId));
    onUpdate(); // Вызываем переданную функцию onUpdate, если она есть
  };

  return (
    <table>
      <thead>
        {userDepartment != 'Служба управления персоналом' && (
          <tr>
            <th colSpan={9}>{data[0].department.String}</th>
          </tr>
        )}
        {userDepartment != 'Служба управления персоналом' && (
          <TheadRow headers={['Должность', 'Фамилия', 'Имя', 'Отчество', 'Внутренний', 'Внешний', 'Сотовый 1', 'Сотовый 2', 'email']} />
        )}

        {userDepartment === 'Служба управления персоналом' && (
          <tr>
            <th colSpan={11}>{data[0].department.String}</th>
          </tr>
        )}
        {userDepartment === 'Служба управления персоналом' && (
          <TheadRow headers={['Должность', 'Фамилия', 'Имя', 'Отчество', 'Внутренний', 'Внешний', 'Сотовый 1', 'Сотовый 2', 'email', '', '']} />
        )}
      </thead>
      <tbody>
        {workers.map((item) => (
          <Worker
            key={item.id}
            data={item}
            item={{ ...item, onUpdate }}
            onDismiss={() => handleWorkerDismissed(item.id)} // Передаем функцию для обновления состояния
          />
        ))}
      </tbody>
    </table>
  );
}