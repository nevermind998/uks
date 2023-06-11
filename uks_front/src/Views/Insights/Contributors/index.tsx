import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CommitActivityDto } from '../../../Types/commit.types';
import { getCommitActivityForRepository } from '../../../api/commits';

const Contributors = ({ repo }: any) => {
  const [commitData, setCommitData] = useState<CommitActivityDto[]>([]);

  // const { data } = useQuery({
  //   queryKey: ['FETCH_COMMIT_ACTIVITY', repo],
  //   queryFn: async () => {
  //     if (repo) {
  //       const data: CommitActivityDto[] = await getCommitActivityForRepository(repo.id);
  //       setCommitData(data);
  //       return data;
  //     }
  //   },
  // });

  useEffect(() => {
    const func = async () => {
      if (repo) {
        const data: CommitActivityDto[] = await getCommitActivityForRepository(repo.id);
        setCommitData(data);
        return data;
      }
    };

    func();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={commitData} dataKey="commits" nameKey="username" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Contributors;
