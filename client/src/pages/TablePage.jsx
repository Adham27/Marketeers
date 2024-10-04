import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, InputNumber } from 'antd';

function TablePage() {
  const [values, setValues] = useState([]);
  const [inputs, setInputs] = useState({});
  const [percentages, setPercentages] = useState({});

useEffect(() => {
  const access_token = localStorage.getItem('Token');
  console.log('Access Token:', access_token);
  if (!access_token) {
    console.error('Access token is missing');
    return;
  }

  axios
    .get('http://localhost:5000/api/values/', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      setValues(response.data);
    })
    .catch((error) => {
      console.error('Error fetching values:', error);
    });
}, []);

  const handleInputChange = (id, value) => {
    setInputs({
      ...inputs,
      [id]: value,
    });

    const existingValue = values.find((v) => v.id === id).value;
    const percentage = (value / existingValue) * 100;

    setPercentages({
      ...percentages,
      [id]: percentage,
    });
  };

  const columns = [
    {
      title: 'User Input',
      dataIndex: 'userInput',
      key: 'userInput',
      render: (text, record) => (
        <InputNumber
          min={0}
          value={inputs[record.id] || ''}
          onChange={(value) => handleInputChange(record.id, value)}
        />
      ),
    },
    {
      title: 'Existing Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text, record) =>
        percentages[record.id]
          ? `${percentages[record.id].toFixed(2)}%`
          : '',
    },
  ];

  const dataSource = values.map((item) => ({
    key: item.id,
    id: item.id,
    value: item.value,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <h2>Table Page</h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
      />
    </div>
  );
}

export default TablePage;
