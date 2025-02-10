import './Worker.css';
import React, { useState, useEffect } from "react";
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
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(item.data); // Состояние для хранения данных из инпутов

    // Функция для обновления `formData` при изменении инпутов
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: { ...prevData[name], String: value }, // Меняем только `String`
      }));
    };
  
    useEffect(() => {
      const handleKeyDown = async (event) => {
        if (event.key === "Escape") {
          setIsEditing(false);
          setFormData(item.data);
        } else if (event.key === "Enter" && isEditing) {
          try {
            const response = await fetch("/api/v1/edit_worker", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData), // Теперь берем обновленные данные
            });
  
            if (!response.ok) {
              throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }
  
            const result = await response.json();
            console.log("Данные успешно обновлены:", result);
          } catch (error) {
            console.error("Ошибка при отправке данных:", error);
          }
  
          setIsEditing(false);
        }
      };
  
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isEditing, formData, item.data]);
  

  const handleClickAcceptUser = async () => {
    try {
      const response = await fetch("/api/v1/waiting_edit_list_accept_user", {
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
      const response = await fetch("/api/v1/waiting_edit_list_reject_user", {
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

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleClickEditWorker = () => {
    toggleEditMode(); // Переключаем состояние редактирования
  };

  const handleClickDismissWorker = async () => {
    const isConfirmed = confirm("Вы уверены, что хотите уволить сотрудника?");
    if (!isConfirmed) {
      console.log("Действие отменено пользователем.");
      return;
    }

    try {
      const response = await fetch("/api/v1/dismiss_worker", {
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
            <td onClick={() => setIsOpen(true)} className={isEditing ? 'info-td-passive' : 'info-td-active'}>{formData.position.String}</td>
          </DialogTrigger>
          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="position"
              value={formData.position.String}
              onChange={handleInputChange}
            />
          </td>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)} className={isEditing ? 'info-td-passive' : 'info-td-active'}>{formData.surname.String}</td>
          </DialogTrigger>
          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="surname"
              value={formData.surname.String}
              onChange={handleInputChange}
            />
          </td>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)} className={isEditing ? 'info-td-passive' : 'info-td-active'}>{formData.first_name.String}</td>
          </DialogTrigger>
          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="first_name"
              value={formData.first_name.String}
              onChange={handleInputChange}
            />
          </td>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)} className={isEditing ? 'info-td-passive' : 'info-td-active'}>{formData.second_name.String}</td>
          </DialogTrigger>
          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="second_name"
              value={formData.second_name.String}
              onChange={handleInputChange}
            />
          </td>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)} className={isEditing ? 'info-td-passive' : 'info-td-active'}>{formData.inside_number.String}</td>
          </DialogTrigger>
          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="inside_number"
              value={formData.inside_number.String}
              onChange={handleInputChange}
            />
          </td>
          <DialogTrigger asChild>
            <td onClick={() => setIsOpen(true)} className={isEditing ? 'info-td-passive' : 'info-td-active'}>{formData.outside_number.String}</td>
          </DialogTrigger>
          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="outside_number"
              value={formData.outside_number.String}
              onChange={handleInputChange}
            />
          </td>

          <td className={`text-hover ${isEditing ? 'info-td-passive' : 'info-td-active'}`}>
            {formData.first_mobile_number.Valid
              ? "+" + formData.first_mobile_number.String
              : ""}
          </td>

          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="first_mobile_number"
              value={formData.first_mobile_number.String}
              onChange={handleInputChange}
            />
          </td>

          <td className={`text-hover ${isEditing ? 'info-td-passive' : 'info-td-active'}`}>
            {formData.second_mobile_number.Valid
              ? "+" + formData.second_mobile_number.String
              : ""}
          </td>

          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="second_mobile_number"
              value={formData.second_mobile_number.String}
              onChange={handleInputChange}
            />
          </td>

          <td className={isEditing ? 'info-td-passive' : 'info-td-active'}><a href={'mailto:' + formData.email.String}>{formData.email.String}</a></td>

          <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
            <input
              type="text"
              name="email"
              value={formData.email.String}
              onChange={handleInputChange}
            />
          </td>

          {/* Показываем кнопки только если department == 'Служба управления персоналом' на эндпоинте / */}
          {userDepartment === 'Служба управления персоналом' && location.pathname === "/" && (
            <>
              <td onClick={handleClickEditWorker}>
                <img src={penEditButton} alt="Edit Button" width={17} />
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
            <DialogTitle>{`${formData.first_name.String} ${formData.second_name.String} ${formData.surname.String}`}</DialogTitle>
            <DialogDescription>
              <ImageLoader id={formData.id} alt={'Пользователь еще не установил фотографию'} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}