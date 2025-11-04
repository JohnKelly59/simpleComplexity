// src/components/LandingPageLayout.jsx
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Hero from "./Hero";
import Features from "./Features";
import Demo from "./Demo";
import Pricing from "./Pricing";
import Footer from "./Footer";
import DownloadExtension from "./DownloadExtension";
import GuidedSetup from "./GuidedSetup";
import Testimonials from "./Testimonials";
// Simple Group components
import HeroGroup from "./HeroGroup";
import FeaturesGroup from "./FeaturesGroup";
import DemoGroup from "./DemoGroup";
import PricingGroup from "./PricingGroup";
import DownloadExtensionGroup from "./DownloadExtensionGroup";
import GuidedSetupGroup from "./GuidedSetupGroup";
import TestimonialsGroup from "./TestimonialsGroup";

function LandingPageLayout ()
{
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) =>
  {
    setActiveTab(newValue);
    // Scroll to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <title>Simple Complexity | AI-Assisted SDK to Simplify Forms</title>
      <meta
        name="description"
        content="Simplify your forms and grow your business. Simple Complexity's AI-assisted SDK helps reduce support tickets and boost form completion rates."
      />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'none',
                }
              }}
            >
              <Tab label="Simple Group" />
              <Tab label="Simple Form" />
            </Tabs>
          </Box>
        </Box>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {activeTab === 0 ? (
            // Simple Group Tab
            <>
              <Box id="hero-section-group">
                <HeroGroup />
              </Box>
              <Box id="demo-section-group">
                <DemoGroup />
              </Box>
              <Box id="features-section-group">
                <FeaturesGroup />
              </Box>
              <Box id="download-section-group">
                <DownloadExtensionGroup />
              </Box>
              <Box id="guided-setup-section-group">
                <GuidedSetupGroup />
              </Box>
              <Box id="testimonials-section-group">
                <TestimonialsGroup />
              </Box>
              <Box id="pricing-section-group">
                <PricingGroup />
              </Box>
            </>
          ) : (
            // Simple Form Tab
            <>
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
              <Box id="guided-setup-section">
                <GuidedSetup />
              </Box>
              <Box id="testimonials-section">
                <Testimonials />
              </Box>
              <Box id="pricing-section">
                <Pricing />
              </Box>
            </>
          )}
        </Box>
        <Footer variant="default" />
      </Box>
    </>
  );
}

export default LandingPageLayout;
