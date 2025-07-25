// src/components/LandingPageLayout.jsx
import { Box } from '@mui/material';
import Hero from './Hero';
import Features from './Features';
import Demo from './Demo';
import Pricing from './Pricing';
import Footer from './Footer';
import DownloadExtension from './DownloadExtension';

function LandingPageLayout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                {/* Add IDs to wrapper Boxes */}
                <Box id="hero-section">
                    <Hero />
                </Box>
                <Box id="demo-section">
                    <Demo />
                </Box>
                <Box id="features-section">
                    <Features />
                </Box>
                <Box id="download-section">
                    <DownloadExtension />
                </Box>
                <Box id="pricing-section">
                    <Pricing />
                </Box>
            </Box>
            <Footer variant="default" />
        </Box>
    );
}

export default LandingPageLayout;