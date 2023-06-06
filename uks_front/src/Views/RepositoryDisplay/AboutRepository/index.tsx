import { Badge, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useQuery } from 'react-query';
import { ActionDto } from '../../../Types/action.types';
import { getRepositoryStargazers, getRepositoryWatchers, getRepositoryForks } from '../../../api/repositories';

const AboutRepository = ({ repo, setToastOptions, setOpen }: any) => {
  const { data: stargazers } = useQuery({
    queryKey: ['FETCH_STARGAZERS'],
    queryFn: async () => {
      console.log(repo);
      if (repo.id) {
        const data: ActionDto[] = await getRepositoryStargazers(repo.id ? parseInt(repo.id) : 0);
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
        const data: ActionDto[] = await getRepositoryWatchers(repo.id ? parseInt(repo.id) : 0);
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
        const data: ActionDto[] = await getRepositoryForks(parseInt(repo.id));
        return data;
      } else {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    },
  });
  return (
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
            <ListItemButton>
              <ListItemIcon>
                <Badge badgeContent={stargazers?.length} color="primary">
                  <StarIcon color="action" />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Stars" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Badge badgeContent={watchers?.length} color="primary">
                  <VisibilityIcon color="action" />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Watching" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
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
  );
};

export default AboutRepository;
