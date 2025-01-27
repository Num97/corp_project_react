import './Worker.css'
import Departament from '../Departament/Departament'

export default function Worker(item) {
    return (
                <tr>
                    <td>{item.data.position.String}</td>
                    <td>{item.data.surname.String}</td>
                    <td>{item.data.first_name.String}</td>
                    <td>{item.data.second_name.String}</td>
                    <td>{item.data.inside_number.String}</td>
                    <td>{item.data.outside_number.String}</td>
                    <td>{item.data.first_mobile_number.Valid ? '+' + item.data.first_mobile_number.String : ''}</td>
                    <td>{item.data.second_mobile_number.Valid ? '+' + item.data.second_mobile_number.String : ''}</td>
                    <td>{item.data.email.String}</td>
                </tr>
    )
}