import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import { Container, Typography } from '@mui/material';
import AboutPage from './components/AboutPage';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import HandleLoginPage from './components/HandleLoginPage';
import NotFound from './components/NotFound';

import './App.css';
import './Logo.css';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    index
                    element={
                        <>
                            <SearchBar />
                            <Container maxWidth="xl" id="app">
                                <Typography variant="h2">hi</Typography>
                            </Container>
                        </>
                    }
                />
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
