import { Autocomplete, Badge, Button, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useQuery } from 'react-query';
import { getRepositoryStargazers, getRepositoryWatchers, getRepositoryForks, getRepositoryBranches } from '../../../api/repositories';
import Stargazers from '../Stargazers';
import { useState } from 'react';
import Watchers from '../Watchers';
import Forks from '../Forks';
import { UserProfileDto } from '../../../Types/user.types';
import Branch from '../../Branch';
import BranchSettings from '../BranchSettings';

const AboutRepository = ({ repo, setToastOptions, setOpen }: any) => {
    const [tab, setTab] = useState('about');
    const [selectedBranch, setSelectedBranch] = useState(repo.default_branch);

    const { data: stargazers } = useQuery({
        queryKey: ['FETCH_STARGAZERS'],
        queryFn: async () => {
            console.log(repo);
            if (repo.id) {
                const data: UserProfileDto[] = await getRepositoryStargazers(repo.id ? parseInt(repo.id) : 0);
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        },
    });

    const { data: watchers } = useQuery({
        queryKey: ['FETCH_WATCHERS'],
        queryFn: async () => {
            if (repo.id) {
                const data: UserProfileDto[] = await getRepositoryWatchers(repo.id ? parseInt(repo.id) : 0);
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        },
    });

    const { data: forks } = useQuery({
        queryKey: ['FETCH_FORKS'],
        queryFn: async () => {
            if (repo.id) {
                const data: any[] = await getRepositoryForks(parseInt(repo.id));
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        },
    });

    const { data: branches, refetch } = useQuery({
        queryKey: ['FETCH_BRANCHES'],
        refetchOnMount: true,
        queryFn: async () => {
            if (repo.id) {
                const data: any[] = await getRepositoryBranches(parseInt(repo.id));
                return data;
            } else {
                setToastOptions({ message: 'Error happened!', type: 'error' });
                setOpen(true);
            }
        },
    });

    function isOptionEqualToValue(option: any, value: any) {
        if (value.value === '') return true;
        return option.value === value.value;
    }

    return (
        <>
            {tab === 'about' && (
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <Autocomplete
                                    className="repository__autocomplete"
                                    disablePortal
                                    id="branches"
                                    options={branches?.map((b: any) => ({ value: b.id, label: b.name })) || []}
                                    isOptionEqualToValue={isOptionEqualToValue}
                                    onChange={(event, value: any) => {
                                        setSelectedBranch(value.label);
                                    }}
                                    sx={{ width: 180 }}
                                    size="small"
                                    renderInput={(params: any) => <TextField {...params} placeholder={selectedBranch} variant="standard" />}
                                />
                                |
                                <Button
                                    onClick={() => setTab('branch-settings')}
                                    className="modal-dialog-form__button"
                                    variant="text"
                                    startIcon={<img src="/img/branch.svg" alt="Branch" />}
                                >
                                    <b>{branches?.length}</b> &nbsp; branches
                                </Button>
                                |
                                <Branch refetch={refetch}/>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>About</h3>
                        <Divider light />
                        <p>
                            <i>{repo?.description}</i>
                        </p>
                        <Divider light />
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        setTab('stargazers');
                                    }}
                                >
                                    <ListItemIcon>
                                        <Badge badgeContent={stargazers?.length} color="primary">
                                            <StarIcon color="action" />
                                        </Badge>
                                    </ListItemIcon>
                                    <ListItemText primary="Stars" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        setTab('watchers');
                                    }}
                                >
                                    <ListItemIcon>
                                        <Badge badgeContent={watchers?.length} color="primary">
                                            <VisibilityIcon color="action" />
                                        </Badge>
                                    </ListItemIcon>
                                    <ListItemText primary="Watching" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        setTab('forks');
                                    }}
                                >
                                    <ListItemIcon>
                                        <Badge badgeContent={forks?.length} color="primary">
                                            <GitHubIcon color="action" />
                                        </Badge>
                                    </ListItemIcon>
                                    <ListItemText primary="Forks" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            )}
            {tab === 'stargazers' && <Stargazers stargazers={stargazers}></Stargazers>}
            {tab === 'watchers' && <Watchers watchers={watchers}></Watchers>}
            {tab === 'forks' && <Forks forks={forks}></Forks>}
            {tab === 'branch-settings' && <BranchSettings branches={branches} repo={repo} refetch={refetch} setTab={setTab}/>}
        </>
    );
};

export default AboutRepository;
