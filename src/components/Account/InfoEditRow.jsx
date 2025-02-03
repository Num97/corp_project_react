// import './InfoEditRow.css';

// function renderValue(value) {
//     return value?.Valid ? value.String : 'Не указано';
// }

// export default function InfoEditRow({ data }) {
//     return (
//         <div className='info-edit'>
//             <p className='info-element'>Фамилия: {renderValue(data.surname)}</p>
//             <p className='info-element'>Имя: {renderValue(data.firstname)}</p>
//             <p className='info-element'>Отчество: {renderValue(data.second_name)}</p>
//             <p className='info-element'>Отдел: {renderValue(data.department)}</p>
//             <p className='info-element'>Должность: {renderValue(data.position)}</p>
//             <p className='info-element'>Внешний номер: {renderValue(data.outside_number)}</p>
//             <p className='info-element'>Внутренний номер: {renderValue(data.inside_number)}</p>
//             <p className='info-element'>Мобильный: {renderValue(data.first_mobile_number)}</p>
//             <p className='info-element'>Email: {renderValue(data.email)}</p>
//             <input type="text" style={{ display: 'none' }} />
//         </div>
//     );
// }

import './InfoEditRow.css';

function renderValue(value) {
    return value?.Valid ? value.String : 'Не указано';
}

export default function InfoEditRow({ data }) {
    return (
        <table className='info-edit'>
            <tbody>
            <tr className='info-element'><td>Фамилия: </td><td>{renderValue(data.surname)}</td></tr>
            <tr className='info-element'><td>Имя: </td><td>{renderValue(data.firstname)}</td></tr>
            <tr className='info-element'><td>Отчество: </td><td>{renderValue(data.second_name)}</td></tr>
            <tr className='info-element'><td>Отдел: </td><td>{renderValue(data.department)}</td></tr>
            <tr className='info-element'><td>Должность: </td><td>{renderValue(data.position)}</td></tr>
            <tr className='info-element'><td>Внешний номер: </td><td>{renderValue(data.outside_number)}</td></tr>
            <tr className='info-element'><td>Внутренний номер: </td><td>{renderValue(data.inside_number)}</td></tr>
            <tr className='info-element'><td>Мобильный: </td><td>{renderValue(data.first_mobile_number)}</td></tr>
            <tr className='info-element'><td>Email: </td><td>{renderValue(data.email)}</td></tr>
            {/* <input type="text" style={{ display: 'none' }} /> */}
            </tbody>
        </table>
    );
}