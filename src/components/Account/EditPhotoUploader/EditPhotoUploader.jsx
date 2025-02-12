import React, { useState } from 'react';
import './EditPhotoUploader.css';

export default function EditPhotoUploader({ workerId, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Обработчик изменения файла
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
            } else {
                alert('Пожалуйста, выберите файл изображения (JPG, PNG и т.д.).');
                event.target.value = ''; // Сбрасываем значение input
            }
        }
    };

    // Обработчик нажатия на кнопку "Сохранить"
    const handleSavePhotoDirectly = async () => {
        if (!selectedFile) {
            alert('Пожалуйста, выберите файл перед сохранением.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('id', workerId);

        setIsLoading(true);

        try {
            const response = await fetch('/api/v1/upload_image_photo_directly', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert('Файл успешно загружен: ' + JSON.stringify(result));
                if (onUploadSuccess) onUploadSuccess(); // Вызываем обновление
            } else {
                throw new Error('Ошибка при загрузке файла');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при загрузке файла.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="edit-photo-uploader">
            <label htmlFor="file-input" className="custom-file-upload">
                Загрузить фото
            </label>
            <input 
                id="file-input" 
                type="file" 
                name="photo" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
            />

            <button 
                type="button" 
                className="custom-file-upload save-button-photo"
                onClick={handleSavePhotoDirectly} 
                disabled={isLoading}
            >
                {isLoading ? 'Загрузка...' : 'Сохранить'}
            </button>
            {selectedFile && (
                <div className="file-name">
                    Выбран файл: {selectedFile.name}
                </div>
            )}
        </div>
    );
}
