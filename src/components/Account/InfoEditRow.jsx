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
                    { label: 'Имя', key: 'firstname' },
                    { label: 'Отчество', key: 'second_name' },
                    { label: 'Отдел', key: 'department' },
                    { label: 'Должность', key: 'position' },
                    { label: 'Внешний номер', key: 'outside_number' },
                    { label: 'Внутренний номер', key: 'inside_number' },
                    { label: 'Сотовый 1', key: 'first_mobile_number' },
                    { label: 'Сотовый 2', key: 'second_mobile_number' },
                    { label: 'Email', key: 'email' },
                ].map(({ label, key }) => (
                    <tr key={key} className='info-element'>
                        <td>{label}:</td>
                        <td className={isEditing ? 'info-td-passive' : 'info-td-active'}>
                            {renderValue(data[key])}
                        </td>
                        <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
                            <input 
                                type="text" 
                                name={key} 
                                defaultValue={renderValue(data[key])} 
                                readOnly={!isEditing} 
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
});

export default InfoEditRow;
