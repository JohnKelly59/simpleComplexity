import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const individualPlans = [
  {
    title: 'Free',
    price: '$0',
    priceDetail: null,
    features: [
      '200 AI tooltips / month',
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
    price: '$5 / month after trial',
    priceDetail: '1‑Month Free Trial',
    features: [
      'Up to 5,000 AI tooltips / month',
      'AI‑Powered Insights',
      'Multilingual Support',
      'Audio Support',
      'Video Recording',
      'Interactive Question Assistant',
      'Support Assistant',
      'Real‑Time updates',
      'Community support',
      'Simple Complexity branding',
      'Instant Clarity',
      'Seamless Integration',
    ],
    ctaText: 'Start Pro for Free',
    isFeatured: true,
    href: 'https://app.simple-complexity.com/',
  },
  {
    title: 'Unlimited',
    price: '$10 / month after trial',
    priceDetail: '1‑Month Free Trial',
    features: [
      'Unlimited AI‑generated tooltips',
      'AI Demo creation',
      'Priority email support',
      'AI‑Powered Insights',
      'Multilingual Support',
      'Audio Support',
      'Video Recording',
      'Interactive Question Assistant',
      'Support Assistant',
      'Real‑Time updates',
      'Simple Complexity branding',
      'Instant Clarity',
      'Seamless Integration',
    ],
    ctaText: 'Go Unlimited Free',
    href: 'https://app.simple-complexity.com/',
  },
];

const businessPlans = [
    {
        title: 'Free',
        price: '$0',
        features: [
          '200 AI tooltips / month',
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
        price: '$75 / month after trial',
        priceDetail: '1-Month Free Trial',
        features: [
          'Up to 10,000 AI tooltips / month',
          'Remove Our Branding',
          'Priority Support',
          'Video Recording & Analytics',
          'AI‑Powered Insights & Support',
          'Multilingual & Audio Support',
          'Real‑Time updates',
          'Instant Clarity',
          'Seamless Integration',
        ],
        ctaText: 'Start Pro Trial',
        isFeatured: true,
        href: 'https://app.simple-complexity.com/',
      },
      {
        title: 'Business',
        price: 'Contact Us',
        priceDetail: '1-Month Free Trial',
        features: [
          'Unlimited AI‑generated tooltips',
          'Full Page Translation',
          'Dedicated Account Manager',
          'AI Demo creation',
          'Custom Integrations',
          'Remove Our Branding',
          'Video Recording & Analytics',
          'AI‑Powered Insights & Support',
          'Multilingual & Audio Support',
          'Real‑Time updates',
          'Instant Clarity',
          'Seamless Integration',
        ],
        ctaText: 'Contact Sales',
        href: '/contact',
      },
];


const Pricing = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const plansToDisplay = value === 0 ? individualPlans : businessPlans;

    return (
        <Box sx={{ py: 10, backgroundColor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Simple, Transparent Pricing
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Every paid plan starts with a&nbsp;
                    <Typography component="span" fontWeight="bold" color="primary.main">
                        1‑month free&nbsp;trial
                    </Typography>
                    . Cancel any time—no questions asked.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="standard"
                    >
                        <Tab label="For Individuals" sx={{ fontWeight: 'bold' }} />
                        <Tab label="For Business" sx={{ fontWeight: 'bold' }} />
                    </Tabs>
                </Box>

                <Grid container spacing={6} justifyContent="center" alignItems="stretch">
                    {plansToDisplay.map((plan, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                            <Card
                                elevation={plan.isFeatured ? 8 : 2}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    backgroundColor: '#fff',
                                }}
                            >
                                {plan.priceDetail && (
                                    <Chip
                                        label={plan.priceDetail}
                                        color="primary"
                                        sx={{ alignSelf: 'center', fontWeight: 700, mb: 2 }}
                                    />
                                )}

                                <Typography variant="h5" gutterBottom>
                                    {plan.title}
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    sx={{ fontWeight: 400, opacity: 0.65, mb: 2 }}
                                >
                                    {plan.price}
                                </Typography>

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

                                <Button
                                    component={plan.href.startsWith('http') ? 'a' : RouterLink}
                                    to={!plan.href.startsWith('http') ? plan.href : undefined}
                                    href={plan.href.startsWith('http') ? plan.href : undefined}
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
};

export default Pricing;