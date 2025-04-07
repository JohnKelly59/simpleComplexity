// src/app.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

// Import Layout/Structure Components
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPageLayout from './components/LandingPageLayout';
import ScrollToTop from './components/ScrollToTop';

// Import Page Components
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import BlogListPage from './pages/BlogListPage'; // Import Blog List Page
import BlogPostPage from './pages/BlogPostPage'; // Import Single Blog Post Page
// Optional: Import a NotFoundPage component if you create one

// Layout Component for Non-Landing Pages
const StyledPageLayout = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to right, #116530, #134E8E)',
        color: '#fff',
      }}
    >
      <Outlet />
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
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPageLayout />} />

          {/* Routes for Non-Landing Pages use StyledPageLayout */}
          <Route element={<StyledPageLayout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />

            {/* === Add Blog Routes Here === */}
            <Route path="/blog" element={<BlogListPage />} /> {/* Blog list */}
            <Route path="/blog/:slug" element={<BlogPostPage />} /> {/* Individual blog post */}
            {/* ============================ */}

            {/* Optional: Catch-all '*' route within this layout for a styled 404 */}
            {/* <Route path="*" element={<NotFoundStyledPage />} /> */}
          </Route>

          {/* Optional: Global 404 */}
          {/* <Route path="*" element={<NotFoundDefaultPage />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;