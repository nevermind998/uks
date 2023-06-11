import React from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Contributors = () => {
  const data = [
    { name: 'John', commits: 50 },
    { name: 'Jane', commits: 30 },
    { name: 'Alex', commits: 20 },
    // Add more data points as needed
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="commits" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Contributors;
