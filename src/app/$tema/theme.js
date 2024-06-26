'use client'
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#4B4B5C',
            main: '#24242c',
            dark: '#0F0F12',
            contrastText: '#fff',
        },
        secondary: {
            light: '#155A96',
            main: '#104674',
            dark: '#0D375C',
            contrastText: '#000',
        },
    },
});
