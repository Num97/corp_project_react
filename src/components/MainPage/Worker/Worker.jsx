import './Worker.css'
import React, { useState } from "react";
import ImageLoader from '../ImageLoader/ImageLoader';
// import unknownUserImage from '/images/unknown_user.jpg';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

export default function Worker(item) {
  const [isOpen, setIsOpen] = useState(false); // Состояние для управления модальным окном

// const getImageSrc = (id) => {
//     try {
//       const imagePath = `/images/${id}.jpg`;
//       return imagePath;
//     } catch (error) {
//       console.error('Ошибка загрузки изображения:', error);
//       return '/images/unknown_user.jpg';
//     }
//   };

  return (
    <>
      {/* Диалоговое окно */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {/* Строка таблицы, которая открывает модальное окно */}
          <tr
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <td>{item.data.position.String}</td>
            <td>{item.data.surname.String}</td>
            <td>{item.data.first_name.String}</td>
            <td>{item.data.second_name.String}</td>
            <td>{item.data.inside_number.String}</td>
            <td>{item.data.outside_number.String}</td>
            <td>
              {item.data.first_mobile_number.Valid
                ? "+" + item.data.first_mobile_number.String
                : ""}
            </td>
            <td>
              {item.data.second_mobile_number.Valid
                ? "+" + item.data.second_mobile_number.String
                : ""}
            </td>
            <td>{item.data.email.String}</td>
          </tr>
        </DialogTrigger>

        {/* Содержимое модального окна */}
        <DialogContent className="modal-bg-gray">
          <DialogHeader>
            <DialogTitle>{item.data.first_name.String + ' ' + item.data.second_name.String + ' ' + item.data.surname.String}</DialogTitle>
            <DialogDescription>
                {/* <img src={`/images/${item.data.id}.jpg`} alt={`Фото ${item.data.first_name.String}`} /> */}
                {/* <img src={getImageSrc(item.data.id)} alt={`Фото ${item.data.first_name.String}`} /> */}
                <ImageLoader id={item.data.id} alt={'Пользователь еще не установил фотографию'}/>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}