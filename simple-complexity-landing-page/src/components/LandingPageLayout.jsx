// src/components/LandingPageLayout.jsx
import { Box } from "@mui/material";
import Footer from "./Footer";
// Simple Group components
import HeroGroup from "./HeroGroup";
import FeaturesGroup from "./FeaturesGroup";
import DemoGroup from "./DemoGroup";
// import PricingGroup from "./PricingGroup";
import DownloadExtensionGroup from "./DownloadExtensionGroup";
import GuidedSetupGroup from "./GuidedSetupGroup";
import TestimonialsGroup from "./TestimonialsGroup";

function LandingPageLayout() {
  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>
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
          {/* <Box id="pricing-section-group">
            <PricingGroup />
          </Box> */}
        </Box>
        <Footer variant="default" />
      </Box>
    </>
  );
}

export default LandingPageLayout;
