import React, { useState, useEffect } from 'react';
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
    Fade,
    useTheme
} from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ForumIcon from '@mui/icons-material/Forum';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const featureData = [
    {
        category: "Authentication & User Accounts",
        icon: <LockPersonIcon fontSize="large" />,
        items: [
            "Sign Up & Login: Email/Password registration.",
            "Social Login: Google and Apple integration.",
            "Password Management: Forgot and reset flows.",
            "Onboarding: Dedicated user onboarding flow.",
            "Profile: Edit details and user attributes.",
            "Roles: Admin, Staff, Family, and Resident."
        ]
    },
    {
        category: "Facility Management",
        icon: <ApartmentIcon fontSize="large" />,
        items: [
            "Operations: CRUD for care facilities.",
            "Staffing: Manage users and permissions.",
            "Invitations: Search and invite users easily.",
            "Schedule: Centralized staffing calendar.",
            "Visibility: Role-based data access."
        ]
    },
    {
        category: "Messaging & Communication",
        icon: <ForumIcon fontSize="large" />,
        items: [
            "Secure Chat: 1-on-1 and Group messaging.",
            "Care Teams: Dedicated group channels.",
            "History: Full conversation archives.",
            "Family Connections: Manage relationships.",
            "Social Feed: Community news and posts."
        ]
    },
    {
        category: "Calendar & Scheduling",
        icon: <EventAvailableIcon fontSize="large" />,
        items: [
            "Events: Manage facility-wide activities.",
            "Unified View: Staff, activity, and personal events.",
            "Google Sync: Sync with personal calendars.",
            "Visits: Family request and approval system.",
            "Shifts: Staff shift management."
        ]
    },
    {
        category: "Care & Health Management",
        icon: <MonitorHeartIcon fontSize="large" />,
        items: [
            "Medications: Track prescriptions & schedules.",
            "eMAR: Electronic Administration Records.",
            "Tasks: Daily care task tracking.",
            "Vitals: Monitor BP, heart rate, and more.",
            "Incidents: Log and track reports."
        ]
    },
    {
        category: "Files & Documents",
        icon: <FolderSharedIcon fontSize="large" />,
        items: [
            "Storage: Secure cloud file storage.",
            "Management: Associate docs with residents.",
            "Access: Centralized repository."
        ]
    },
    {
        category: "Billing & Subscriptions",
        icon: <PaymentIcon fontSize="large" />,
        items: [
            "Stripe: Secure payment processing.",
            "Flexible Plans: Facility or individual billing.",
            "Portal: Self-service billing history.",
            "Scalable: Per-resident seat management."
        ]
    },
    {
        category: "Notifications",
        icon: <NotificationsActiveIcon fontSize="large" />,
        items: [
            "Push: Real-time mobile and web alerts.",
            "Smart Alerts: For messages and incidents.",
            "Email: Summaries and urgent notifications.",
            "Preferences: Granular user control."
        ]
    },
    {
        category: "Admin & System",
        icon: <AdminPanelSettingsIcon fontSize="large" />,
        items: [
            "Audit Logs: Full compliance tracking.",
            "Dashboard: High-level system oversight.",
            "Data Control: Address and master data."
        ]
    }
];

const FeaturesPage = () => {
    const [loaded, setLoaded] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <Box sx={{ 
            py: 6, 
            px: 4,
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <Container maxWidth="xl">
                <Fade in={loaded} timeout={800}>
                    <Box>
                        {/* Page Header */}
                        <Box sx={{ textAlign: 'center', mb: 8, color: '#fff' }}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                                Powerful Features
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '700px', mx: 'auto', fontWeight: 400 }}>
                                A complete ecosystem designed to streamline operations, enhance care, and connect families.
                            </Typography>
                        </Box>

                        {/* CSS Grid Layout - Replaces MUI Grid */}
                        <Box sx={{ 
                            display: 'grid',
                            // Creates columns that are at least 340px wide, and fills available space
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: 6, // 24px gap
                            justifyContent: 'center'
                        }}> 
                            {featureData.map((feature, index) => (
                                <Card 
                                    key={index}
                                    elevation={3}
                                    sx={{ 
                                        // Fixed Height set here
                                        height: '500px', 
                                        width: '100%',
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    {/* Accent Strip at the top */}
                                    <Box sx={{ height: '6px', backgroundColor: 'secondary.main', width: '100%', flexShrink: 0 }} />

                                    <CardContent sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                                        {/* Icon & Title Header */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                            <Box sx={{ 
                                                p: 1.5, 
                                                borderRadius: '12px', 
                                                backgroundColor: 'rgba(17, 101, 48, 0.1)', 
                                                color: 'primary.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {feature.icon}
                                            </Box>
                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                                {feature.category}
                                            </Typography>
                                        </Box>

                                        {/* Feature List */}
                                        <List disablePadding>
                                            {feature.items.map((item, idx) => (
                                                <ListItem 
                                                    key={idx} 
                                                    disableGutters 
                                                    alignItems="flex-start" 
                                                    sx={{ pb: 1, pt: 0.5 }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', opacity: 0.8 }} />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={item} 
                                                        primaryTypographyProps={{ 
                                                            variant: 'body2', 
                                                            color: 'text.secondary',
                                                            sx: { lineHeight: 1.5 }
                                                        }} 
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default FeaturesPage;