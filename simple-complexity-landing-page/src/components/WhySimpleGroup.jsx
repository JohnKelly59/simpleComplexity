import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';

const reasons = [
  {
    icon: <TrendingUpIcon />,
    title: 'Increase Occupancy Retention',
    description:
      'Transparent, real-time updates build family trust and loyalty — keeping your residents happy and your beds full.',
  },
  {
    icon: <SecurityIcon />,
    title: 'Reduce Liability & Risk',
    description:
      'Digital documentation of every visit, medication, incident, and care task creates an audit-ready trail that protects your facility.',
  },
  {
    icon: <AccessTimeIcon />,
    title: 'Save Staff Hours Every Week',
    description:
      'Automated notifications, a centralized family portal, and AI-assisted documentation cut administrative burden so staff focus on care.',
  },
  {
    icon: <GroupIcon />,
    title: 'Unify Care Coordination',
    description:
      'Bring external caregivers, family members, and internal staff onto a single platform — eliminating miscommunication and care gaps.',
  },
];

const WhySimpleGroup = () => (
  <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8f9fa' }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
        <Typography
          variant="overline"
          sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
        >
          Why SimpleGroup
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
        >
          Built for the Way Senior Care Facilities Operate
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#4a5568', maxWidth: 700, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}
        >
          Designed specifically for Assisted Living, Memory Care, Skilled Nursing,
          and Independent Living communities to solve your most pressing operational challenges.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {reasons.map((reason, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                p: 3,
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                transition: 'box-shadow 0.2s ease',
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(17,101,48,0.08)',
                  color: '#116530',
                  mr: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {reason.icon}
              </Box>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
                  {reason.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.7 }}>
                  {reason.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default WhySimpleGroup;
