import { Box, Divider, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchOpenedIssue, fetchOpenedPrs } from '../../../api/projectManagement';
import { PullRequestDto, StatusEnum } from '../../../Types/pull_request.types';
import { IssuesDto } from '../../../Types/issue.types';

const PulseComponent = ({ repo }: any) => {
  const [openPrsCount, setOpenPrsCount] = useState(0);
  const [closedPrsCount, setClosedPrsCount] = useState(0);
  const [openIssuesCount, setOpenIssuesCount] = useState(0);
  const [closedIssuesCount, setClosedIssuesCount] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('1m');
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));

  const [openIssues, setOpenedIssues] = useState<any[]>([]);
  const [closedIsses, setClosedIssues] = useState<any[]>([]);
  const [openPrs, setOpenPrs] = useState<any[]>([]);
  const [closedPrs, setClosedPrs] = useState<any[]>([]);

  // Function to filter data based on the selected time period
  const filterDataByTimePeriod = () => {
    const currentDate = new Date();
    let startDate;

    switch (selectedPeriod) {
      case '1w':
        startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1m':
        startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = null;
    }
    setStartDate(startDate);
  };

  // Handle period selection change
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
    filterDataByTimePeriod();
    if (openPrs && closedPrs && openIssues && closedIsses) {
      setOpenPrsCount(openPrs.filter((pr) => new Date(pr.created_at).getTime() >= startDate.getTime()).length);
      setClosedPrsCount(closedPrs.filter((pr) => new Date(pr.created_at).getTime() >= startDate.getTime()).length);
      setOpenIssuesCount(openIssues.filter((issue) => issue.created_at!.getTime() >= startDate.getTime()).length);
      setClosedIssuesCount(closedIsses.filter((issue) => issue.created_at!.getTime() >= startDate.getTime()).length);
    }
  };

  useEffect(() => {
    const func = async () => {
      if (repo) {
        const openedIssues: any[] = await fetchOpenedIssue(StatusEnum.OPEN, repo.id);
        setOpenIssuesCount(openedIssues.filter((issue) => new Date(issue.created_at).getTime() >= startDate.getTime()).length);
        setOpenedIssues(openedIssues);
        const closedIssues: any[] = await fetchOpenedIssue(StatusEnum.CLOSED, repo.id);
        setClosedIssuesCount(closedIssues.filter((issue) => new Date(issue.created_at).getTime() >= startDate.getTime()).length);
        setClosedIssues(closedIsses);
        const openPrs: PullRequestDto[] = await fetchOpenedPrs(StatusEnum.OPEN, repo.id);
        setOpenPrsCount(openPrs.filter((pr) => new Date(pr.created_at).getTime() >= startDate.getTime()).length);
        setOpenPrs(openPrs);
        const closedPrs: PullRequestDto[] = await fetchOpenedPrs(StatusEnum.CLOSED, repo.id);
        setClosedPrsCount(closedPrs.filter((pr) => new Date(pr.created_at).getTime() >= startDate.getTime()).length);
        setClosedIssues(closedPrs);
      }
    };

    func();
  }, []);

  return (
    <>
      <FormControl className="repository__period_btn">
        <InputLabel id="demo-simple-select-label">Period</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedPeriod} label="Period" onChange={handlePeriodChange}>
          <MenuItem value="24h">24h</MenuItem>
          <MenuItem value="1w">1 week</MenuItem>
          <MenuItem value="1m">1 month</MenuItem>
        </Select>
      </FormControl>
      <Divider sx={{ width: '100%', mb: 5, mt: 5 }}></Divider>
      <Box sx={{ width: '100%', mb: 2, mt: 5 }}>
        <Typography variant="overline" gutterBottom>
          Pull Requests ( {openPrsCount + closedPrsCount} )
        </Typography>
        <LinearProgress variant="determinate" value={(closedPrsCount / (openPrsCount + closedPrsCount)) * 100} color="success" sx={{ height: 15 }} />
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          Merged ( {closedPrsCount} )
        </Typography>
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          /
        </Typography>
        <Typography variant="overline" gutterBottom>
          Open ( {openPrsCount} )
        </Typography>
      </Box>
      <Box sx={{ width: '100%', mb: 5, mt: 5 }}>
        <Typography variant="overline" gutterBottom>
          Issues ( {openIssuesCount + closedIssuesCount} )
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(closedIssuesCount / (openIssuesCount + closedIssuesCount)) * 100}
          color="warning"
          sx={{ height: 15 }}
        />
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          Closed ( {closedIssuesCount} )
        </Typography>
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          /
        </Typography>
        <Typography variant="overline" gutterBottom>
          Open ( {openIssuesCount} )
        </Typography>
      </Box>
    </>
  );
};
export default PulseComponent;
