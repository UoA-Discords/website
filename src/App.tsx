import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import { Container, Typography } from '@mui/material';
import AboutPage from './components/AboutPage';
import Header from './components/Header';
import SearchBar from './components/SearchBar';

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
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
