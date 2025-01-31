import React, { useState, useEffect } from 'react';

const ImageLoader = ({ id, alt }) => {
  const [imageSrc, setImageSrc] = useState(`/images/${id}.jpg`);

  useEffect(() => {
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'JPG']; // Список расширений
    let currentExtensionIndex = 0;

    const tryLoadImage = () => {
      const img = new Image();
      img.src = `/images/${id}.${extensions[currentExtensionIndex]}`;

      img.onload = () => {
        // Если изображение загружено, обновляем состояние
        setImageSrc(img.src);
      };

      img.onerror = () => {
        // Если изображение не загружено, пробуем следующее расширение
        currentExtensionIndex++;
        if (currentExtensionIndex < extensions.length) {
          tryLoadImage(); // Рекурсивно пробуем следующее расширение
        } else {
          // Если ни одно расширение не подошло, используем fallback
          setImageSrc('/images/unknown_user.jpg');
        }
      };
    };

    tryLoadImage(); // Начинаем попытки загрузки
  }, [id]);

  return (
    <img
      className="img_user"
      src={imageSrc}
      alt={alt}
      onError={(e) => {
        // На случай, если fallback тоже не загрузится
        e.target.src = '/images/unknown_user.jpg';
      }}
    />
  );
};

export default ImageLoader;