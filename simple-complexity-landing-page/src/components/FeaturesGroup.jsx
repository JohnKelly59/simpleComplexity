// src/components/FeaturesGroup.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Container, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

// 1. Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Import relevant care management icons
import FamilyIcon from '@mui/icons-material/FamilyRestroom';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import MedicationIcon from '@mui/icons-material/Medication';
import HealthIcon from '@mui/icons-material/HealthAndSafety';
import MessageIcon from '@mui/icons-material/Message';
import TaskIcon from '@mui/icons-material/Task';
import VisitIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';

const featureCategories = [
    {
        category: 'Clinical & Care',
        features: [
            { icon: <MedicationIcon fontSize="large" color="primary" />, title: 'Medication Management', description: 'Track medications, dosages, and administration schedules with automated reminders and comprehensive logs.' },
            { icon: <HealthIcon fontSize="large" color="primary" />, title: 'Vitals Tracking', description: 'Monitor and record vital signs, health metrics, and wellness data with visual trends and historical tracking.' },
            { icon: <ReportProblemIcon fontSize="large" color="primary" />, title: 'Incident Reporting', description: 'Log and track incidents with detailed reports, ensuring compliance and timely follow-up actions.' },
            { icon: <AnalyticsIcon fontSize="large" color="primary" />, title: 'Care Analytics', description: 'Gain insights into care patterns, medication adherence, and health trends with comprehensive analytics.' },
        ]
    },
    {
        category: 'Coordination & Operations',
        features: [
            { icon: <TaskIcon fontSize="large" color="primary" />, title: 'Task Management', description: 'Assign and track care tasks, responsibilities, and to-dos with clear assignments and completion tracking.' },
            { icon: <DescriptionIcon fontSize="large" color="primary" />, title: 'Document Management', description: 'Centralize important documents, care plans, and legal forms in a secure, accessible digital repository.' },
            { icon: <EventIcon fontSize="large" color="primary" />, title: 'Events & Activities', description: 'Plan and schedule facility events, activities, and outings to keep residents engaged and active.' },
            { icon: <SecurityIcon fontSize="large" color="primary" />, title: 'Role-Based Access', description: 'Ensure appropriate information sharing with granular access controls for staff, family, and administrators.' },
        ]
    },
    {
        category: 'Family & Communication',
        features: [
            { icon: <FamilyIcon fontSize="large" color="primary" />, title: 'Family Connections', description: 'Centralize family member information and care preferences for easy access and coordination.' },
            { icon: <MessageIcon fontSize="large" color="primary" />, title: 'Secure Messaging', description: 'Facilitate seamless, secure communication between family members, caregivers, and care facilities.' },
            { icon: <CalendarIcon fontSize="large" color="primary" />, title: 'Shared Calendar', description: 'Keep everyone in sync with a shared calendar for appointments, visits, and important dates.' },
            { icon: <VisitIcon fontSize="large" color="primary" />, title: 'Visit Documentation', description: 'Document care visits and observations with photos and notes for comprehensive care records.' },
        ]
    }
];

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid rgba(0,0,0,0.05)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
        borderColor: theme.palette.primary.main,
    }
}));

const FeatureCard = ({ feature }) => (
    <Box sx={{ px: 2, height: '100%', pb: 2 }}>
        <StyledCard>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    opacity: 0.1 // Background opacity
                }}>
                    {/* Icon is rendered separately to avoid opacity inheritance if using bgcolor with opacity */}
                </Box>
                <Box sx={{ mt: -10, mb: 2 }}>
                    {feature.icon}
                </Box>

                <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                    {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                </Typography>
            </CardContent>
        </StyledCard>
    </Box>
);

const FeaturesGroup = () =>
{
    return (
        <Box sx={{ py: 10, bgcolor: '#f8fcf9' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={8}>
                    <Chip label="Features" color="primary" sx={{ mb: 2, fontWeight: 600 }} />
                    <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                        Everything You Need to Manage Care
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', fontWeight: 400 }}>
                        SimpleGroup provides a complete suite of tools to streamline care coordination, enhance family communication, and improve health outcomes.
                    </Typography>
                </Box>

                {featureCategories.map((category, index) => (
                    <Box key={index} sx={{ mb: 8 }}>
                        <Typography variant="h5" component="h3" sx={{ mb: 4, fontWeight: 700, borderLeft: '4px solid #1B5E20', pl: 2, color: '#1B5E20' }}>
                            {category.category}
                        </Typography>
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 6000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                600: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                            }}
                            style={{ paddingBottom: '50px', '--swiper-pagination-color': '#1B5E20' }}
                        >
                            {category.features.map((feature, featureIndex) => (
                                <SwiperSlide key={featureIndex} style={{ height: 'auto' }}>
                                    <FeatureCard feature={feature} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>
                ))}
            </Container>
        </Box>
    );
};

export default FeaturesGroup;

