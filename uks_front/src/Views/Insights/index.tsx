import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import React, { SyntheticEvent, useState } from 'react';
import PulseComponent from './Pulse';
import CommitActivity from './CommitsTab';
import Contributors from './Contributors';

const Insights = ({ repo }: any) => {
  const [tab, setTab] = useState('1');
  const handleChange = (event: SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  return (
    <>
      <TabContext value={tab}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <TabList orientation="vertical" value={tab} onChange={handleChange} sx={{ borderRight: 1, borderColor: 'divider' }}>
              <Tab label="Pulse" value="1" />
              <Tab label="Contributors " value="2" />
              <Tab label="Commits" value="3" />
            </TabList>
          </Grid>
          <Grid item xs={10}>
            <TabPanel value="1">
              <PulseComponent repo={repo}></PulseComponent>
            </TabPanel>
            <TabPanel value="2">
              <Contributors></Contributors>
            </TabPanel>
            <TabPanel value="3">
              <CommitActivity></CommitActivity>
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </>
  );
};

export default Insights;
