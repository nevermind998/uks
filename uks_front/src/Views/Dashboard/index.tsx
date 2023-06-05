import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../Store/slices/auth.slice';
import { useQuery } from 'react-query';
import { getRepositoriesForOwner } from '../../api/repositories';
import { Button, ButtonBase, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { RepositoryDto } from '../../Types/repository.types';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const user = useSelector(selectAuth);
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['FETCH_REPOS'],
        queryFn: async () => {
            const data: RepositoryDto[] = await getRepositoriesForOwner(user.id);
            return data;
        },
    });

    return (
        <div className="dashboard">
            <div className="dashboard__sidebar">
                <img src="/img/woman.png" alt="User icon" className="dashboard__sidebar--user" />
                <h3 className="dashboard__sidebar--name">
                    {user.given_name} {user.family_name}
                </h3>
                <p className="dashboard__sidebar--name">{user.username}</p>
                <p className="dashboard__sidebar--label">Bio</p>
                <p className="dashboard__sidebar--url">{user.bio}</p>
                <p className="dashboard__sidebar--label">Website</p>
                <a href={user.url} className="dashboard__sidebar--url">
                    {user.url}
                </a>
            </div>
            <div className="dashboard__repositories">
                {data?.map(x => (
                    <ButtonBase key={x.id} onClick={() => navigate(`repository/${x.id}`)}>
                        <Card variant="outlined" className="dashboard__repositories--card">
                            <>
                                <CardContent>
                                    <div className="dashboard__repositories--card-title">
                                        <Typography variant="h5" component="div">
                                            {x.name}
                                        </Typography>
                                        <Chip label={x.visibility.toLowerCase()} variant="outlined" />
                                    </div>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        {x.description}
                                    </Typography>
                                </CardContent>
                            </>
                        </Card>
                    </ButtonBase>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
