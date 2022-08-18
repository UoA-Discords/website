import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import { Container, Typography } from '@mui/material';
import AboutPage from './components/AboutPage';
import Header from './components/Header';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    index
                    element={
                        <>
                            <Header />
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
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
