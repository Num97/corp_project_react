import './Departament.css'
import Worker from '../Worker/Worker'
import TheadRow from'../TheadRow/TheadRow'
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

export default function Departament({data, onUpdate}) {
    const userDepartment = getUserDepartment(); // Получаем department из токена
    return (
                <table>
                    <thead>

                    {userDepartment != 'Служба управления персоналом' && (
                        <tr>
                            <th colSpan={9}>{data[0].department.String}</th>
                        </tr>
                        )}
                    {userDepartment != 'Служба управления персоналом' && (
                        <TheadRow headers={['Должность', 'Фамилия', 'Имя', 'Отчество', 'Внутренний', 'Внешний', 'Сотовый 1', 'Сотовый 2', 'email']}/>
                    )}

                    {userDepartment === 'Служба управления персоналом' && (
                        <tr>
                            <th colSpan={11}>{data[0].department.String}</th>
                        </tr>
                        )}
                    {userDepartment === 'Служба управления персоналом' && (
                        <TheadRow headers={['Должность', 'Фамилия', 'Имя', 'Отчество', 'Внутренний', 'Внешний', 'Сотовый 1', 'Сотовый 2', 'email', '', '']}/>
                    )}

                    </thead>
                    <tbody>
                       {data.map((item) => (
                            <Worker key={item.id} data={item} item={{ ...item, onUpdate }}/>                           
                        ))}
                    </tbody>
                </table>
    )
}
