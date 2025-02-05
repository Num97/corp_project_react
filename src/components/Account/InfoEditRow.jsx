import React, { forwardRef } from 'react';
import './InfoEditRow.css';

function renderValue(value) {
    return value?.Valid ? value.String : '';
}

const InfoEditRow = forwardRef(({ data, isEditing }, ref) => {
    return (
        <table className='info-edit' ref={ref}>
            <tbody>
                {[
                    { label: 'Фамилия', key: 'surname' },
                    { label: 'Имя', key: 'first_name' },
                    { label: 'Отчество', key: 'second_name' },
                    { label: 'Отдел', key: 'department' },
                    { label: 'Должность', key: 'position' },
                    { label: 'Внешний номер', key: 'outside_number' },
                    { label: 'Внутренний номер', key: 'inside_number' },
                    { label: 'Сотовый 1', key: 'first_mobile_number' },
                    { label: 'Сотовый 2', key: 'second_mobile_number' },
                    { label: 'Email', key: 'email', isEditable: false }, // Запрещаем редактирование
                ].map(({ label, key, isEditable = true }) => (
                    <tr key={key} className='info-element'>
                        <td>{label}:</td>
                        <td className={isEditing && isEditable ? 'info-td-passive' : 'info-td-active'}>
                            {renderValue(data[key])}
                        </td>
                        <td className={isEditing && isEditable ? 'info-input-active' : 'info-input-passive'}>
                            <input 
                                type="text" 
                                name={key} 
                                defaultValue={renderValue(data[key])} 
                                readOnly={!isEditing || !isEditable} // Запрещаем редактирование email
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
});

export default InfoEditRow;
