import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { InfoPage, HomePage, SettingsPage, NotFoundPage } from './pages';
import { theme } from './theme';
import { ContextProviders } from './providers';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const App: React.FC = () => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <ContextProviders>
                <Header />
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="info" element={<InfoPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </ContextProviders>
        </ThemeProvider>
    </BrowserRouter>
);
