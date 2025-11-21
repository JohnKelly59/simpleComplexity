import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const reasons = [
    {
        icon: <TrendingUpIcon fontSize="large" color="primary" />,
        title: 'Increase Occupancy Retention',
        description: 'Happy families mean happy residents. By providing transparent, real-time updates, you build trust and loyalty that keeps your beds full.'
    },
    {
        icon: <SecurityIcon fontSize="large" color="primary" />,
        title: 'Reduce Liability Risk',
        description: 'Comprehensive digital documentation of every visit, medication, and care activity creates an audit-proof trail that protects your facility.'
    },
    {
        icon: <AccessTimeIcon fontSize="large" color="primary" />,
        title: 'Save Staff Time',
        description: 'Stop playing phone tag with families. Automated notifications and a centralized family portal reduce inbound calls by up to 40%.'
    },
    {
        icon: <GroupIcon fontSize="large" color="primary" />,
        title: 'Unify Care Coordination',
        description: 'Bring external caregivers, family members, and your internal staff onto a single page, eliminating miscommunication and care gaps.'
    }
];

const WhySimpleGroup = () =>
{
    const theme = useTheme();

    return (
        <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Why Top Facilities Choose SimpleGroup
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        Designed specifically for Assisted Living and Memory Care communities to solve your most pressing operational challenges.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {reasons.map((reason, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    p: 2,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                    }
                                }}
                            >
                                <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'primary.light', color: 'primary.main', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {React.cloneElement(reason.icon, { sx: { color: '#fff' } })}
                                </Box>
                                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {reason.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
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
};

export default WhySimpleGroup;
