import {
  Box,
  Card,
  Typography,
  Button,
  Container,
  Grid,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Link as RouterLink } from 'react-router-dom';

const facilityPlans = [
  {
    title: 'Engagement',
    subtitle: 'Independent Living & 55+ Communities',
    price: '$12',
    priceUnit: '/ resident / month',
    features: [
      'Family Feed & Activity Posts',
      'Activities Calendar & Events',
      'Secure Messaging',
      'Visit Scheduling & Approval',
      'Family Communication Portal',
      'Resident Engagement Tools',
      'Push Notifications',
      'Mobile App Access (iOS & Web)',
      'HIPAA-Compliant Infrastructure',
    ],
    ctaText: 'Get Started',
    href: 'https://simplegroup.simple-complexity.com/',
  },
  {
    title: 'Care & Operations',
    subtitle: 'Assisted Living, Skilled Nursing & Memory Care',
    price: '$30',
    priceUnit: '/ resident / month',
    features: [
      'eMAR (Electronic Medication Records)',
      'Vitals & Incident Tracking',
      'Care Task Management',
      'Staff Shift Scheduling',
      'Admission Workflows & AI Intake',
      'Forms Builder (AI + Manual)',
      'Document Management',
      'Visit Documentation',
      'Health Analytics & Reporting',
      'Audit Logging & Compliance',
      'Custom Roles & Permissions',
      'All Engagement Features Included',
    ],
    ctaText: 'Get Started',
    isFeatured: true,
    href: 'https://simplegroup.simple-complexity.com/',
  },
  {
    title: 'Enterprise',
    subtitle: 'Multi-facility organizations & custom needs',
    price: 'Custom',
    features: [
      'Volume-based pricing',
      'Dedicated account manager',
      'Custom onboarding & training',
      'Priority support & SLA',
      'Custom integrations',
      'Advanced reporting & analytics',
      'All Care & Operations features',
    ],
    ctaText: 'Contact Sales',
    href: '/contact',
  },
];

const Pricing = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
          >
            Pricing
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Plans That Scale With Your Facility
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#4a5568', maxWidth: 700, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7, mb: 4 }}
          >
            Simple, transparent pricing per resident per month. Subscriptions are managed at the facility level through Stripe.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {facilityPlans.map((plan, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  border: plan.isFeatured ? '2px solid #116530' : '1px solid #e2e8f0',
                  position: 'relative',
                }}
              >
                {plan.isFeatured && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: '#116530',
                      borderRadius: '12px 12px 0 0',
                    }}
                  />
                )}

                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                  {plan.title}
                </Typography>
                {plan.subtitle && (
                  <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', mt: 0.5 }}>
                    {plan.subtitle}
                  </Typography>
                )}

                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography component="span" variant="h3" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
                    {plan.price}
                  </Typography>
                  {plan.priceUnit && (
                    <Typography component="span" variant="body1" sx={{ color: '#64748b', ml: 0.5 }}>
                      {plan.priceUnit}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flexGrow: 1, mb: 3 }}>
                  {plan.features.map((f, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.25 }}>
                      <CheckIcon sx={{ fontSize: 18, color: '#116530', mr: 1, mt: 0.25, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.5 }}>
                        {f}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  {...(plan.href.startsWith('http')
                    ? { component: 'a', href: plan.href, target: '_blank', rel: 'noopener noreferrer' }
                    : { component: RouterLink, to: plan.href }
                  )}
                  variant={plan.isFeatured ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.25 }}
                >
                  {plan.ctaText}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            All subscriptions are billed monthly per facility. Manage billing, upgrades, and cancellations from your facility dashboard.
          </Typography>
          <Typography variant="body2" sx={{ color: '#4a5568', mt: 2, maxWidth: 700, mx: 'auto' }}>
            <strong>Assisted Living, Skilled Nursing & Memory Care:</strong> Care & Operations includes eMAR, vitals, admissions, and clinical oversight.
            <br />
            <strong>Independent Living & 55+:</strong> Engagement covers activities, family communication, and community features.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;
