import './SearchInput.css'

import React from 'react';

export default function SearchInput({ onSearchChange }) {
  const handleChange = (event) => {
    const value = event.target.value;
    onSearchChange(value); // Передаем строку поиска в родительский компонент
  };

  return (
    <div>
      <input
        className='search'
        type="text"
        placeholder="Поиск..."
        onChange={handleChange}
      />
    </div>
  );
}
