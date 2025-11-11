import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './store/store';

import Home from './pages/Home';
import Login from './pages/Login';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';

// ===== СДЭК ЗЕЛЕНАЯ ПАЛИТРА С ГРАДИЕНТАМИ =====
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#00AA44',        // Основной зеленый СДЭК
            light: '#33CC77',       // Светлый зеленый
            dark: '#007722',        // Темный зеленый
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#1DB954',        // Spotify зеленый (дополнительный)
            light: '#4DE369',
            dark: '#1aa34a',
        },
        background: {
            default: '#F0F9F5',     // Светло-зеленый фон
            paper: '#FFFFFF',
        },
        grey: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
        },
        divider: '#E0EFE5',
        success: {
            main: '#10B981',
            light: '#6EE7B7',
            dark: '#047857',
        },
        warning: {
            main: '#F59E0B',
        },
        error: {
            main: '#EF4444',
        },
        info: {
            main: '#3B82F6',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2.25rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '1.875rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '-0.01em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 170, 68, 0.25)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiCard: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    border: '1px solid #E0EFE5',
                    transition: 'all 0.3s',
                    '&:hover': {
                        borderColor: '#33CC77',
                        boxShadow: '0 4px 12px rgba(0, 170, 68, 0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    border: '1px solid #E0EFE5',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#111827',
                    borderBottom: '2px solid #00AA44',
                    boxShadow: 'none',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
    },
});

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
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
        </Provider>
    );
}

export default App;
