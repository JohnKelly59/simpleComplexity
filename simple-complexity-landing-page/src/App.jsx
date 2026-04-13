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
import FAQPage from './pages/FAQPage';
import SimpleGroupFormsPage from './pages/SimpleGroupFormsPage';
import HipaaCompliancePage from './pages/HipaaCompliancePage';

const SubPageLayout = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#f8f9fa',
      color: '#1a1a2e',
    }}
  >
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        pt: '72px',
      }}
    >
      <Outlet />
    </Box>
    <Footer />
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
            <Route element={<SubPageLayout />}>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/simple-group-forms" element={<SimpleGroupFormsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/hipaa" element={<HipaaCompliancePage />} />
            </Route>
          </Routes>
        </NavigationDrawer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
