import InfoEditRow from "../components/Account/InfoEditRow/InfoEditRow";
import './PagesStyle/AddUser.css';
import React, { useState, useRef } from 'react';

export default function AddUser() {
    const [message, setMessage] = useState('');
    const formRef = useRef(null);
    const [userData, setUserData] = useState({
        id: 0,
        department: '',
        position: '',
        surname: '',
        first_name: '',
        second_name: '',
        outside_number: '',
        inside_number: '',
        first_mobile_number: '',
        second_mobile_number: '',
        email: '',
    });

    const handleAddUserHR = async () => {
        if (formRef.current) {
            const inputs = formRef.current.querySelectorAll('input');
            const fileInput = formRef.current.querySelector('input[type="file"]');
            const imageFile = fileInput && fileInput.files[0]; // Файл изображения, если есть

            const textData = {};

            // Собираем текстовые данные
            inputs.forEach((input) => {
                if (input.type !== 'file') {
                    const value = input.value.trim();
                    if (value !== "") {
                        textData[input.name] = {
                            String: value,
                            Valid: true
                        };
                    }
                }
            });

            try {
                setMessage(''); // Очищаем сообщение перед отправкой

                // Отправляем текстовые данные на первый эндпоинт
                const textResponse = await fetch('/api/v1/add_worker', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(textData),
                });

                const textResult = await textResponse.json();

                if (textResponse.status !== 200) {
                    throw new Error(textResult.error || "Ошибка при отправке текстовых данных");
                }

                const workerId = textResult.workerId;

                // Если есть изображение, отправляем его на второй эндпоинт
                if (imageFile) {
                    const formData = new FormData();
                    formData.append('image', imageFile);
                    formData.append('id', workerId); // Можно добавить workerId для связи с текстовыми данными

                    const imageResponse = await fetch('/api/v1/upload_image_photo_directly', {
                        method: 'POST',
                        body: formData,
                    });

                    const imageResult = await imageResponse.json();

                    if (imageResponse.status !== 200) {
                        throw new Error(imageResult.error || "Ошибка при отправке изображения");
                    }
                }

                // Если всё успешно
                setMessage('Пользователь успешно добавлен');
            } catch (error) {
                console.error('Ошибка:', error);
                setMessage(error.message || 'Ошибка при отправке данных');
            }
        }
    };

    return (
        <>
            <div className='account-welcome'>
                <h1>Добавьте нового пользователя</h1>
                <div className="info-btn-active">
                    <button
                        type="button"
                        className="btn btn-primary btn-block btn-large btn-save"
                        onClick={() => handleAddUserHR()}
                    >
                        Сохранить
                    </button>
                </div>
                {message && (
                    <div className="success-message">
                        <h2>{message}</h2>
                    </div>
                )}
            </div>

            <div className="add-user-form" ref={formRef}>
                <InfoEditRow data={userData} isEditing={true} emailEdit={true} />
            </div>
        </>
    );
}