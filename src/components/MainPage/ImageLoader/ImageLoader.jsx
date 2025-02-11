import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Чтобы узнать текущий путь

const ImageLoader = ({ id, alt, photoOnly = false }) => {
  const location = useLocation(); // Получаем текущий путь
  const isAccountPage = location.pathname.startsWith('/account'); // Проверяем, находимся ли мы в /account

  // Если передан параметр photoOnly, то игнорируем логику по определению пути
  const [imageSrc, setImageSrc] = useState(
    photoOnly
      ? `/api/v1/get_image_photo?id=${id}`  // При photoOnly всегда берём только /api/v1/get_image_photo
      : isAccountPage
      ? `/api/v1/get_image_moderation?id=${id}`  // Если на /account, то первым берём /api/v1/get_image_moderation
      : `/api/v1/get_image_photo?id=${id}`  // В любом другом случае пробуем брать /api/v1/get_image_photo
  );

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => setImageSrc(img.src); // Если загрузилось — используем его

    img.onerror = () => {
      if (photoOnly) {
        // Если photoOnly — сразу fallback на unknown_user.jpg
        setImageSrc('/images/unknown_user.jpg');
      } else if (isAccountPage) {
        // Если не получилось загрузить moderation, пробуем photo
        const fallbackImg = new Image();
        fallbackImg.src = `/api/v1/get_image_photo?id=${id}`;

        fallbackImg.onload = () => setImageSrc(fallbackImg.src);
        fallbackImg.onerror = () => setImageSrc('/images/unknown_user.jpg'); // Если и там ошибка — fallback
      } else {
        setImageSrc('/images/unknown_user.jpg'); // Если сразу брали из photo и ошибка — fallback
      }
    };
  }, [id, location.pathname, photoOnly]); // Следим за `id`, `location.pathname` и `photoOnly`

  return (
    <img
      className="img_user"
      src={imageSrc}
      alt={alt}
      onError={(e) => {
        e.target.src = '/images/unknown_user.jpg'; // На случай, если что-то пошло не так
      }}
    />
  );
};

export default ImageLoader;
