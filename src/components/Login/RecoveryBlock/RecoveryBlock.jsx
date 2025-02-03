import { useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import './RecoveryBlock.css'

export default function RecoveryBlock() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState(''); // Состояние для отображения сообщения пользователю
    const [isLoading, setIsLoading] = useState(false); // Состояние для отслеживания загрузки

    const handleSubmitRecovery = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        setIsLoading(true); // Начинаем загрузку
        setMessage(''); // Очищаем предыдущее сообщение

        try {
            const response = await fetch('http://10.90.25.243:5002/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'login': username }),
            });

            if (response.ok) {
                // Если статус ответа 200-299
                setMessage('Пароль придет на почту в течение пары минут');
            } else {
                // Если статус ответа не 200-299
                setMessage('Что-то пошло не так');
            }
        } catch (err) {
            // Если произошла ошибка при запросе
            setMessage('Что-то пошло не так');
        } finally {
            setIsLoading(false); // Завершаем загрузку
        }
    };

    return (
        <div className='body'>
            <div className='login'>
                <h1>Введите Email</h1>
                <form onSubmit={handleSubmitRecovery}>
                    <input
                        type="text"
                        name="u"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Обновляем state при вводе
                    />
                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-large"
                        disabled={isLoading} // Блокируем кнопку во время загрузки
                    >
                        {isLoading ? 'Отправка...' : 'Выслать пароль'}
                    </button>
                </form>
                {/* Кнопка для перехода на /login */}
                <Link to="/login">
                    <button className="btn btn-secondary btn-block btn-large">
                        Вернуться к авторизации
                    </button>
                </Link>
                {isLoading ? (
                        <p className="message">Подождите, идет обработка запроса...</p>
                    ) : (
                        message && <p className="message">{message}</p>
                    )}
            </div>
        </div>
    );
}