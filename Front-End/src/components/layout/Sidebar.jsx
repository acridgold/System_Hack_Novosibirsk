import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import {
    Home,
    Assessment,
    Dashboard,
    Lightbulb,
    Person,
} from '@mui/icons-material';

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Главная', icon: <Home />, path: '/' },
        { text: 'Диагностика', icon: <Assessment />, path: '/assessment' },
        { text: 'Дашборд', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Рекомендации', icon: <Lightbulb />, path: '/recommendations' },
        { text: 'Профиль', icon: <Person />, path: '/profile' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const drawerContent = (
        <Box sx={{ width: 250, pt: 2 }}>
            <Box sx={{ px: 2, mb: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                    Навигация
                </Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'action.active' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Sidebar */}
            <Box
                sx={{
                    width: 250,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                    borderRight: 1,
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                }}
            >
                {drawerContent}
            </Box>
        </>
    );
};

export default Sidebar;
