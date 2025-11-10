import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FF6B00',
            light: '#FF8533',
            dark: '#CC5500',
            contrastText: '#fff',
        },
        secondary: {
            main: '#333333',
            light: '#666666',
            dark: '#000000',
        },
        background: {
            default: '#f9f9f9',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Arial", "Helvetica", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router> {/* БЕЗ basename! */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/assessment" element={<Assessment />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
