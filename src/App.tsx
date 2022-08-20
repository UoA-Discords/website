import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import { Container } from '@mui/material';
import AboutPage from './components/AboutPage';
import Header from './components/Header';
import HandleLoginPage from './components/HandleLoginPage';
import NotFound from './components/NotFound';
import './App.css';
import './Logo.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAllEntries } from './redux/slices/entryManager';
import { AppDispatch } from './redux/store';
import Home from './components/Home';
import RateLimitNotification from './components/RateLimitNotification';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadAllEntries());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Header />
            <RateLimitNotification />
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
                            <HandleLoginPage />
                        </Container>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
