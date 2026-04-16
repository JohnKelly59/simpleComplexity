import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import MedicationIcon from '@mui/icons-material/Medication';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

const capabilities = [
  {
    title: 'Resident Census Sync',
    desc: 'Automatically import and keep your full resident census in sync — demographics, rooms, and admission status.',
    icon: <PersonSearchIcon />,
  },
  {
    title: 'eMAR & Medication Sync',
    desc: "Pull active medication orders, dosages, and schedules directly from PCC into SimpleGroup's eMAR.",
    icon: <MedicationIcon />,
  },
  {
    title: 'Vitals & Diagnoses',
    desc: 'Import vitals, active diagnoses, allergies, and immunization records for complete clinical profiles.',
    icon: <MonitorHeartIcon />,
  },
  {
    title: 'Eliminate Double Entry',
    desc: 'Stop re-keying data across systems. Automated sync saves hours daily and reduces transcription errors.',
    icon: <SpeedIcon />,
  },
  {
    title: 'HIPAA-Compliant Exchange',
    desc: "All data transfers are encrypted and authenticated via PCC's official API with full audit logging.",
    icon: <SecurityIcon />,
  },
];

const PccIntegration = () => (
  <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="overline"
          sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
        >
          EHR Integration
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
        >
          Connected with PointClickCare
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#4a5568', maxWidth: 720, fontSize: '1.05rem', lineHeight: 1.7 }}
        >
          SimpleGroup integrates directly with PointClickCare so your clinical and operational data
          stays in sync — no more switching between systems or manual data reconciliation.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          mb: 5,
        }}
      >
        {capabilities.map((cap) => (
          <Card
            key={cap.title}
            elevation={0}
            sx={{
              height: '100%',
              border: '1px solid #e2e8f0',
              borderRadius: 2.5,
              transition: 'box-shadow 0.2s ease',
              '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(212,160,23,0.08)',
                  color: '#D4A017',
                }}
              >
                {cap.icon}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.75 }}>
                {cap.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.7 }}>
                {cap.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <Button
          component={RouterLink}
          to="/pcc-integration"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SyncIcon />}
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 4,
            py: 1.3,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Learn About PCC Integration
        </Button>
      </Stack>
    </Container>
  </Box>
);

export default PccIntegration;
