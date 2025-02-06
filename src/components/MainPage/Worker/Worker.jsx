import './Worker.css';
import React, { useState } from "react";
import ImageLoader from '../ImageLoader/ImageLoader';
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

// Функция получения department из токена (пример)
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

          {/* Показываем кнопки только если department == 'Служба управления персоналом' */}
          {userDepartment === 'Служба управления персоналом' && (
            <>
              <td>
                <img src={checkButton} alt="Check Button" width={15} />
              </td>
              <td>
                <img src={trashButton} alt="Trash Button" width={15} />
              </td>
            </>
          )}
        </tr>

        <DialogContent className="modal-bg-gray">
          <DialogHeader>
            <DialogTitle>{`${item.data.first_name.String} ${item.data.second_name.String} ${item.data.surname.String}`}</DialogTitle>
            <DialogDescription>
              {item.data.first_mobile_number.Valid && (
                <>
                  Телефон: +{item.data.first_mobile_number.String}<br />
                </>
              )}
              Email: {item.data.email.String}<br />
              <ImageLoader id={item.data.id} alt={'Пользователь еще не установил фотографию'} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
