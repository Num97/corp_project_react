import React from 'react';
import axios from 'axios';
import Departament from "../Departament/Departament";
import "./WorkerTable.css"

class WorkerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], filteredData: {} };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    // Если строка поиска изменилась, обновляем фильтрацию
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.filterData();
    }
  }

  getData = async () => {
    try {
      // Используем пропс apiUrl для запроса данных
      const response = await axios.get(this.props.apiUrl, {
        headers: { 'Content-Type': 'application/json' },
      });

      const groupedData = response.data.reduce((acc, curr) => {
        if (!acc[curr.department.String]) {
          acc[curr.department.String] = [];
        }
        acc[curr.department.String].push(curr);
        return acc;
      }, {});

      this.setState({ data: groupedData }, this.filterData); // После загрузки данных выполняем фильтрацию
    } catch (error) {
      console.error(error);
    }
  };

  filterData = () => {
    const { data } = this.state;
    const { searchQuery } = this.props;

    if (!searchQuery) {
      this.setState({ filteredData: data });
      return;
    }

    const filteredData = Object.entries(data).reduce((acc, [department, worker]) => {
      const filteredWorkers = worker.filter((value) => {
        // Проверяем, соответствует ли работник строке поиска
        return JSON.stringify(value).toLowerCase().includes(searchQuery.toLowerCase());
      });

      if (filteredWorkers.length > 0) {
        acc[department] = filteredWorkers;
      }

      return acc;
    }, {});

    this.setState({ filteredData });
  };

  render() {
    const { filteredData } = this.state;
    const { onUpdate } = this.props; 

    return (
      <>
        {Object.keys(filteredData).map((department) => (
          <div key={department}>
            <Departament departament={department} data={filteredData[department]} onUpdate={onUpdate} />
          </div>
        ))}
      </>
    );
  }
}

export default WorkerTable;
