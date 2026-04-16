import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Fade,
  Stack,
  Button,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import MedicationIcon from '@mui/icons-material/Medication';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const pillars = [
  {
    title: 'Resident Census Sync',
    icon: <PersonSearchIcon color="primary" fontSize="large" />,
    points: [
      'Automatically import your full resident census from PointClickCare.',
      'Keep resident demographics, room assignments, and status in sync.',
      'Eliminate duplicate data entry across systems.',
      'New admissions and discharges reflected in real time.',
    ],
  },
  {
    title: 'Medication Sync (eMAR)',
    icon: <MedicationIcon color="primary" fontSize="large" />,
    points: [
      'Pull active medication orders directly from PCC into SimpleGroup.',
      'Sync dosages, schedules, routes, and prescriber information.',
      'Keep your eMAR aligned without manual reconciliation.',
      'Track medication changes as they happen in PCC.',
    ],
  },
  {
    title: 'Vitals & Clinical Data',
    icon: <MonitorHeartIcon color="primary" fontSize="large" />,
    points: [
      'Import vitals readings — blood pressure, heart rate, temperature, and more.',
      'View PCC clinical data alongside SimpleGroup care workflows.',
      'Trend charts combine data from both platforms for a full picture.',
    ],
  },
  {
    title: 'Diagnoses & Allergies',
    icon: <VaccinesIcon color="primary" fontSize="large" />,
    points: [
      'Sync active diagnoses, allergy alerts, and immunization records.',
      'Clinical profiles stay current without re-keying information.',
      'Staff see critical allergy and diagnosis data where they work.',
    ],
  },
  {
    title: 'Emergency Contacts',
    icon: <ContactEmergencyIcon color="primary" fontSize="large" />,
    points: [
      'Import emergency contact details from PCC resident records.',
      'Ensure contact info is always up to date across both platforms.',
      'Accessible to authorized staff directly within SimpleGroup.',
    ],
  },
  {
    title: 'HIPAA-Compliant Data Exchange',
    icon: <SecurityIcon color="primary" fontSize="large" />,
    points: [
      'All data transfers encrypted in transit and at rest.',
      "OAuth 2.0 authentication with PCC's official API.",
      'Full audit trail of every sync event for compliance reporting.',
      'Role-based controls determine who can trigger and view synced data.',
    ],
  },
];

const benefits = [
  {
    icon: <SpeedIcon />,
    title: 'Save Hours Every Day',
    desc: 'Stop copying data between systems. Automated sync eliminates manual data entry and reduces errors.',
  },
  {
    icon: <CloudSyncIcon />,
    title: 'Real-Time Accuracy',
    desc: 'Changes in PointClickCare flow into SimpleGroup automatically, so your team always works with current data.',
  },
  {
    icon: <FactCheckIcon />,
    title: 'Audit-Ready Records',
    desc: 'Every sync is logged with timestamps, user attribution, and data diffs for complete regulatory visibility.',
  },
  {
    icon: <IntegrationInstructionsIcon />,
    title: 'Zero Workflow Disruption',
    desc: "Keep using PCC as your EHR while extending its data into SimpleGroup's family engagement and operations tools.",
  },
];

const highlights = [
  { label: 'Resident Census', tone: '#116530' },
  { label: 'eMAR Medications', tone: '#116530' },
  { label: 'Vitals & Diagnoses', tone: '#116530' },
  { label: 'HIPAA Compliant', tone: '#116530' },
];

const PccIntegrationPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 7 }, px: { xs: 2, md: 3 }, minHeight: '100vh', display: 'flex', alignItems: 'flex-start' }}>
      <Container maxWidth="lg">
        <Fade in={loaded} timeout={800}>
          <Box>
            {/* Header card */}
            <Card
              elevation={0}
              sx={{
                mb: { xs: 4, md: 6 },
                p: { xs: 3, md: 5 },
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(17,101,48,0.03) 0%, rgba(212,160,23,0.03) 100%)',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {highlights.map((h) => (
                  <Chip
                    key={h.label}
                    label={h.label}
                    size="small"
                    sx={{
                      bgcolor: `${h.tone}12`,
                      color: h.tone,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Stack>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: '#1a1a2e',
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                PointClickCare Integration
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#4a5568', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.8 }}
              >
                SimpleGroup connects directly with PointClickCare to sync resident data, medications,
                vitals, diagnoses, and more — so your team works from one source of truth without
                switching between systems or re-entering data.
              </Typography>
            </Card>

            {/* Benefits row */}
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: '#1a1a2e', mb: 3, fontSize: { xs: '1.4rem', md: '1.75rem' } }}
            >
              Why Integrate with PCC?
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                mb: { xs: 5, md: 7 },
              }}
            >
              {benefits.map((b) => (
                <Card
                  key={b.title}
                  elevation={0}
                  sx={{
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
                        bgcolor: 'rgba(17,101,48,0.07)',
                        color: '#116530',
                      }}
                    >
                      {b.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.75 }}>
                      {b.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.7 }}>
                      {b.desc}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Detailed pillars */}
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: '#1a1a2e', mb: 3, fontSize: { xs: '1.4rem', md: '1.75rem' } }}
            >
              What We Sync
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                mb: { xs: 5, md: 7 },
              }}
            >
              {pillars.map((pillar) => (
                <Card
                  key={pillar.title}
                  elevation={0}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 2.5,
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: '#116530' },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      {pillar.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                        {pillar.title}
                      </Typography>
                    </Stack>
                    <List dense disablePadding>
                      {pillar.points.map((pt, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 0.3 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: '#116530' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={pt}
                            primaryTypographyProps={{ variant: 'body2', color: '#4a5568', lineHeight: 1.65 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* CTA */}
            <Card
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                textAlign: 'center',
                bgcolor: '#fafbfc',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 1.5 }}>
                Ready to Connect SimpleGroup with PointClickCare?
              </Typography>
              <Typography variant="body1" sx={{ color: '#4a5568', mb: 3, maxWidth: 600, mx: 'auto' }}>
                Talk to our team about enabling the PCC integration for your community. Setup is guided and support is included.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, py: 1.3, fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                >
                  Contact Sales
                </Button>
                <Button
                  component={RouterLink}
                  to="/features"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ px: 4, py: 1.3, fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                >
                  See All Features
                </Button>
              </Stack>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PccIntegrationPage;
