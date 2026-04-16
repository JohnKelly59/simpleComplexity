import { Box, Container, Link as MuiLink, Typography, IconButton, Stack, Divider, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FaXTwitter, FaTiktok, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa6';

const socials = [
  { href: 'https://x.com/SComplexityLLC', icon: <FaXTwitter />, label: 'X' },
  { href: 'https://www.tiktok.com/@simple.complexityllc', icon: <FaTiktok />, label: 'TikTok' },
  { href: 'https://www.instagram.com/simple_complexity_llc/', icon: <FaInstagram />, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/simple-complexity-llc', icon: <FaLinkedin />, label: 'LinkedIn' },
  { href: 'https://www.facebook.com/share/1BBEF4rned/', icon: <FaFacebook />, label: 'Facebook' },
];

const columns = [
  {
    title: 'Platform',
    links: [
      { to: '/features', label: 'Features' },
      { to: '/simple-group-forms', label: 'Forms' },
      { to: '/#pricing-section', label: 'Pricing' },
      { to: '/pcc-integration', label: 'PCC Integration' },
      { href: 'https://simplegroup.simple-complexity.com', label: 'Login', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact Sales' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/hipaa', label: 'HIPAA Compliance' },
      { to: '/privacy', label: 'Privacy Policy' },
    ],
  },
];

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 6,
      bgcolor: '#1a1a2e',
      color: '#ffffff',
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Brand column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            SimpleGroup
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 280, lineHeight: 1.7, mb: 2 }}>
            The complete platform for senior care operations — clinical, administrative, and family engagement in one place.
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {socials.map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${social.label} page`}
                size="small"
                sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ffffff' } }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Stack>
        </Grid>

        {/* Link columns */}
        {columns.map((col) => (
          <Grid key={col.title} size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
              {col.title}
            </Typography>
            <Stack spacing={1}>
              {col.links.map((link) =>
                link.external ? (
                  <MuiLink
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#ffffff' } }}
                  >
                    {link.label}
                  </MuiLink>
                ) : (
                  <MuiLink
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    underline="none"
                    sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#ffffff' } }}
                  >
                    {link.label}
                  </MuiLink>
                )
              )}
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} Simple Complexity LLC. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
          HIPAA Compliant &middot; SOC 2 Ready &middot; 256-bit Encryption
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default Footer;