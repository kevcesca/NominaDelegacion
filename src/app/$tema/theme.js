import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#b9274b;',
            main: '#9f2241',
            dark: '#711c31',
            contrastText: '#fff',
        },
        secondary: {
            light: '#e2b673',
            main: '#bc955c',
            dark: '#987849',
            contrastText: '#000',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
            },
        },
    },
});

export default theme;
