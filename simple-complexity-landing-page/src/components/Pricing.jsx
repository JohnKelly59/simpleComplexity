import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  Chip,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const pricingPlans = [
  {
    title: 'Free',
    price: '$0',
    priceDetail: 'Always free',
    features: [
      'Unlimited DB‑mapped tooltips',
      'Real‑Time updates',
      'Community support',
      'Simple Complexity branding',
      'Instant Clarity',
      'Seamless Integration',
    ],
    ctaText: 'Get Started Free',
    href: 'https://app.simple-complexity.com',
  },
  {
    title: 'Pro',
    price: '$5 / month after trial',
    priceDetail: '1‑Month Free Trial',
    features: [
      'Includes all Free features',
      'Up to 5,000 AI tooltips / month',
      'AI‑Powered Insights',
      'Multilingual Support',
      'Audio Support',
      'Interactive Question Assistant',
      'Support Assistant',
    ],
    ctaText: 'Start Pro for Free',
    isFeatured: true,
    href: 'https://app.simple-complexity.com/',
  },
  {
    title: 'Unlimited',
    price: '$10 / month after trial',
    priceDetail: '1‑Month Free Trial',
    features: [
      'Includes all Pro features',
      'Unlimited AI‑generated tooltips',
      'AI Demo creation',
      'Priority email support',
      'Video Recording',
    ],
    ctaText: 'Go Unlimited Free',
    href: 'https://app.simple-complexity.com/',
  },
];

const Pricing = () => (
  <Box sx={{ py: 10, backgroundColor: '#f9f9f9' }}>
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Simple, Transparent Pricing
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 8 }}>
        Every paid plan starts with a&nbsp;
        <Typography component="span" fontWeight="bold" color="primary.main">
          1‑month free&nbsp;trial
        </Typography>
        . Cancel any time—no questions asked.
      </Typography>

      <Grid container spacing={6} justifyContent="center" alignItems="stretch">
        {pricingPlans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
            <Card
              elevation={plan.isFeatured ? 8 : 2}
              sx={{
                p: 3,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: plan.isFeatured
                  ? 'rgba(25,118,210,0.05)' // subtle primary tint
                  : '#fff',
              }}
            >
              {/* Big, eye‑catching trial badge */}
              <Chip
                label={plan.priceDetail}
                color="primary"
                sx={{ alignSelf: 'center', fontWeight: 700, mb: 2 }}
              />

              <Typography variant="h5" gutterBottom>
                {plan.title}
              </Typography>

              {/* Price is smaller, muted, and explicitly “after trial” */}
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ fontWeight: 400, opacity: 0.65, mb: 2 }}
              >
                {plan.price}
              </Typography>

              {/* Feature list */}
              <Box sx={{ textAlign: 'left', flexGrow: 1, mt: 2 }}>
                {plan.features.map((feature, idx) => (
                  <Typography
                    variant="body2"
                    key={idx}
                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  >
                    <Box
                      component="span"
                      sx={{ mr: 1, color: 'primary.main', fontWeight: 700 }}
                    >
                      ✓
                    </Box>
                    {feature}
                  </Typography>
                ))}
              </Box>

              {/* CTA button */}
              <Button
                component="a"
                href={plan.href}
                target={plan.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                variant={plan.isFeatured ? 'contained' : 'outlined'}
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3, textTransform: 'none', fontWeight: 700 }}
              >
                {plan.ctaText}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="caption" display="block" sx={{ mt: 6, color: 'text.secondary' }}>
        Downgrade or cancel at any time directly from your dashboard.
      </Typography>
    </Container>
  </Box>
);

export default Pricing;
