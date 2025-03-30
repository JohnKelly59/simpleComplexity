import { Box, Grid, Paper, Typography } from '@mui/material';

const features = [
    {
        title: 'Instant Clarity',
        description:
            'Automatically simplify confusing form questions using our database of tooltips.',
        details:
            'Ensures users quickly understand and complete forms without frustration. Perfect for standard form fields and common questions.',
    },
    {
        title: 'AI-Powered Insights',
        description:
            'Real-time AI generation for tooltips when a question isn’t in our database.',
        details:
            'Our cutting-edge AI analyzes context to generate accurate, plain language tooltips instantly—saving time and reducing confusion.',
    },
    {
        title: 'Multilingual Support',
        description:
            'Overcome language barriers with built-in translations for non-English speakers.',
        details:
            'Supports over 30 languages to ensure that everyone can fill out forms correctly, regardless of their native language.',
    },
    {
        title: 'Seamless Integration',
        description:
            'Use our browser extension or embed our SDK to deliver a smooth user experience.',
        details:
            'Quick setup with one line of code and compatibility with most modern web platforms ensures effortless deployment and consistent performance.',
    },
];

const Features = () =>
{
    return (
        <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Features
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
                        <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {feature.description}
                            </Typography>
                            {feature.details && (
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    {feature.details}
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Features;
