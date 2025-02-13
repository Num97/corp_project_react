import React, { useState, useEffect, forwardRef } from 'react';
import './InfoEditRow.css';

function renderValue(value) {
    return value?.Valid ? value.String : '';
}

const InfoEditRow = forwardRef(({ data, isEditing, emailEdit = false }, ref) => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetch('/api/v1/departments')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error("Ошибка загрузки отделов:", error));
    }, []);

    return (
        <table className='info-edit' ref={ref}>
            <tbody>
                {[
                    { label: 'Фамилия', key: 'surname' },
                    { label: 'Имя', key: 'first_name' },
                    { label: 'Отчество', key: 'second_name' },
                    { label: 'Должность', key: 'position' },
                    { label: 'Внешний номер', key: 'outside_number' },
                    { label: 'Внутренний номер', key: 'inside_number' },
                    { label: 'Сотовый 1', key: 'first_mobile_number' },
                    { label: 'Сотовый 2', key: 'second_mobile_number' },
                    { label: 'Email', key: 'email', isEditable: emailEdit },
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
                                readOnly={!isEditing || !isEditable} 
                            />
                        </td>
                    </tr>
                ))}
                {/* Инпут с автозаполнением для отдела */}
                <tr className='info-element'>
                    <td>Отдел:</td>
                    <td className={isEditing ? 'info-td-passive' : 'info-td-active'}>
                        {renderValue(data.department)}
                    </td>
                    <td className={isEditing ? 'info-input-active' : 'info-input-passive'}>
                        <input 
                            type="text" 
                            name="department" 
                            defaultValue={renderValue(data['department'])} 
                            list="departments-list"
                            disabled={!isEditing} 
                        />
                        <datalist id="departments-list">
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.name} />
                            ))}
                        </datalist>
                    </td>
                </tr>
                {/* image input */}
                <tr className={isEditing ? 'info-input-active' : 'info-input-passive'}>
                    <td>Фотография</td>
                    <td>
                        <input type="file" name="photo" accept=".jpg, .jpeg, .png"/>
                    </td>
                </tr>
            </tbody>
        </table>
    );
});

export default InfoEditRow;
