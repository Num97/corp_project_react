import './Worker.css';
import React, { useState } from "react";
import ImageLoader from '../ImageLoader/ImageLoader';
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { jwtDecode } from 'jwt-decode';
import checkButton from '/checkButton.svg';
import trashButton from '/trashButton.svg';
import penEditButton from '/penEditButton.svg';
import rejectButton from '/rejectButton.svg';

// // Функция получения department из токена (пример)
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

export default function Worker(item) {
  const [isOpen, setIsOpen] = useState(false);
  const userDepartment = getUserDepartment(); // Получаем department из токена
  const location = useLocation();

  const handleClickAcceptUser = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/v1/waiting_edit_list_accept_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item.data), // Отправляем весь объект item
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Успешный ответ:", result);
  
      // Вызываем onUpdate после успешного ответа
      if (item.item.onUpdate) {  
        item.item.onUpdate(`Данные для ${item.data.email.String} одобрены`); 
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  const handleClickRejectUser = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/v1/waiting_edit_list_reject_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item.data), // Отправляем весь объект item
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Успешный ответ:", result);
  
      // Вызываем onUpdate после успешного ответа
      if (item.item.onUpdate) {  
        item.item.onUpdate(`Данные для ${item.data.email.String} отклонены`); 
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  const handleClickDismissWorker = async () => {
    const isConfirmed = confirm("Вы уверены, что хотите уволить сотрудника?");
    if (!isConfirmed) {
      console.log("Действие отменено пользователем.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5002/api/v1/dismiss_worker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item.data), // Отправляем весь объект item
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Успешный ответ:", result);
  
      // Вызываем onDismiss после успешного ответа
      if (item.onDismiss) {
        item.onDismiss(); // Уведомляем Departament об увольнении сотрудника
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <tr className="row_hover">
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)}>{item.data.position.String}</td>
          </DialogTrigger>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)}>{item.data.surname.String}</td>
          </DialogTrigger>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)}>{item.data.first_name.String}</td>
          </DialogTrigger>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)}>{item.data.second_name.String}</td>
          </DialogTrigger>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)}>{item.data.inside_number.String}</td>
          </DialogTrigger>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)}>{item.data.outside_number.String}</td>
          </DialogTrigger>

          <td className='text-hover'>
            {item.data.first_mobile_number.Valid
              ? "+" + item.data.first_mobile_number.String
              : ""}
          </td>
          <td className='text-hover'>
            {item.data.second_mobile_number.Valid
              ? "+" + item.data.second_mobile_number.String
              : ""}
          </td>
          <td><a href={'mailto:' + item.data.email.String}>{item.data.email.String}</a></td>

          {/* Показываем кнопки только если department == 'Служба управления персоналом' на эндпоинте / */}
          {userDepartment === 'Служба управления персоналом' && location.pathname === "/" && (
            <>
              <td>
                <img src={penEditButton} alt="Check Button" width={17} />
              </td>
              <td onClick={handleClickDismissWorker}>
                <img src={trashButton} alt="Trash Button" width={15} />
              </td>
            </>
          )}

          {/* Показываем кнопки только если department == 'Служба управления персоналом' на эндпоинте /account */}
          {userDepartment === 'Служба управления персоналом' && location.pathname === "/account" && (
            <>
              <td onClick={handleClickAcceptUser}>
                <img src={checkButton} alt="Check Button" width={15} />
              </td>
              <td onClick={handleClickRejectUser}>
                <img src={rejectButton} alt="Trash Button" width={20} />
              </td>
            </>
          )}
        </tr>

        <DialogContent className="modal-bg-gray">
          <DialogHeader>
            <DialogTitle>{`${item.data.first_name.String} ${item.data.second_name.String} ${item.data.surname.String}`}</DialogTitle>
            <DialogDescription>
              <ImageLoader id={item.data.id} alt={'Пользователь еще не установил фотографию'} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
