import { Box, Container, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneIcon from '@mui/icons-material/Phone';
import { Link as RouterLink } from 'react-router-dom';

const CallToAction = () => (
  <Box
    sx={{
      py: { xs: 8, md: 10 },
      bgcolor: '#1a1a2e',
      color: '#ffffff',
    }}
  >
    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
      <Typography
        variant="overline"
        sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1.5, display: 'block', opacity: 0.9 }}
      >
        Get Started
      </Typography>
      <Typography
        variant="h3"
        component="h2"
        sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
      >
        See How SimpleGroup Works for Your Facility
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 5, maxWidth: 640, mx: 'auto', opacity: 0.75, lineHeight: 1.7, fontSize: '1.05rem' }}
      >
        Schedule a 1-on-1 walkthrough with our team. We&apos;ll assess your facility&apos;s
        needs and show you exactly how the platform fits your operations.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={RouterLink}
          to="/contact"
          endIcon={<ArrowForwardIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            px: 5,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Book a Demo
        </Button>
        <Button
          variant="outlined"
          size="large"
          component="a"
          href="mailto:support@simple-complexity.com"
          startIcon={<PhoneIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#ffffff',
            '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          Contact Sales
        </Button>
      </Stack>
    </Container>
  </Box>
);

export default CallToAction;
