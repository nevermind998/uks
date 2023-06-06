import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useQuery } from 'react-query';
import { RepositoryDto } from '../../Types/repository.types';
import { getRepositoryById, getRepositoryForks, getRepositoryStargazers, getRepositoryWatchers } from '../../api/repositories';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionDto } from '../../Types/action.types';
import { useState } from 'react';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../Store/slices/auth.slice';

const Repository = () => {
  const user = useSelector(selectAuth);
  const navigate = useNavigate();
  const { id } = useParams();
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
  });
  const [open, setOpen] = useState<boolean>(false);

  const { data: repo } = useQuery({
    queryKey: ['FETCH_REPO'],
    queryFn: async () => {
      if (id) {
        const data: RepositoryDto = await getRepositoryById(id ? parseInt(id) : 0);
        return data;
      } else {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    },
  });

  const { data: stargazers } = useQuery({
    queryKey: ['FETCH_STARGAZERS'],
    queryFn: async () => {
      if (id) {
        const data: ActionDto[] = await getRepositoryStargazers(id ? parseInt(id) : 0);
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
      if (id) {
        const data: ActionDto[] = await getRepositoryWatchers(id ? parseInt(id) : 0);
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
      if (id) {
        const data: ActionDto[] = await getRepositoryForks(parseInt(id));
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
                <Link underline="hover" color="inherit" href="">
                  {user?.username}
                </Link>
                <Typography color="text.primary">
                  {repo?.name} <Chip label={repo?.visibility} variant="outlined" />
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={3}>
              <ButtonGroup className="repository__action-buttons" variant="outlined" aria-label="outlined button group">
                <Button>
                  <StarIcon color="action" /> star
                </Button>
                <Button>
                  <VisibilityIcon color="action" />
                  watch
                </Button>
                <Button>
                  <GitHubIcon color="action" />
                  fork
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <TabContext value="">
            <Box sx={{ borderBottom: 1, borderTop: 1, borderColor: 'divider' }}>
              <TabList aria-label="lab API tabs example">
                <Tab label="Code" value="1" />
                <Tab label="Issues" value="2" />
                <Tab label="Pull Requests" value="3" />
                <Tab label="Settings" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">Code</TabPanel>
            <TabPanel value="2">Issues</TabPanel>
            <TabPanel value="3">Pull Requests</TabPanel>
            <TabPanel value="3">Settings</TabPanel>
          </TabContext>

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
                <i>No description, website, or topics provided.</i>
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
        </div>
      </div>
    </>
  );
};
export default Repository;

const AboutRepository = () => {
  return ();
}
