import { Box, Card, CardContent, Typography, Button, Grid, Container, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const freeAccessFeatureText = 'Free access during Beta (Request via Contact)';

const pricingPlans = [
    {
        title: 'Free',
        price: '$0',
        features: [
            'Unlimited DB-mapped tooltips',
            'Real-Time updates',
            'Community support',
            'Simple Complexity branding',
        ],
        ctaText: 'Get Started Free',
        href: 'https://app.simple-complexity.com'
    },
    {
        title: 'Pro (Free Beta Trial)',
        price: '$0 / month',
        priceDetail: 'During Beta Period (Normally $5/month)',
        features: [
            'Includes all Free features',
            'Up to 5,000 AI tooltips/month',
            'AI-powered insights',
            'Multilingual support',
            'No branding',
            freeAccessFeatureText
        ],
        ctaText: 'Start Free Pro Trial',
        isFeatured: true,
        href: 'https://app.simple-complexity.com/'
    },
    {
        title: 'Unlimited',
        price: '$10/month',
        features: [
            'Includes all Pro features',
            'Unlimited AI-generated tooltips',
            'Priority email support',
            'No branding',
        ],
        ctaText: 'Go Unlimited',
        href: 'https://app.simple-complexity.com/'
    },
];

const Pricing = () => {
    return (
        <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Pricing Plans
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
                    Join our Beta program! Sign up for the Pro Trial below.{' '}
                    <Typography component="span" fontWeight="bold">
                        For free access during the Beta period
                    </Typography>
                    , please request it via our Contact page (link in the Pro Trial features).
                </Typography>

                <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                    {pricingPlans.map((plan, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                            <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', width: '100%', border: plan.isFeatured ? '2px solid' : '1px solid', borderColor: plan.isFeatured ? 'primary.main' : 'divider' }}>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" gutterBottom>
                                        {plan.title}
                                    </Typography>
                                    <Typography variant="h4" color="primary" gutterBottom>
                                        {plan.price}
                                    </Typography>
                                    {plan.priceDetail && (
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                            {plan.priceDetail}
                                        </Typography>
                                    )}
                                    <Box sx={{ textAlign: 'left', mb: 3, flexGrow: 1 }}>
                                        {plan.features.map((feature, idx) => (
                                            <Typography variant="body2" key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Box component="span" sx={{ mr: 1, color: 'primary.main' }}>
                                                    ✓
                                                </Box>
                                                {feature === freeAccessFeatureText ? (
                                                    <MuiLink
                                                        component={RouterLink}
                                                        to="/contact"
                                                        underline="hover"
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        {feature}
                                                    </MuiLink>
                                                ) : (
                                                    feature
                                                )}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <Box mt="auto" pt={2}>
                                        <Button
                                            component="a"
                                            href={plan.href}
                                            target={plan.href?.startsWith('http') ? "_blank" : undefined}
                                            rel={plan.href?.startsWith('http') ? "noopener noreferrer" : undefined}
                                            variant={plan.isFeatured ? "contained" : "outlined"}
                                            color="primary"
                                            fullWidth
                                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                        >
                                            {plan.ctaText}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Typography variant="caption" display="block" sx={{ mt: 4, color: 'text.secondary' }}>
                    Note: Select a plan above to sign up. To activate the free Beta access for the Pro plan, please click the link within its features list and send us a message via the contact form.
                </Typography>
            </Container>
        </Box>
    );
};

export default Pricing;
