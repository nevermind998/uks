import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Badge,
  Box,
  Breadcrumbs,
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

const Repository = () => {
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
      const data: RepositoryDto = await getRepositoryById(id ? parseInt(id) : 0);
      return data;
    },
  });

  const { data: stargazers } = useQuery({
    queryKey: ['FETCH_STARGAZERS'],
    queryFn: async () => {
      const data: ActionDto[] = await getRepositoryStargazers(id ? parseInt(id) : 0);
      return data;
    },
  });

  const { data: watchers } = useQuery({
    queryKey: ['FETCH_WATCHERS'],
    queryFn: async () => {
      const data: ActionDto[] = await getRepositoryWatchers(id ? parseInt(id) : 0);
      return data;
    },
  });

  const { data: forks } = useQuery({
    queryKey: ['FETCH_FORKS'],
    queryFn: async () => {
      console.log('ID ======> ', id);
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
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="">
              {repo?.owner}
            </Link>
            <Typography color="text.primary">{repo?.name}</Typography>
            <Chip label={repo?.visibility} variant="outlined" />
          </Breadcrumbs>
          <TabContext value="">
            <Box sx={{ borderBottom: 1, borderTop: 1, borderColor: 'divider' }}>
              <TabList aria-label="lab API tabs example">
                <Tab label="Code" value="1" />
                <Tab label="Issues" value="2" />
                <Tab label="Pull Requests" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">Code</TabPanel>
            <TabPanel value="2">Issues</TabPanel>
            <TabPanel value="3">Pull Requests</TabPanel>
          </TabContext>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <div>
                <p>Repository</p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <p>About</p>
              <Divider light />
              <p>{repo?.description}</p>
              <Divider light />
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Badge badgeContent={stargazers ? stargazers.length : 0} color="primary">
                        <StarIcon color="action" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Stars" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Badge badgeContent={watchers ? watchers.length : 0} color="primary">
                        <VisibilityIcon color="action" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Watching" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Badge badgeContent={forks ? forks.length : 0} color="primary">
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
