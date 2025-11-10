import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <Box sx={{ display: 'flex', flex: 1 }}>
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box component="main" sx={{ flex: 1, p: 0, backgroundColor: 'background.default' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
