// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

// Define your SDK's color palette and other theme settings here
const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#116530', // A shade of green
        },
        secondary: {
            main: '#D4A017', // A shade of gold/yellow
        },
        warning: {
            main: '#f44336', // Red for recording actions
        },
        background: {
            default: '#f7f7f7',
        },
    },
    typography: {
        fontFamily: 'system-ui, sans-serif',
    },
});

export default muiTheme;