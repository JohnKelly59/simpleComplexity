import { Box } from '@mui/material';
import Hero from './Hero';
import Features from './Features';
import Demo from './Demo';
import Pricing from './Pricing';
import Footer from './Footer';

function LandingPageLayout ()
{
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Hero />
                <Demo />
                <Features />
                <Pricing />
            </Box>
            <Footer variant="default" />
        </Box>
    );
}

export default LandingPageLayout;