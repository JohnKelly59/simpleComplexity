// src/components/NavigationDrawer.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import
    {
        Box,
        IconButton,
        Drawer,
        List,
        ListItem,
        ListItemButton,
        ListItemText,
        ListItemIcon,
        Divider,
        Fab,
        useTheme,
    } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ArticleIcon from '@mui/icons-material/Article';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GetAppIcon from '@mui/icons-material/GetApp';
import PhoneIcone from '@mui/icons-material/Phone';
import ShowIcon from '@mui/icons-material/Slideshow';


const drawerWidth = 280;

const scrollToSection = (sectionId) =>
{
    const section = document.getElementById(sectionId);
    if (section)
    {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

function NavigationDrawer ({ children })
{
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleDrawerToggle = () =>
    {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path, sectionId = null) =>
    {
        setMobileOpen(false);
        if (path === '/' && sectionId)
        {
            if (window.location.pathname === '/')
            {
                scrollToSection(sectionId);
            } else
            {
                navigate('/'); s
                setTimeout(() => scrollToSection(sectionId), 100);
            }
        } else
        {
            navigate(path);
        }
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/', sectionId: 'hero-section-group' },
        { text: 'Demo', icon: <OndemandVideoIcon />, path: '/', sectionId: 'demo-section-group' },
        { text: 'Features', icon: <ChecklistIcon />, path: '/', sectionId: 'features-section-group' },
        { text: 'Download', icon: <GetAppIcon />, path: '/', sectionId: 'download-section-group' },
        { text: 'Guided Setup', icon: <PhoneIcone />, path: '/', sectionId: 'guided-setup-section-group' },
        { text: 'Testimonials', icon: <InfoIcon />, path: '/', sectionId: 'testimonials-section-group' },
        { text: 'Pricing', icon: <AttachMoneyIcon />, path: '/', sectionId: 'pricing-section-group' },
        { type: 'divider' },
        { text: 'About', icon: <InfoIcon />, path: '/about' },
        { text: 'Blog', icon: <ArticleIcon />, path: '/blog' },
        { text: 'Contact', icon: <ContactMailIcon />, path: '/contact' },
        { text: 'Privacy Policy', icon: <PrivacyTipIcon />, path: '/privacy' },
    ];

    const drawerContent = (
        <Box sx={{ width: drawerWidth }} role="presentation">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item, index) =>
                {
                    if (item.type === 'divider')
                    {
                        return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
                    }
                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => handleNavigation(item.path, item.sectionId)}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Fab
                color="primary"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 16,
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                    }
                }}
            >
                <MenuIcon />
            </Fab>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                {children}
            </Box>
        </Box>
    );
}

export default NavigationDrawer;