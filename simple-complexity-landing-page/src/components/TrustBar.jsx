import { Box, Container, Stack, Typography, Divider } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const metrics = [
  { icon: <ApartmentIcon />, value: 'Multi-Facility', label: 'Architecture' },
  { icon: <PeopleIcon />, value: 'Unlimited', label: 'Staff & Family Users' },
  { icon: <DescriptionIcon />, value: '40+', label: 'Clinical Modules' },
  { icon: <VerifiedUserIcon />, value: '99.9%', label: 'Platform Uptime' },
];

const TrustBar = () => (
  <Box sx={{ py: 4, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
        spacing={{ xs: 3, sm: 0 }}
        justifyContent="space-around"
        alignItems="center"
      >
        {metrics.map((m) => (
          <Stack key={m.label} direction="row" spacing={1.5} alignItems="center" sx={{ px: 2 }}>
            <Box sx={{ color: '#116530', display: 'flex' }}>{m.icon}</Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2, fontSize: '1.1rem' }}>
                {m.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, letterSpacing: 0.3 }}>
                {m.label}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Container>
  </Box>
);

export default TrustBar;
