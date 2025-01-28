// import React from 'react';
// import axios from 'axios';
// import Departament from "../Departament/Departament";

// class WorkerTable extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { data: [], filteredData: {} };
//   }

//   componentDidMount() {
//     this.getData();
//   }

//   componentDidUpdate(prevProps) {
//     // Если строка поиска изменилась, обновляем фильтрацию
//     if (prevProps.searchQuery !== this.props.searchQuery) {
//       this.filterData();
//     }
//   }

//   getData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5002/api/v1/workers', {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       const groupedData = response.data.reduce((acc, curr) => {
//         if (!acc[curr.department.String]) {
//           acc[curr.department.String] = [];
//         }
//         acc[curr.department.String].push(curr);
//         return acc;
//       }, {});

//       this.setState({ data: groupedData }, this.filterData); // После загрузки данных выполняем фильтрацию
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   filterData = () => {
//     const { data } = this.state;
//     const { searchQuery } = this.props;

//     if (!searchQuery) {
//       this.setState({ filteredData: data });
//       return;
//     }

//     const filteredData = Object.entries(data).reduce((acc, [department, worker]) => {
//       const filteredWorkers = worker.filter((value) => {
//         // Проверяем, соответствует ли работник строке поиска
//         return JSON.stringify(value).toLowerCase().includes(searchQuery.toLowerCase());
//       });

//       if (filteredWorkers.length > 0) {
//         acc[department] = filteredWorkers;
//       }

//       return acc;
//     }, {});

//     this.setState({ filteredData });
//   };

//   render() {
//     const { filteredData } = this.state;

//     return (
//       <>
//         {Object.keys(filteredData).map((department) => (
//           <div key={department}>
//             <Departament departament={department} data={filteredData[department]} />
//           </div>
//         ))}
//       </>
//     );
//   }
// }

// export default WorkerTable;

import React from "react";
import axios from "axios";
import Departament from "../Departament/Departament";
import { Modal, Button } from "@/components/ui";

class WorkerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: {},
      selectedWorker: null, // Для хранения выбранного сотрудника
      isModalOpen: false, // Для управления модальным окном
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.filterData();
    }
  }

  getData = async () => {
    try {
      const response = await axios.get("http://10.90.25.125:5002/api/v1/workers", {
        headers: { "Content-Type": "application/json" },
      });

      const groupedData = response.data.reduce((acc, curr) => {
        if (!acc[curr.department.String]) {
          acc[curr.department.String] = [];
        }
        acc[curr.department.String].push(curr);
        return acc;
      }, {});

      this.setState({ data: groupedData }, this.filterData);
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
      const filteredWorkers = worker.filter((value) =>
        JSON.stringify(value).toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredWorkers.length > 0) {
        acc[department] = filteredWorkers;
      }

      return acc;
    }, {});

    this.setState({ filteredData });
  };

  // Открытие модального окна при клике на сотрудника
  openModal = (worker) => {
    this.setState({ selectedWorker: worker, isModalOpen: true });
  };

  // Закрытие модального окна
  closeModal = () => {
    this.setState({ selectedWorker: null, isModalOpen: false });
  };

  render() {
    const { filteredData, selectedWorker, isModalOpen } = this.state;

    return (
      <>
        {Object.keys(filteredData).map((department) => (
          <div key={department}>
            <Departament
              departament={department}
              data={filteredData[department]}
              onWorkerClick={this.openModal} // Передаем обработчик клика
            />
          </div>
        ))}

        {isModalOpen && selectedWorker && (
          <Modal onClose={this.closeModal}>
            <div className="p-4">
              <h2 className="text-xl font-bold">{selectedWorker.name}</h2>
              <p className="text-gray-600">{selectedWorker.position}</p>
              <img
                src={selectedWorker.photo_url}
                alt={`${selectedWorker.name}'s photo`}
                className="w-full h-auto mt-4 rounded-lg"
              />
              <Button className="mt-4" onClick={this.closeModal}>
                Закрыть
              </Button>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

export default WorkerTable;