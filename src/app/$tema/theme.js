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
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label': {
                        color: '#fff', // Color del label en estado normal
                    },
                    '& label.Mui-focused': {
                        color: '#fff', // Color del label en estado enfocado
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#fff', // Color del borde en estado enfocado
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#fff', // Color del borde en estado normal
                        },
                        '&:hover fieldset': {
                            borderColor: '#fff', // Color del borde en estado hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#fff', // Color del borde en estado enfocado
                        },
                        '& input': {
                            color: '#fff', // Color del texto en el input
                        },
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: '#fff', // Color del placeholder
                        opacity: 1, // Asegurarse de que el placeholder no tenga opacidad
                    },
                },
            },
        },
    },
});

export default theme;
