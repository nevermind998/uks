import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CommitActivity = () => {
  const data = [
    { date: '2023-06-01', commits: 10 },
    { date: '2023-06-02', commits: 5 },
    { date: '2023-06-03', commits: 7 },
    // Add more data points as needed
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="commits" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CommitActivity;
