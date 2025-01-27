import React from 'react';

const TableRow = ({ headers }) => {
  return (
    <tr>
      {headers.map((header, index) => (
        <th key={index}>{header}</th>
      ))}
    </tr>
  );
};

export default TableRow;