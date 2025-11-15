import React, { useState } from 'react';
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
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Badge,
} from '@mui/material';
import {
    Psychology,
    Logout,
    Person,
    Menu as MenuIcon,
    Close as CloseIcon,
    Assessment,
    Dashboard as DashboardIcon,
    Lightbulb,
    Groups,
} from '@mui/icons-material';
import { logout } from '../../store/slices/userSlice';
import TeamModal from '../TeamModal';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.user);

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [teamModalOpen, setTeamModalOpen] = useState(false);

    const handleMenu = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        setMobileOpen(false);
        navigate('/');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const handleTeamModalOpen = () => {
        setTeamModalOpen(true);
        setMobileOpen(false);
    };

    const isManager = user?.role === 'manager';

    const navItems = [
        { label: 'Диагностика', path: '/assessment', icon: <Assessment /> },
        { label: 'Дашборд', path: '/dashboard', icon: <DashboardIcon /> },
        { label: 'Рекомендации', path: '/recommendations', icon: <Lightbulb /> },
    ];

    return (
        <>
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
                        onClick={() => handleNavigate('/')}
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
                                backgroundSize: '200% 200%',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    animation: 'gradientShift 3s ease infinite',
                                    transform: 'scale(1.05)',
                                },
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
                            CDEK AI
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

                        {/* Кнопка "Команда" для менеджера (Desktop) */}
                        {isAuthenticated && isManager && (
                            <Button
                                onClick={handleTeamModalOpen}
                                startIcon={<Groups />}
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #00AA44 0%, #1DB954 100%)',
                                    px: 2,
                                    ml: 1,
                                    borderRadius: 2,
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 4px 12px rgba(0, 170, 68, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #00CC55 0%, #00FF66 100%)',
                                        boxShadow: '0 6px 16px rgba(0, 170, 68, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                Команда
                                <Box sx={{ ml: 2 }}>
                                    <Badge
                                        badgeContent={5}
                                        color="error"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                top: -1,
                                                right: -2,
                                            },
                                        }}
                                    >
                                        <Box sx={{ width: 0, height: 0 }} /> {}
                                    </Badge>
                                </Box>

                            </Button>
                        )}
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
                                    display: { xs: 'none', sm: 'flex' },
                                    background: 'linear-gradient(135deg, #00AA44 0%, #33CC77 100%, #1DB954 200%)',
                                    backgroundSize: '200% 200%',
                                    color: 'white',
                                    borderRadius: 2,
                                    px: 3,
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(0, 170, 68, 0.2)',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(0, 170, 68, 0.3)',
                                        transform: 'translateY(-2px)',
                                        animation: 'gradientShift 3s ease infinite',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                Войти
                            </Button>
                        )}

                        {/* Mobile Menu Button */}
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                ml: 1,
                                color: '#00AA44',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 280,
                        background: 'linear-gradient(180deg, #F0F9F5 0%, #FFFFFF 100%)',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    {/* Close Button */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            Меню
                        </Typography>
                        <IconButton onClick={handleDrawerToggle}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Navigation Items */}
                    <List>
                        {navItems.map((item) => (
                            <ListItem
                                button
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    borderRadius: 1,
                                    mb: 1,
                                    backgroundColor: location.pathname === item.path ? '#E0F2EA' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#E0F2EA',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: '#00AA44', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                        color: location.pathname === item.path ? '#00AA44' : '#4B5563',
                                    }}
                                />
                            </ListItem>
                        ))}

                        {/* Кнопка "Команда" для менеджера (Mobile) */}
                        {isAuthenticated && isManager && (
                            <ListItem
                                button
                                onClick={handleTeamModalOpen}
                                sx={{
                                    borderRadius: 1,
                                    mb: 1,
                                    backgroundColor: '#E0F2EA',
                                    border: '2px solid #00AA44',
                                    '&:hover': {
                                        backgroundColor: '#D0EBDF',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: '#00AA44', minWidth: 40 }}>
                                    <Groups />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Команда"
                                    primaryTypographyProps={{
                                        fontWeight: 700,
                                        color: '#00AA44',
                                    }}
                                />
                                <Badge
                                    badgeContent={5}
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                        },
                                    }}
                                />
                            </ListItem>
                        )}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Auth Section */}
                    {isAuthenticated ? (
                        <Box>
                            <ListItem
                                button
                                onClick={() => handleNavigate('/profile')}
                                sx={{
                                    borderRadius: 1,
                                    mb: 1,
                                    '&:hover': { backgroundColor: '#E0F2EA' },
                                }}
                            >
                                <ListItemIcon sx={{ color: '#00AA44', minWidth: 40 }}>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary="Профиль" />
                            </ListItem>

                            <ListItem
                                button
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: 1,
                                    '&:hover': { backgroundColor: '#FEE2E2' },
                                }}
                            >
                                <ListItemIcon sx={{ color: '#EF4444', minWidth: 40 }}>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Выход"
                                    primaryTypographyProps={{ color: '#EF4444' }}
                                />
                            </ListItem>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleNavigate('/login')}
                            sx={{
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                backgroundSize: '300% 300%',
                                color: 'white',
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 700,
                                boxShadow: '0 4px 16px rgba(0, 255, 102, 0.3)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0, 255, 102, 0.5)',
                                    transform: 'translateY(-2px)',
                                    animation: 'gradientPulse 2s ease infinite',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                },
                                transition: 'all 0.3s',
                            }}
                        >
                            Войти
                        </Button>
                    )}
                </Box>
            </Drawer>

            {/* Team Modal */}
            <TeamModal open={teamModalOpen} onClose={() => setTeamModalOpen(false)} />
        </>
    );
}
