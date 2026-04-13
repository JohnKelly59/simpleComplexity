import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Hero from './Hero';
import TrustBar from './TrustBar';
import WhySimpleGroup from './WhySimpleGroup';
import Features from './Features';
import FormsCapability from './FormsCapability';
import Demo from './Demo';
import VideoSection from './VideoSection';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import DownloadApp from './DownloadApp';
import CallToAction from './CallToAction';

function LandingPageLayout() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.hash?.replace('#', '');
    if (!sectionId) return;
    const timeout = setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
    return () => clearTimeout(timeout);
  }, [location.hash]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box id="hero-section">
          <Hero />
        </Box>
        <TrustBar />
        <Box id="why-section">
          <WhySimpleGroup />
        </Box>
        <Box id="features-section">
          <Features />
        </Box>
        <Box id="forms-section">
          <FormsCapability />
        </Box>
        <Box id="demo-section">
          <Demo />
        </Box>
        <Box id="video-section">
          <VideoSection />
        </Box>
        <Box id="testimonials-section">
          <Testimonials />
        </Box>
        <Box id="pricing-section">
          <Pricing />
        </Box>
        <Box id="download-section">
          <DownloadApp />
        </Box>
        <CallToAction />
      </Box>
      <Footer />
    </Box>
  );
}

export default LandingPageLayout;
