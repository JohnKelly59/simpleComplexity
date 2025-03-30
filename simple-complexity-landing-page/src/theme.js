import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#116530', // Green from your logo
        },
        secondary: {
            main: '#D4A017', // Gold from your logo
        },
        background: {
            default: '#ffffff', // White page background
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h6: { fontWeight: 400 },
    },
});

export default theme;
