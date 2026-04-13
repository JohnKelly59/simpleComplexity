import { Box, Typography, Button, Container, Stack, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SecurityIcon from '@mui/icons-material/Security';
import screenshot1 from '../assets/screenshots/screenshot1.png';

const trustBadges = [
  { icon: <SecurityIcon sx={{ fontSize: 18 }} />, label: 'HIPAA Compliant' },
  { icon: <VerifiedIcon sx={{ fontSize: 18 }} />, label: '256-bit Encryption' },
  { icon: <PhoneAndroidIcon sx={{ fontSize: 18 }} />, label: 'Web, iOS & Android' },
];

const Hero = () => (
  <Box
    sx={{
      pt: { xs: 14, md: 16 },
      pb: { xs: 8, md: 12 },
      bgcolor: '#fafbfc',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: { xs: 5, md: 6 },
        }}
      >
        {/* Left column */}
        <Box sx={{ flex: 1, maxWidth: { md: '55%' } }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.25rem', md: '3rem', lg: '3.25rem' },
              lineHeight: 1.15,
              color: '#1a1a2e',
              mb: 3,
              letterSpacing: '-0.02em',
            }}
          >
            Senior Care Operations.{' '}
            <Box component="span" sx={{ color: '#116530' }}>
              Unified.
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: '#4a5568',
              fontWeight: 400,
              lineHeight: 1.7,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            SimpleGroup brings clinical workflows, resident admissions, family engagement,
            and regulatory compliance into one platform — purpose-built for Assisted Living,
            Skilled Nursing, Memory Care, and Independent Living communities.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/contact"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Book a Demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="#features-section"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                borderWidth: 2,
                borderColor: '#1a1a2e',
                color: '#1a1a2e',
                '&:hover': { borderWidth: 2, borderColor: '#116530', color: '#116530', bgcolor: 'transparent' },
              }}
            >
              Explore Platform
            </Button>
          </Stack>

          <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

          <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
            {trustBadges.map((badge) => (
              <Stack
                key={badge.label}
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ color: '#64748b' }}
              >
                {badge.icon}
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b', fontSize: '0.8rem' }}>
                  {badge.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Right column — product screenshot */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
            maxWidth: { md: '45%' },
          }}
        >
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
              transform: 'perspective(1200px) rotateY(-3deg)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'perspective(1200px) rotateY(0deg)' },
            }}
          >
            <Box
              component="img"
              src={screenshot1}
              alt="SimpleGroup platform dashboard"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  </Box>
);

export default Hero;
