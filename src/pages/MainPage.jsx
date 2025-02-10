import Header from "../components/MainPage/Header/Header"
import WorkerTable from "../components/MainPage/WorkerTable/WorkerTable"
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Account from "../pages/Account";


function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value) => {
    setSearchQuery(value); // Обновляем состояние строки поиска
  };


  return (
    <div>
      <Header onSearchChange={handleSearchChange}/>
      <main>
          <Routes>
          <Route 
            path="/" 
            element={<WorkerTable searchQuery={searchQuery} apiUrl="http://10.90.25.125:5002/api/v1/workers" />} 
          />
            <Route path="/account" element={<Account/>} />
          </Routes>
      </main>
    </div>
  )
}

export default MainPage