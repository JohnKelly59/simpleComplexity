import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

import Footer from './components/Footer';
import LandingPageLayout from './components/LandingPageLayout';
import ScrollToTop from './components/ScrollToTop';
import NavigationDrawer from './components/NavigationDrawer';
import ShowcaseFormPage from './pages/ShowcaseFormPage';

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';

const StyledPageLayout = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '80px',
                background: 'linear-gradient(to right, #116530, #134E8E)',
                color: '#fff',
            }}
        >
            <Outlet />
        </Box>
        <Footer variant="styled" />
    </Box>
);

function App() {
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
                            <Route path="/blog" element={<BlogListPage />} />
                            <Route path="/blog/:slug" element={<BlogPostPage />} />
                            <Route path="/showcase" element={<ShowcaseFormPage />} />
                        </Route>
                    </Routes>
                </NavigationDrawer>
            </Router>
        </ThemeProvider>
    );
}

export default App;
