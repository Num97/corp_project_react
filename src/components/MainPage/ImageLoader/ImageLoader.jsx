import React from 'react';

const ImageLoader = ({ id, alt }) => {
  let imageSrc;
  try {
    imageSrc = <img src={`/images/${id}.jpg`} alt={alt} />
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
    imageSrc = <img src={`/images/unknown_user.jpg`} alt={alt} />
  }

  return imageSrc
};

export default ImageLoader;