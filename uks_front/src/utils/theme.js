import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#393d3f',
    },
    secondary: {
      main: '#bfc0c0',
    },
  },
  typography: {
    // Use a smaller font size for input fields
    fontSize: 14,
  },
});

export default theme;
