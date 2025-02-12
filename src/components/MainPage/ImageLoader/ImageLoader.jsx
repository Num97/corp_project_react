import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ImageLoader = ({ id, alt, photoOnly = false, updateTrigger = null }) => {
  const location = useLocation();
  const isAccountPage = location.pathname.startsWith('/account');

  // Добавляем updateTrigger для принудительного обновления изображения
  const generateImageUrl = () => {
    const baseUrl = photoOnly
      ? `/api/v1/get_image_photo?id=${id}`
      : isAccountPage
      ? `/api/v1/get_image_moderation?id=${id}`
      : `/api/v1/get_image_photo?id=${id}`;

    return updateTrigger ? `${baseUrl}&t=${updateTrigger}` : baseUrl;
  };

  const [imageSrc, setImageSrc] = useState(generateImageUrl());

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => setImageSrc(img.src);

    img.onerror = () => {
      if (photoOnly) {
        setImageSrc('/images/unknown_user.jpg');
      } else if (isAccountPage) {
        const fallbackImg = new Image();
        fallbackImg.src = `/api/v1/get_image_photo?id=${id}`;

        fallbackImg.onload = () => setImageSrc(fallbackImg.src);
        fallbackImg.onerror = () => setImageSrc('/images/unknown_user.jpg');
      } else {
        setImageSrc('/images/unknown_user.jpg');
      }
    };
  }, [id, location.pathname, photoOnly, updateTrigger]); // Теперь следим и за updateTrigger

  return (
    <img
      className="img_user"
      src={imageSrc}
      alt={alt}
      onError={(e) => {
        e.target.src = '/images/unknown_user.jpg';
      }}
    />
  );
};

export default ImageLoader;
