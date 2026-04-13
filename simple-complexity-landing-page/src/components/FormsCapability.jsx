import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DrawIcon from '@mui/icons-material/Draw';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

const capabilities = [
  {
    title: 'AI Form Intelligence',
    desc: 'AI generates complete multi-section forms with conditional logic, structured tables, and nested fields — not just starter templates.',
    icon: <AutoAwesomeIcon />,
  },
  {
    title: 'Manual Form Builder',
    desc: 'Build forms from scratch with full control over sections, field types, validation rules, and completion workflows.',
    icon: <DrawIcon />,
  },
  {
    title: 'Role-Based & User Access',
    desc: 'Govern every form with RBAC plus direct per-user controls for precise operational access governance.',
    icon: <SecurityIcon />,
  },
  {
    title: 'Secure External Links',
    desc: 'Generate token-based secure links so external parties can submit forms without needing an account.',
    icon: <LinkIcon />,
  },
  {
    title: 'Downloadable Records',
    desc: 'Export submissions as PDFs for audits, compliance reporting, and downstream analysis.',
    icon: <DownloadDoneIcon />,
  },
];

const FormsCapability = () => (
  <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8f9fa' }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="overline"
          sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
        >
          Simple Group Forms
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
        >
          Operational Forms Built for Real Care Teams
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#4a5568', maxWidth: 720, fontSize: '1.05rem', lineHeight: 1.7 }}
        >
          Build complex care forms with AI assistance or full manual control, then govern every
          submission with role-based and user-scoped access. Download records for audits and reporting.
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
                  bgcolor: 'rgba(17,101,48,0.07)',
                  color: '#116530',
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
          to="/simple-group-forms"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<DescriptionIcon />}
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 4,
            py: 1.3,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Explore Forms Capability
        </Button>
      </Stack>
    </Container>
  </Box>
);

export default FormsCapability;
