import { Box, Divider, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const PulseComponent = () => {
  const mergedCount = 10;
  const openCount = 5;
  const [data, setData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1w');
  const totalCount = mergedCount + openCount;
  const mergedPercentage = (mergedCount / totalCount) * 100;
  const openPercentage = (openCount / totalCount) * 100;

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

    const filteredData = data.filter((item) => {
      //   const itemDate = new Date(item.timestamp);
      //   return startDate && itemDate >= startDate && itemDate <= currentDate;
    });

    return filteredData;
  };

  // Handle period selection change
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredData = filterDataByTimePeriod();
    // Perform further processing or calculations on the filteredData as needed
    console.log(filteredData);
  };

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
          Pull Requests ({totalCount} )
        </Typography>
        <LinearProgress variant="determinate" value={mergedPercentage} color="success" sx={{ height: 15 }} />
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          Merged ({mergedCount})
        </Typography>
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          /
        </Typography>
        <Typography variant="overline" gutterBottom>
          Open({openCount})
        </Typography>
      </Box>
      <Box sx={{ width: '100%', mb: 5, mt: 5 }}>
        <Typography variant="overline" gutterBottom>
          Issues ({totalCount} )
        </Typography>
        <LinearProgress variant="determinate" value={mergedPercentage} color="warning" sx={{ height: 15 }} />
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          Closed ({mergedCount})
        </Typography>
        <Typography variant="overline" gutterBottom sx={{ mr: 2 }}>
          /
        </Typography>
        <Typography variant="overline" gutterBottom>
          Open({openCount})
        </Typography>
      </Box>
    </>
  );
};
export default PulseComponent;
