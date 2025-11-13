import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
} from '@mui/material';
import {
    Psychology,
    Logout,
    Person,
    Menu as MenuIcon
} from '@mui/icons-material';
import { logout } from '../../store/slices/userSlice';

export default function Header({ onMenuClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        navigate('/');
    };

    const navItems = [
        { label: 'Диагностика', path: '/assessment' },
        { label: 'Дашборд', path: '/dashboard' },
        { label: 'Рекомендации', path: '/recommendations' },
    ];

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #F0F9F5 100%)',
                borderBottom: '2px solid #00AA44',
                boxShadow: '0 2px 8px rgba(0, 170, 68, 0.08)',
            }}
        >
            <Toolbar sx={{ py: 1 }}>
                {/* Logo */}
                <Box
                    onClick={() => navigate('/')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        mr: 4,
                    }}
                >
                    <Box
                        sx={{
                            p: 0.75,
                            background: 'linear-gradient(135deg, #00AA44 0%, #33CC77 100%)',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Psychology sx={{ fontSize: 28, color: 'white' }} />
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #00AA44 0%, #1DB954 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: '1.25rem',
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        SDEK AI
                    </Typography>
                </Box>

                {/* Desktop Menu */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flex: 1 }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                color: location.pathname === item.path ? '#00AA44' : '#4B5563',
                                fontWeight: location.pathname === item.path ? 600 : 500,
                                position: 'relative',
                                '&::after': location.pathname === item.path ? {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    left: 0,
                                    right: 0,
                                    height: 2.5,
                                    background: 'linear-gradient(90deg, #00AA44 0%, #33CC77 100%)',
                                    borderRadius: 1,
                                } : {},
                                '&:hover': {
                                    color: '#00AA44',
                                },
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                {/* Auth Section */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
                    {isAuthenticated ? (
                        <>
                            <IconButton onClick={handleMenu}>
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        background: 'linear-gradient(135deg, #00AA44 0%, #33CC77 100%)',
                                        color: 'white',
                                        fontWeight: 700,
                                    }}
                                >
                                    {user?.name?.charAt(0) || 'U'}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                    <Person sx={{ mr: 1, fontSize: 20, color: '#00AA44' }} /> Профиль
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <Logout sx={{ mr: 1, fontSize: 20, color: '#EF4444' }} /> Выход
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                background: 'linear-gradient(135deg, #00AA44 0%, #33CC77 100%)',
                                color: 'white',
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(0, 170, 68, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1DB954 0%, #33CC77 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(0, 170, 68, 0.3)',
                                },
                                transition: 'all 0.2s',
                            }}
                        >
                            Войти
                        </Button>
                    )}

                    {/* Mobile Menu */}
                    <IconButton
                        onClick={onMenuClick}
                        sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
