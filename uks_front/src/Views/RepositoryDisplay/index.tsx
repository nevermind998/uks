import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Breadcrumbs, Button, ButtonGroup, Chip, Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useQuery } from 'react-query';
import { RepositoryDto } from '../../Types/repository.types';
import { createNewRepositoryAction, deleteAction, getRepositoryById, getStarActionForUser, getWatchActionForUser } from '../../api/repositories';
import { useNavigate, useParams } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../Store/slices/auth.slice';
import AboutRepository from './AboutRepository';
import PullRequest from '../ProjectManagement/PullRequestForm';
import PullRequestDisplay from './PullRequestDisplay';
import { ActionDto } from '../../Types/action.types';
import CreateFork from './CreateFork';
import CommentsDisplay from '../CommentsDisplay';
import ManageAccess from './ManageAccessSettings';

const Repository = () => {
    const user = useSelector(selectAuth);
    const { id } = useParams();
    const [toastOptions, setToastOptions] = useState<ToastOptions>({
        message: '',
        type: 'info',
    });
    const [open, setOpen] = useState<boolean>(false);
    const [tab, setTab] = useState('1');
    const [starred, setStarred] = useState(false);
    const [watching, setWatching] = useState(false);

    const handleForkClick = () => {
        setTab('5');
    };

    const handleStarClick = async () => {
        setStarred(!starred);
        if (starred) {
            if (star?.id) {
                const data: any = await deleteAction(star.id);
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        } else if (repo?.id) {
            const body: ActionDto = {
                author: user.id,
                type: 'STAR',
                repository: repo.id,
            };
            createNewRepositoryAction(body);
        }
    };

  const handleWatchClick = async () => {
    setWatching(!watching);
    if (watch?.id) {
      await deleteAction(watch.id);
    } else if (repo?.id) {
      const body: ActionDto = {
        author: user.id,
        type: "WATCH",
        repository: repo.id,
      };
      createNewRepositoryAction(body);
    }
  };

    const handleChange = (event: SyntheticEvent, newTab: string) => {
        setTab(newTab);
    };

    const { data: repo } = useQuery({
        queryKey: ['FETCH_REPO'],
        queryFn: async () => {
            if (id) {
                const data: RepositoryDto = await getRepositoryById(parseInt(id));
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        },
    });

    const { data: star } = useQuery({
        queryKey: ['FETCH_STAR'],
        queryFn: async () => {
            if (id && user.id) {
                const data: ActionDto = await getStarActionForUser(parseInt(id), user.id);
                if (data.id != null) {
                    setStarred(true);
                }
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        },
    });

    const { data: watch } = useQuery({
        queryKey: ['FETCH_WATCH'],
        queryFn: async () => {
            if (id && user.id) {
                const data: ActionDto = await getWatchActionForUser(parseInt(id), user.id);
                if (data.id != null) {
                    setWatching(true);
                }
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        },
    });

    return (
        <>
            <div className="repository">
                <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
                <div className="repository__content-wrapper">
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Breadcrumbs className="repository__breadcrumbs" aria-label="breadcrumb">
                                <Link underline="hover" color="inherit" href="/">
                                    {user?.username}
                                </Link>
                                <Typography color="text.primary">{repo?.name}</Typography>
                                <Chip label={repo?.visibility} variant="outlined" />
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={3}>
                            <ButtonGroup className="repository__action-buttons" variant="outlined" aria-label="outlined button group">
                                <Button
                                    className="repository__action-button"
                                    variant={starred ? 'contained' : 'outlined'}
                                    startIcon={<StarIcon />}
                                    onClick={handleStarClick}
                                >
                                    {starred ? 'Unstar' : 'Star'}
                                </Button>
                                <Button
                                    className="repository__action-button"
                                    variant={watching ? 'contained' : 'outlined'}
                                    startIcon={<VisibilityIcon />}
                                    onClick={handleWatchClick}
                                >
                                    {watching ? 'Unwatch' : 'Watch'}
                                </Button>
                                <Button className="repository__action-button" startIcon={<GitHubIcon />} onClick={handleForkClick}>
                                    fork
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <TabContext value={tab}>
                        <Box sx={{ borderBottom: 1, borderTop: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}>
                                <Tab label="Code" value="1" />
                                <Tab label="Issues" value="2" />
                                <Tab label="Pull Requests" value="3" />
                                <Tab label="Settings" value="4" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {repo?.id !== undefined && (
                                <AboutRepository repo={repo} setOpen={setOpen} setToastOptions={setToastOptions}></AboutRepository>
                            )}
                        </TabPanel>
                        <TabPanel value="2">Issues</TabPanel>
                        <TabPanel value="3">
                            <PullRequestDisplay setOpen={setOpen} setToastOptions={setToastOptions}></PullRequestDisplay>
                        </TabPanel>
                        <TabPanel value="4">
                          <ManageAccess repo={repo} />
                        </TabPanel>
                        <TabPanel value="5">
                            <CreateFork repo={repo} user={user}></CreateFork>
                        </TabPanel>
                    </TabContext>
                </div>
            </div>
        </>
    );

};
export default Repository;
