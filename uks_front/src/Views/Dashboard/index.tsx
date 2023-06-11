import { useSelector } from 'react-redux';
import { selectAuth } from '../../Store/slices/auth.slice';
import { useQuery } from 'react-query';
import { getRepositoriesForOwner } from '../../api/repositories';
import { Button, ButtonBase, Card, CardContent, Chip, CircularProgress, Typography } from '@mui/material';
import { RepositoryDto } from '../../Types/repository.types';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import CreateRepository from '../CreateRepository';
import { getUserById } from '../../api/userAuthentication';
import { UserProfileDto } from '../../Types/user.types';
import EditIcon from '@mui/icons-material/Edit';
import EditProfile from '../ProfileEdit';

const Dashboard = () => {
    const currentUser = useSelector(selectAuth);
    const navigate = useNavigate();
    const params = useParams()

    const [createRepo, setCreateRepo] = useState<boolean>(false);
    const [editProfile, setEditProfile] = useState<boolean>(false);

    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ['FETCH_USER', params],
        queryFn: async () => {
            if (params.id){
                const data: UserProfileDto = await getUserById(parseInt(params.id));
                console.log(data)
                return data[0];
            }
        },
    });

    const { data, refetch: refetchRepos } = useQuery({
        queryKey: ['FETCH_REPOS', user],
        queryFn: async () => {
            if (params.id){
                const data: RepositoryDto[] = await getRepositoriesForOwner(parseInt(params.id));
                return data;
            }
        },
    });


    return (
        <div className="dashboard">
            {isLoading? (
                <CircularProgress />
            ) : (
                <>
                    <div className="dashboard__sidebar">
                        <img src="/img/woman.png" alt="User icon" className="dashboard__sidebar--user" />
                        <h3 className="dashboard__sidebar--name">
                            {user.given_name} {user.family_name}
                        </h3>
                        {user.id === currentUser.id && !editProfile &&
                            <Button className="dashboard__edit-profile" size='small' onClick={() => setEditProfile(true)} variant="text" startIcon={<EditIcon fontSize='small'/>}>
                                Edit Profile
                            </Button>
                        }
                        <p className="dashboard__sidebar--name">{user?.username}</p>
                        <p className="dashboard__sidebar--label">Bio</p>
                        <p className="dashboard__sidebar--url">{user?.bio}</p>
                        <p className="dashboard__sidebar--label">Website</p>
                        <a href={user?.url} className="dashboard__sidebar--url">
                            {user?.url}
                        </a>
                    </div>
                    {createRepo ? (
                        <CreateRepository setCreateRepo={setCreateRepo} refetch={refetchRepos}/>
                    ) : editProfile ? (
                        <EditProfile setEditProfile={setEditProfile} refetch={refetch}/>
                    ) : (
                        <div>
                            {user.id === currentUser.id &&
                                <Button className="dashboard__create-repo" onClick={() => setCreateRepo(true)} variant="contained">
                                    Create Repository
                                </Button>
                            }
                            <div className="dashboard__repositories">
                                {data?.map(x => (
                                    <ButtonBase key={x.id} onClick={() => navigate(`/repository/${x.id}`)}>
                                        <Card variant="outlined" className="dashboard__repositories--card">
                                            <>
                                                <CardContent>
                                                    <div className="dashboard__repositories--card-title">
                                                        <Typography variant="h5" component="div">
                                                            {x.name}
                                                        </Typography>
                                                        <Chip label={x.visibility.toLowerCase()} variant="outlined" />
                                                    </div>
                                                    <Typography sx={{ fontSize: 14, textAlign: 'start' }} color="text.secondary" gutterBottom>
                                                        {x.description}
                                                    </Typography>
                                                </CardContent>
                                            </>
                                        </Card>
                                    </ButtonBase>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
