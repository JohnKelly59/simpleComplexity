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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DrawIcon from '@mui/icons-material/Draw';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const pillars = [
  {
    title: 'AI Form Intelligence',
    icon: <AutoAwesomeIcon color="primary" fontSize="large" />,
    points: [
      'Generate complete form systems, not just starter drafts.',
      'Build complex forms with conditional sections and dense field sets.',
      'Support operational tables and tables nested within form sections.',
      'Keep human review in control before publishing.',
    ],
  },
  {
    title: 'Manual Form Creation',
    icon: <DrawIcon color="primary" fontSize="large" />,
    points: [
      'Create forms from scratch with custom fields and sections.',
      'Design precise workflows for clinical and facility operations.',
      'Adjust validation, required fields, and structure anytime.',
    ],
  },
  {
    title: 'Access and Governance',
    icon: <SecurityIcon color="primary" fontSize="large" />,
    points: [
      'Forms are related to users for clear accountability.',
      'Apply role-based access controls across teams and facilities.',
      'Set direct per-user access when role defaults are not enough.',
    ],
  },
  {
    title: 'Secure External Sharing',
    icon: <LinkIcon color="primary" fontSize="large" />,
    points: [
      'Generate token-based secure links for external respondents.',
      'No account required — share forms with families and partners.',
      'Track completion status and manage assignment lifecycle.',
    ],
  },
  {
    title: 'Download and Reporting',
    icon: <DownloadForOfflineIcon color="primary" fontSize="large" />,
    points: [
      'Download form submissions as PDFs for audits and records.',
      'Support compliance and operational reporting workflows.',
      'Share structured outputs with downstream systems.',
    ],
  },
];

const highlights = [
  { label: 'AI + Manual Builder', tone: '#116530' },
  { label: 'Role & User Access', tone: '#116530' },
  { label: 'Secure External Links', tone: '#116530' },
  { label: 'Audit-Ready Downloads', tone: '#116530' },
];

const SimpleGroupFormsPage = () => {
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
            <Card
              elevation={0}
              sx={{
                mb: { xs: 4, md: 6 },
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                bgcolor: '#ffffff',
              }}
            >
              <Box sx={{ height: 4, bgcolor: 'primary.main' }} />
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Chip
                  label="Simple Group Forms"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: '#116530',
                    bgcolor: 'rgba(17,101,48,0.08)',
                    border: '1px solid rgba(17,101,48,0.15)',
                  }}
                />
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{ fontWeight: 800, mb: 1.5, color: '#1a1a2e', lineHeight: 1.15 }}
                >
                  Build Forms the Way Care Operations Actually Run
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: '#4a5568', maxWidth: 900, lineHeight: 1.65, fontWeight: 400 }}
                >
                  Generate advanced forms with AI, fine-tune every field manually, share securely
                  with external parties, and keep approvals, permissions, and reporting in one governed system.
                </Typography>
                <Stack direction="row" spacing={1.2} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 1.2 }}>
                  {highlights.map((item) => (
                    <Chip
                      key={item.label}
                      label={item.label}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        color: item.tone,
                        bgcolor: 'rgba(17,101,48,0.06)',
                        border: '1px solid rgba(17,101,48,0.12)',
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                alignItems: 'stretch',
              }}
            >
              {pillars.map((pillar) => (
                <Card
                  key={pillar.title}
                  elevation={0}
                  sx={{
                    border: '1px solid #e2e8f0',
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
                  }}
                >
                  <CardContent sx={{ p: 3. }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4, mb: 1.8 }}>
                      <Box
                        sx={{
                          p: 1.1,
                          borderRadius: 2,
                          bgcolor: 'rgba(17,101,48,0.07)',
                          color: 'primary.main',
                          display: 'inline-flex',
                        }}
                      >
                        {pillar.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                        {pillar.title}
                      </Typography>
                    </Box>
                    <List disablePadding>
                      {pillar.points.map((point) => (
                        <ListItem key={point} disableGutters alignItems="flex-start" sx={{ py: 0.45 }}>
                          <ListItemIcon sx={{ minWidth: 28, mt: 0.55 }}>
                            <CheckCircleIcon sx={{ fontSize: 17, color: '#116530', opacity: 0.7 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={point}
                            primaryTypographyProps={{ sx: { color: '#4a5568', lineHeight: 1.65 } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Card
              elevation={0}
              sx={{
                mt: 4,
                border: '1px solid #e2e8f0',
                bgcolor: '#f8f9fa',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                  <PersonIcon sx={{ color: '#116530' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                    Built for User-Scoped Form Operations
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.75, color: '#4a5568', mb: 2 }}>
                  Forms maintain user-linked accountability, permission-based RBAC,
                  direct user-level controls, secure external sharing, and downloadable submission outputs.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 600, px: 2.8, textTransform: 'none' }}
                >
                  Request a Forms Walkthrough
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default SimpleGroupFormsPage;
