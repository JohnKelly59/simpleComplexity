import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GetAppIcon from '@mui/icons-material/GetApp';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import QuizIcon from '@mui/icons-material/Quiz';
import DescriptionIcon from '@mui/icons-material/Description';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SecurityIcon from '@mui/icons-material/Security';

const drawerWidth = 280;

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const navLinks = [
  { text: 'Features', path: '/', sectionId: 'features-section' },
  { text: 'Pricing', path: '/', sectionId: 'pricing-section' },
  { text: 'Forms', path: '/simple-group-forms' },
  { text: 'About', path: '/about' },
  { text: 'FAQ', path: '/faq' },
  { text: 'Contact', path: '/contact' },
];

const drawerItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/', sectionId: 'hero-section' },
  { text: 'Why SimpleGroup', icon: <ChecklistIcon />, path: '/', sectionId: 'why-section' },
  { text: 'Features', icon: <FormatListBulletedIcon />, path: '/', sectionId: 'features-section' },
  { text: 'Forms', icon: <DescriptionIcon />, path: '/', sectionId: 'forms-section' },
  { text: 'Demo', icon: <OndemandVideoIcon />, path: '/', sectionId: 'demo-section' },
  { text: 'Testimonials', icon: <InfoIcon />, path: '/', sectionId: 'testimonials-section' },
  { text: 'Pricing', icon: <AttachMoneyIcon />, path: '/', sectionId: 'pricing-section' },
  { text: 'Download', icon: <GetAppIcon />, path: '/', sectionId: 'download-section' },
  { type: 'divider' },
  { text: 'Full Features', icon: <FormatListBulletedIcon />, path: '/features' },
  { text: 'Simple Group Forms', icon: <DescriptionIcon />, path: '/simple-group-forms' },
  { text: 'About', icon: <InfoIcon />, path: '/about' },
  { text: 'Contact', icon: <ContactMailIcon />, path: '/contact' },
  { text: 'FAQ', icon: <QuizIcon />, path: '/faq' },
  { text: 'HIPAA Compliance', icon: <SecurityIcon />, path: '/hipaa' },
  { text: 'Privacy Policy', icon: <PrivacyTipIcon />, path: '/privacy' },
];

function NavigationDrawer({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavigation = (path, sectionId = null) => {
    setMobileOpen(false);
    if (path === '/' && sectionId) {
      if (location.pathname === '/') {
        scrollToSection(sectionId);
      } else {
        navigate(`/#${sectionId}`);
      }
    } else {
      navigate(path);
    }
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box
          component="img"
          src="/simplegroup-logo.png"
          alt="SimpleGroup Logo"
          sx={{ height: 40, width: 'auto', cursor: 'pointer' }}
          onClick={() => handleNavigation('/')}
        />
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {drawerItems.map((item, index) => {
          if (item.type === 'divider') return <Divider key={`d-${index}`} sx={{ my: 1 }} />;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path, item.sectionId)}>
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}
            onClick={() => handleNavigation('/')}
          >
            <Box
              component="img"
              src="/simplegroup-logo.png"
              alt="SimpleGroup"
              sx={{ height: 36, width: 'auto' }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1a1a2e',
                fontSize: '1.1rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              SimpleGroup
            </Typography>
          </Box>

          {isMd ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  onClick={() => handleNavigation(link.path, link.sectionId)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    color: '#4a5568',
                    fontSize: '0.9rem',
                    '&:hover': { color: '#116530', bgcolor: 'transparent' },
                  }}
                >
                  {link.text}
                </Button>
              ))}
              <Button
                variant="text"
                size="small"
                href="https://simplegroup.simple-complexity.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  color: '#4a5568',
                  fontSize: '0.9rem',
                  ml: 0.5,
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleNavigation('/contact')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  ml: 0.5,
                }}
              >
                Book a Demo
              </Button>
            </Stack>
          ) : (
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#1a1a2e' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}

export default NavigationDrawer;