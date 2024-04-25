import { createTheme, ThemeProvider } from '@mui/material/styles';

export const theme = createTheme({
    components: {
        MuiSlider: {
            styleOverrides: {
                thumb: {
                    backgroundColor: '#222222',
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    padding: '5px',
                    backgroundColor: '#222020cc',
                },
            },
        },
    },
});
