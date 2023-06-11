import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CommitCountDto } from '../../../Types/commit.types';
import { useQuery } from 'react-query';
import { getCommitCountForRepository } from '../../../api/commits';

const CommitActivity = ({ repo }: any) => {
  const [commitData, setCommitData] = useState<CommitCountDto[]>([]);

  const { data } = useQuery({
    queryKey: ['FETCH_COMMIT_ACTIVITY', repo],
    queryFn: async () => {
      if (repo) {
        const data: CommitCountDto[] = await getCommitCountForRepository(repo.id);
        setCommitData(data);
        return data;
      }
    },
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={commitData} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="commit_count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CommitActivity;
