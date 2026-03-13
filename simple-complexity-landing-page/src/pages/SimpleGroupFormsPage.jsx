import React from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Fade,
    Stack,
    Button,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DrawIcon from '@mui/icons-material/Draw';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const pillars = [
    {
        title: 'AI Utilization',
        icon: <AutoAwesomeIcon color="primary" fontSize="large" />,
        points: [
            'Generate complete form systems, not just starter drafts.',
            'Build complex forms with conditional sections and dense field sets.',
            'Support operational tables and tables nested within form sections.',
            'Keep human review in control before publishing.',
        ],
    },
    {
        title: 'Manual Form Creation',
        icon: <DrawIcon color="primary" fontSize="large" />,
        points: [
            'Create forms from scratch with custom fields and sections.',
            'Design precise workflows for clinical and facility operations.',
            'Adjust validation, required fields, and structure anytime.',
        ],
    },
    {
        title: 'Access and Governance',
        icon: <SecurityIcon color="primary" fontSize="large" />,
        points: [
            'Forms are related to users for clear accountability.',
            'Apply role-based access controls across teams and facilities.',
            'Set direct per-user access when role defaults are not enough.',
        ],
    },
    {
        title: 'Download and Reporting',
        icon: <DownloadForOfflineIcon color="primary" fontSize="large" />,
        points: [
            'Download form submissions for audits and records.',
            'Support compliance and operational reporting workflows.',
            'Share structured outputs with downstream systems.',
        ],
    },
];

const highlights = [
    { label: 'Complex AI-generated forms', tone: '#2A56C6' },
    { label: 'Manual builder with full control', tone: '#188548' },
    { label: 'Role + user-scoped access', tone: '#B36400' },
    { label: 'Audit-ready downloads', tone: '#0E4B8B' },
];

const previewShots = ['/screenshots/screenshot7.png', '/screenshots/screenshot4.png', '/screenshots/screenshot2.png'];

const SimpleGroupFormsPage = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setLoaded(true), 150);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Box sx={{ py: { xs: 4, md: 7 }, px: { xs: 2, md: 3 }, minHeight: '100vh', display: 'flex', alignItems: 'flex-start' }}>
            <Container maxWidth="lg">
                <Fade in={loaded} timeout={800}>
                    <Box>
                        <Card
                            sx={{
                                mb: { xs: 4, md: 6 },
                                borderRadius: 5,
                                border: '1px solid rgba(255,255,255,0.14)',
                                boxShadow: '0 24px 36px rgba(5, 15, 38, 0.3)',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, rgba(7,26,67,0.88) 0%, rgba(10,79,45,0.88) 100%)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                <Chip
                                    label="Simple Group Forms"
                                    sx={{
                                        mb: 2,
                                        fontWeight: 700,
                                        color: '#D4A017',
                                        backgroundColor: 'rgba(212,160,23,0.15)',
                                        border: '1px solid rgba(212,160,23,0.3)',
                                    }}
                                />
                                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1.5, color: '#FFFFFF', lineHeight: 1.15 }}>
                                    Build forms the way care operations actually run
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'rgba(236,244,255,0.9)', maxWidth: '900px', lineHeight: 1.65, fontWeight: 400 }}>
                                    Generate advanced forms with AI, fine-tune every field manually, and keep approvals, permissions, and reporting in one governed system.
                                </Typography>
                                <Stack direction="row" spacing={1.2} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 1.2 }}>
                                    {highlights.map((item) => (
                                        <Chip
                                            key={item.label}
                                            label={item.label}
                                            sx={{
                                                fontWeight: 700,
                                                color: item.tone,
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid rgba(20, 43, 92, 0.2)',
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* <Box
                            sx={{
                                mb: { xs: 4, md: 5 },
                                display: 'grid',
                                gap: 2,
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                            }}
                        >
                            {previewShots.map((src) => (
                                <Card
                                    key={src}
                                    sx={{
                                        borderRadius: 4,
                                        border: '1px solid rgba(255,255,255,0.14)',
                                        backgroundColor: 'rgba(255,255,255,0.92)',
                                        overflow: 'hidden',
                                        boxShadow: '0 14px 28px rgba(8, 17, 42, 0.2)',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={src}
                                        alt="Simple Group Forms preview"
                                        sx={{ width: '100%', height: { xs: 220, md: 270 }, objectFit: 'cover', objectPosition: 'top' }}
                                    />
                                </Card>
                            ))}
                        </Box> */}

                        <Box
                            sx={{
                                display: 'grid',
                                gap: 3,
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                alignItems: 'stretch',
                            }}
                        >
                            {pillars.map((pillar) => (
                                <Card
                                    key={pillar.title}
                                    sx={{
                                        borderRadius: 4,
                                        border: '1px solid rgba(255,255,255,0.14)',
                                        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,248,255,0.96) 100%)',
                                        boxShadow: '0 16px 32px rgba(7, 16, 40, 0.18)',
                                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 20px 36px rgba(7, 16, 40, 0.24)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3.2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4, mb: 1.8 }}>
                                            <Box
                                                sx={{
                                                    p: 1.1,
                                                    borderRadius: 2,
                                                    bgcolor: 'rgba(17, 101, 48, 0.1)',
                                                    color: 'primary.main',
                                                    display: 'inline-flex',
                                                }}
                                            >
                                                {pillar.icon}
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#13213B' }}>
                                                {pillar.title}
                                            </Typography>
                                        </Box>
                                        <List disablePadding>
                                            {pillar.points.map((point) => (
                                                <ListItem key={point} disableGutters alignItems="flex-start" sx={{ py: 0.45 }}>
                                                    <ListItemIcon sx={{ minWidth: 28, mt: 0.55 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 17, color: '#188548' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={point} primaryTypographyProps={{ sx: { color: '#4D5C73', lineHeight: 1.65 } }} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        <Card
                            sx={{
                                mt: 4,
                                borderRadius: 4,
                                border: '1px solid rgba(212,160,23,0.32)',
                                background: 'linear-gradient(135deg, rgba(255,252,245,0.95) 0%, rgba(255,250,236,0.95) 100%)',
                                boxShadow: '0 14px 30px rgba(7, 16, 40, 0.16)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                                    <PersonIcon sx={{ color: '#8E5A00' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#402B00' }}>
                                        Built for user-scoped form operations
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ lineHeight: 1.75, color: '#5E4A1F', mb: 2 }}>
                                    Even when full app views are unavailable in a specific environment, this capability maintains user-linked forms,
                                    permission-based RBAC, direct user-level controls, and downloadable submission outputs.
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/contact"
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DescriptionIcon />}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ fontWeight: 700, px: 2.8, borderRadius: 2.5 }}
                                >
                                    Request a forms walkthrough
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default SimpleGroupFormsPage;
