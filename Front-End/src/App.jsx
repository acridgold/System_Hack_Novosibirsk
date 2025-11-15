import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './store/store';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';

// ===== МОЩНАЯ АНИМАЦИЯ ГРАДИЕНТА =====
const gradientAnimation = `
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @keyframes gradientPulse {
    0%, 100% {
      background-position: 0% 50%;
      filter: brightness(1);
    }
    50% {
      background-position: 100% 50%;
      filter: brightness(1.15);
    }
  }
  
  @keyframes gradientRotate {
    0% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    75% {
      background-position: 0% 100%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = gradientAnimation;
    document.head.appendChild(style);
}

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#00AA44',
            light: '#00FF66',
            dark: '#006622',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00DD55',
            light: '#33FF88',
            dark: '#00AA33',
        },
        background: {
            default: '#F0F9F5',
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
                    padding: '12px 28px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    boxShadow: '0 4px 16px rgba(0, 170, 68, 0.3)',
                    backgroundSize: '300% 300%',
                    '&:hover': {
                        boxShadow: '0 12px 32px rgba(0, 255, 102, 0.5)',
                        transform: 'translateY(-3px) scale(1.02)',
                        animation: 'gradientPulse 2s ease infinite',
                    },
                    '&:active': {
                        transform: 'translateY(-1px) scale(0.98)',
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
                        borderColor: '#00FF66',
                        boxShadow: '0 8px 24px rgba(0, 255, 102, 0.2)',
                        transform: 'translateY(-4px)',
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
                    background: 'linear-gradient(90deg, #FFFFFF 0%, #F0F9F5 50%, #E0F2EA 100%)',
                    backgroundSize: '200% 200%',
                    color: '#111827',
                    borderBottom: '3px solid',
                    borderImage: 'linear-gradient(90deg, #00AA44, #00FF66, #00DD55) 1',
                    boxShadow: '0 4px 16px rgba(0, 170, 68, 0.15)',
                    backdropFilter: 'blur(10px)',
                    animation: 'gradientShift 8s ease infinite',
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
                        <Route path="/register" element={<Register />} />
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
