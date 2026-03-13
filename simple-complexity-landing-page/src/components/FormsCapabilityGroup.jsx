import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Chip, Stack } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DrawIcon from '@mui/icons-material/Draw';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

const capabilityCards = [
    {
        title: 'Advanced AI Form Intelligence',
        description: 'AI builds more than starter drafts: complete multi-section forms, structured tables, and nested tables directly in the form builder.',
        icon: <AutoAwesomeIcon color="primary" fontSize="large" />,
    },
    {
        title: 'Manual Form Creation',
        description: 'Build forms from scratch with full control over sections, field types, validation rules, and completion settings.',
        icon: <DrawIcon color="primary" fontSize="large" />,
    },
    {
        title: 'RBAC and Direct User Access',
        description: 'Assign access through role-based permissions plus direct per-user controls for precise operational governance.',
        icon: <SecurityIcon color="primary" fontSize="large" />,
    },
    {
        title: 'Downloadable Form Data',
        description: 'Export and download submissions for reporting, audits, and downstream operational analysis.',
        icon: <DownloadDoneIcon color="primary" fontSize="large" />,
    },
];

const quickStats = [
    { label: 'AI + Manual Builder', tone: '#2A56C6' },
    { label: 'Role and User Access', tone: '#188548' },
    { label: 'Downloadable Records', tone: '#B36400' },
];

const FormsCapabilityGroup = () => {
    return (
        <Box
            sx={{
                pt: { xs: 0, md: 0 },
                pb: { xs: 8, md: 10 },
                bgcolor: '#f8fcf9',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        mb: { xs: 5, md: 6 },
                        p: { xs: 3, md: 4.5 },
                        borderRadius: 4,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: '#ffffff',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    }}
                >
                    <Chip
                        label="Simple Group Forms"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            color: '#0F3A8A',
                            backgroundColor: 'rgba(42, 86, 198, 0.12)',
                            border: '1px solid rgba(42, 86, 198, 0.18)',
                        }}
                    />
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 800,
                            color: '#1a1a1a',
                            mb: 2,
                            maxWidth: '760px',
                            lineHeight: 1.2,
                        }}
                    >
                        Operational forms built for real care teams
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: '840px',
                            color: 'text.secondary',
                            fontWeight: 400,
                            lineHeight: 1.65,
                        }}
                    >
                        Build complex care forms with AI assistance or fully manual control, then govern every submission with role-based and user-scoped access.
                    </Typography>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 1.5 }}>
                        {quickStats.map((item) => (
                            <Chip
                                key={item.label}
                                label={item.label}
                                sx={{
                                    fontWeight: 700,
                                    color: item.tone,
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid rgba(0,0,0,0.12)',
                                    '& .MuiChip-label': { px: 1.8 },
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                <Box
                    sx={{
                        mb: 5,
                        display: 'grid',
                        gap: 2.5,
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        alignItems: 'stretch',
                    }}
                >
                    {capabilityCards.map((card) => (
                        <Card
                            key={card.title}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                backgroundColor: 'rgba(255,255,255,0.96)',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            <CardContent sx={{ textAlign: 'left', p: 3 }}>
                                <Box
                                    sx={{
                                        mb: 2,
                                        display: 'inline-flex',
                                        p: 1.2,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(17, 101, 48, 0.1)',
                                        color: 'primary.main',
                                    }}
                                >
                                    {card.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2, color: '#1f2937' }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.75, color: 'text.secondary' }}>
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
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
                            fontWeight: 700,
                            borderRadius: 2.5,
                            boxShadow: '0 8px 18px rgba(17,101,48,0.2)',
                            '&:hover': {
                                boxShadow: '0 12px 22px rgba(17,101,48,0.28)',
                            },
                        }}
                    >
                        Explore Forms Capability
                    </Button>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User-scoped forms with permission controls, direct access controls, and downloadable records.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default FormsCapabilityGroup;
