// import { useState } from 'react';

// export default function RecoveryBlock() {
//     const [username, setUsername] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmitRecovery = async (e) => {
//         e.preventDefault(); // Предотвращаем перезагрузку страницы

//         try {
//             const response = await fetch('http://10.90.25.125:5002/api/v1/signup', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ username }),
//             });

//             if (!response.ok) {
//                 throw new Error('Invalid credentials');
//             }

//             const data = await response.json();
//             console.log(data);
//         } catch (err) {
//             setError('Почты нет в системе');
//         }
//     };

//     return (
//         <div className='body'>
//             <div className='login'>
//                 <h1>Введите Email</h1>
//                 <form onSubmit={handleSubmitRecovery}>
//                     <input
//                         type="text"
//                         name="u"
//                         placeholder="Username"
//                         required
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)} // Обновляем state при вводе
//                     />
//                     <button type="submit" className="btn btn-primary btn-block btn-large">
//                         Выслать пароль
//                     </button>
//                     {error && <p className="error">{error}</p>} {/* Вывод ошибки */}
//                 </form>
//             </div>
//         </div>
//     );
// }

import { useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link

export default function RecoveryBlock() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmitRecovery = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        try {
            const response = await fetch('http://10.90.25.243:5002/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'login': username }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            // const data = await response.json();
            // console.log(data);
        } catch (err) {
            setError('Почты нет в системе');
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
                    <button type="submit" className="btn btn-primary btn-block btn-large">
                        Выслать пароль
                    </button>
                    {error && <p className="error">{error}</p>} {/* Вывод ошибки */}
                </form>
                {/* Кнопка для перехода на /login */}
                <Link to="/login">
                    <button className="btn btn-secondary btn-block btn-large">
                        Вернуться к логину
                    </button>
                </Link>
            </div>
        </div>
    );
}