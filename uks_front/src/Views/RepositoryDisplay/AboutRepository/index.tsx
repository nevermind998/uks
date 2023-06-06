import { Badge, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useQuery } from 'react-query';
import { ActionDto } from '../../../Types/action.types';
import { getRepositoryStargazers, getRepositoryWatchers, getRepositoryForks } from '../../../api/repositories';
import Stargazers from '../Stargazers';
import { useState } from 'react';
import Watchers from '../Watchers';
import Forks from '../Forks';
import { UserProfileDto } from '../../../Types/user.types';

const AboutRepository = ({ repo, setToastOptions, setOpen }: any) => {
  const [tab, setTab] = useState('about');

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
  return (
    <>
      {tab === 'about' && (
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <div>
              <p>Repository</p>
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
      {tab === 'forks' && <Forks></Forks>}
    </>
  );
};

export default AboutRepository;
