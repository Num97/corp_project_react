import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthBlock.css';

export default function AuthBlock() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        try {
            const response = await fetch('http://10.90.25.125:5002/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Сохраняем токен в localStorage
            navigate('/'); // Перенаправляем пользователя на главную страницу
        } catch (err) {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div className='body'>
            <div className='login'>
                <h1>Авторизация</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="u"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Обновляем state при вводе
                    />
                    <input
                        type="password"
                        name="p"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Обновляем state при вводе
                    />
                    <button type="submit" className="btn btn-primary btn-block btn-large">
                        Let me in.
                    </button>
                    {error && <p className="error">{error}</p>} {/* Вывод ошибки */}
                </form>
            </div>
        </div>
    );
}