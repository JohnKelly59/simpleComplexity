import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';

const pricingPlans = [
    {
        title: 'Free',
        price: '$0',
        features: [
            'Unlimited DB-mapped tooltips tooltips',
            'Real-Time updates',
            'Powered by our brand',
        ],
    },
    {
        title: 'Pro',
        price: '$5/month',
        features: [
            'Up to 5,000 tooltips/month',
            'AI-generated tooltips',
            'No branding',
        ],
    },
    {
        title: 'Unlimited',
        price: '$10/month',
        features: [
            'Unlimited AI-generated tooltips',
            'Priority support',
            'No branding',
        ],
    },
];

const Pricing = () =>
{
    return (
        <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Pricing
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {pricingPlans.map((plan, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {plan.title}
                                </Typography>
                                <Typography variant="h4" color="primary" gutterBottom>
                                    {plan.price}
                                </Typography>
                                {plan.features.map((feature, idx) => (
                                    <Typography variant="body2" key={idx}>
                                        • {feature}
                                    </Typography>
                                ))}
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href="https://app.simple-complexity.com"
                                    >
                                        Choose Plan
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Pricing;
