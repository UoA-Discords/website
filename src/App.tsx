import { ThemeProvider, CssBaseline } from '@mui/material';
import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorDisplayer } from './components/ErrorDisplayer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import {
    InfoPage,
    HomePage,
    SettingsPage,
    NotFoundPage,
    LoginPage,
    ProfilePage,
    UsersPage,
    ServersPage,
} from './pages';
import { ContextProviders } from './providers';
import { theme } from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const App: FC = () => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <ContextProviders>
                <ErrorDisplayer />
                <Header />
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="info" element={<InfoPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="users/:id" element={<ProfilePage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="servers" element={<ServersPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </ContextProviders>
        </ThemeProvider>
    </BrowserRouter>
);
