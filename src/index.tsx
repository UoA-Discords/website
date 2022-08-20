import { createTheme, CssBaseline, darkScrollbar, responsiveFontSizes, ThemeProvider } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

let theme = createTheme({
    palette: {
        mode: `dark`,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: darkScrollbar(),
            },
        },
    },
});

theme = responsiveFontSizes(theme);

const container = document.getElementById(`root`)!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <CookiesProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </CookiesProvider>
    </Provider>,
);
