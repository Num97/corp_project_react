import { useState, useEffect } from "react";
import "./Header.css";
import SearchInput from "../SearchInput/SearchInput";
import PersonalAccountButton from "../PersonalAccountButton/PersonalAccountButton";
import { useNavigate } from "react-router-dom"; // Используем для навигации
import exitButton from "/images/exit.svg";

export default function Header({ onSearchChange }) {
    const [now, setNow] = useState(new Date());
    const navigate = useNavigate(); // Хук для смены маршрута

    // Обновление времени каждую секунду
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, []);

    // Функция выхода
    const handleLogout = () => {
        localStorage.removeItem("token"); // Удаляем токен
        navigate("/login"); // Перенаправляем на страницу логина
    };

    return (
        <header>
            <PersonalAccountButton />
            <SearchInput onSearchChange={onSearchChange} />
            <div className="clock_exit">
                <span className="clock">Сейчас: {now.toLocaleTimeString()}</span>
                <div className="exit" onClick={handleLogout}>
                    <img src={exitButton} alt="Exit Button" width={30} />
                </div>
            </div>
        </header>
    );
}
