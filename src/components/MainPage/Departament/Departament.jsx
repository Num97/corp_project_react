import './Departament.css'
import Worker from '../Worker/Worker'
import TheadRow from'../TheadRow/TheadRow'

export default function Departament({data}) {
    return (
                <table>
                    <thead>
                        <tr>
                            <th colSpan={9}>{data[0].department.String}</th>
                        </tr>
                        <TheadRow headers={['Должность', 'Фамилия', 'Имя', 'Отчество', 'Внутренний', 'Внешний', 'Сотовый 1', 'Сотовый 2', 'email']}/>
                    </thead>
                    <tbody>
                       {data.map((item) => (
                            <Worker key={item.id} data={item}/>                           
                        ))}
                    </tbody>
                </table>
    )
}
