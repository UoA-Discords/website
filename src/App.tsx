import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import { Container } from '@mui/material';
import AboutPage from './components/Pages/About';
import Header from './components/Header';
import LoginPage from './components/Pages/Login';
import NotFoundPage from './components/Pages/NotFound';
import './App.css';
import './Logo.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAllEntries } from './redux/slices/entryManager';
import { AppDispatch } from './redux/store';
import Home from './components/Home';
import RateLimitedModal from './components/Modals/RateLimited';
import SettingsPage from './components/Pages/Settings';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadAllEntries());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Header />
            <RateLimitedModal />
            <Routes>
                <Route index element={<Home />} />
                <Route
                    path="about"
                    element={
                        <Container maxWidth="xl" id="app">
                            <AboutPage />
                        </Container>
                    }
                />
                <Route
                    path="login"
                    element={
                        <Container maxWidth="xl" id="app">
                            <LoginPage />
                        </Container>
                    }
                />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
