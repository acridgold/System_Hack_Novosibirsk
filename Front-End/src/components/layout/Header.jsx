import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Logout,
    Settings,
    Psychology,
} from '@mui/icons-material';

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'user/logout' });
        navigate('/login');
        handleClose();
    };

    return (
        <AppBar position="sticky" elevation={2}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Box display="flex" alignItems="center" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <Psychology sx={{ fontSize: 32, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                        SDEK Burnout AI
                    </Typography>
                </Box>

                {isAuthenticated ? (
                    <>
                        <Button color="inherit" onClick={() => navigate('/assessment')} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Диагностика
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/dashboard')} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Дашборд
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/recommendations')} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Рекомендации
                        </Button>

                        <IconButton color="inherit" onClick={handleMenu}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                {user?.name?.charAt(0) || 'U'}
                            </Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                <AccountCircle sx={{ mr: 1 }} /> Профиль
                            </MenuItem>
                            <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                                <Settings sx={{ mr: 1 }} /> Настройки
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Logout sx={{ mr: 1 }} /> Выход
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Войти
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
