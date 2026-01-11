import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

import Footer from './components/Footer';
import LandingPageLayout from './components/LandingPageLayout';
import ScrollToTop from './components/ScrollToTop';
import NavigationDrawer from './components/NavigationDrawer';


import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import FeaturesPage from './pages/FeaturesPage';
// import BlogListPage from './pages/BlogListPage';
// import BlogPostPage from './pages/BlogPostPage';

const StyledPageLayout = () => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1B5E20 100%)',
        color: '#fff'
    }}>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '80px',
                position: 'relative',
            }}
        >
            {/* Background Overlay for texture/depth */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 0%, transparent 25%), radial-gradient(circle at 80% 50%, #ffffff 0%, transparent 25%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />
            <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </Box>
        </Box>
        <Footer variant="styled" />
    </Box>
);

function App ()
{
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <ScrollToTop />
                <NavigationDrawer>
                    <Routes>
                        <Route path="/" element={<LandingPageLayout />} />
                        <Route element={<StyledPageLayout />}>
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/privacy" element={<PrivacyPolicyPage />} />
                            <Route path="/features" element={<FeaturesPage />} />
                            {/* <Route path="/blog" element={<BlogListPage />} /> */}
                            {/* <Route path="/blog/:slug" element={<BlogPostPage />} /> */}

                        </Route>
                    </Routes>
                </NavigationDrawer>
            </Router>
        </ThemeProvider>
    );
}

export default App;
