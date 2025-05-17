import { createTheme } from '@angular/material';

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#6200ee',
      light: '#9d46ff',
      dark: '#0a00b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#03dac6',
      light: '#66fff8',
      dark: '#00a896',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#bb86fc',
      light: '#efd6ff',
      dark: '#8858c9',
      contrastText: '#000000',
    },
    secondary: {
      main: '#03dac6',
      light: '#66fff8',
      dark: '#00a896',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
}); 