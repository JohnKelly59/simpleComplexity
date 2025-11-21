import React, { useState } from 'react';
import
{
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
            'Up to 3 family members',
            'Basic care scheduling',
            'Medication tracking',
            'Family messaging',
            'Mobile app access',
            'Basic support',
        ],
        ctaText: 'Get Started Free',
        href: 'https://simplegroup.simple-complexity.com',
    },
    {
        title: 'Family',
        price: '$15 / month after trial',
        priceDetail: '1‑Month Free Trial',
        features: [
            'Up to 10 family members',
            'Advanced care scheduling',
            'Medication tracking & reminders',
            'Vital signs tracking',
            'Visit documentation',
            'Task management',
            'Family messaging',
            'Health analytics',
            'Mobile app access',
            'Priority support',
        ],
        ctaText: 'Start Family Plan',
        isFeatured: true,
        href: 'https://simplegroup.simple-complexity.com/',
    },
    {
        title: 'Extended Family',
        price: '$30 / month after trial',
        priceDetail: '1‑Month Free Trial',
        features: [
            'Unlimited family members',
            'Advanced care scheduling',
            'Medication tracking & reminders',
            'Vital signs tracking',
            'Visit documentation',
            'Task management',
            'Family messaging',
            'Health analytics',
            'Care coordination tools',
            'Mobile app access',
            'Priority support',
            'Dedicated account manager',
        ],
        ctaText: 'Go Extended Free',
        href: 'https://simplegroup.simple-complexity.com/',
    },
];

const facilityPlans = [
    {
        title: 'Engagement',
        subtitle: 'For Independent Living & 55+ Communities',
        price: '$12 / resident / month',
        priceDetail: '1-Month Free Trial',
        features: [
            'Family Feed',
            'Activities Calendar',
            'Secure Messaging',
            'Visit Scheduling',
            'Family communication portal',
            'Resident engagement tools',
            'Mobile app access',
            'Priority support',
            'HIPAA compliance',
        ],
        ctaText: 'Start Engagement Plan',
        isFeatured: false,
        href: 'https://simplegroup.simple-complexity.com/',
    },
    {
        title: 'Care & Operations',
        subtitle: 'For Assisted Living, Skilled Nursing & Memory Care',
        price: '$30 / resident / month',
        priceDetail: '1-Month Free Trial',
        features: [
            'eMAR (Electronic Medication Administration Record)',
            'Vitals & Incidents Tracking',
            'Task Management',
            'Staff Scheduling',
            'Visit Documentation',
            'Family communication portal',
            'Health analytics & reporting',
            'Priority support',
            'HIPAA compliance',
            'All Engagement plan features',
        ],
        ctaText: 'Start Care & Operations Plan',
        isFeatured: true,
        href: 'https://simplegroup.simple-complexity.com/',
    },
];


const PricingGroup = () =>
{
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) =>
    {
        setValue(newValue);
    };

    const plansToDisplay = value === 0 ? facilityPlans : individualPlans;

    return (
        <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Choose the Right Plan for Your Needs
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
                    {value === 0 ? (
                        <>
                            Pricing is per resident per month (PRPM). You must add at least one resident before subscribing. Every paid plan starts with a&nbsp;
                            <Typography component="span" fontWeight="bold" color="primary.main">
                                1‑month free&nbsp;trial
                            </Typography>
                            .
                        </>
                    ) : (
                        <>
                            Select a plan that fits your family. Every paid plan starts with a&nbsp;
                            <Typography component="span" fontWeight="bold" color="primary.main">
                                1‑month free&nbsp;trial
                            </Typography>
                            .
                        </>
                    )}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="standard"
                    >
                        <Tab label="For Facilities" sx={{ fontWeight: 'bold' }} />
                        <Tab label="For Families" sx={{ fontWeight: 'bold' }} />
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

                                {plan.subtitle && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontWeight: 500, mb: 1, fontStyle: 'italic' }}
                                    >
                                        {plan.subtitle}
                                    </Typography>
                                )}

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

                <Box sx={{ mt: 6 }}>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                        Downgrade or cancel at any time directly from your dashboard.
                    </Typography>
                    {value === 0 && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'bold' }}>
                            Not satisfied? All our paid facility plans come with a 30-day money-back guarantee.
                        </Typography>
                    )}
                    {value === 0 && (
                        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', maxWidth: '700px', mx: 'auto' }}>
                            <strong>Which plan is right for you?</strong><br />
                            <strong>Assisted Living, Skilled Nursing & Memory Care:</strong> Choose "Care & Operations" - You need eMAR, vitals tracking, and task management for clinical oversight.<br />
                            <strong>Independent Living & 55+ Communities:</strong> Choose "Engagement" - Focus on community activities, family engagement, and lifestyle features.
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default PricingGroup;

