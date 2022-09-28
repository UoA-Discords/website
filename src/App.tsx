import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
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
import HomePage from './components/Pages/Home';
import RateLimitedModal from './components/Modals/RateLimited';
import SettingsPage from './components/Pages/Settings';
import FocusedServerModal from './components/Modals/FocusedServer';

const ScrollRestoration = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        const locationHash = window.location.hash;
        if (locationHash !== ``) {
            const element = document.getElementById(locationHash.slice(1));
            element?.scrollIntoView({ behavior: `smooth` });
        }
    }, [pathname]);

    return <></>;
};

const App = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadAllEntries());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <ScrollRestoration />
            <Header />
            <RateLimitedModal />
            <FocusedServerModal />
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
