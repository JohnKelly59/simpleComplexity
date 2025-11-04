// src/components/FeaturesGroup.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Container } from '@mui/material';
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

const featureCategories = [
    {
        category: 'Core Care Management',
        features: [
            { icon: <FamilyIcon fontSize="large" color="primary" />, title: 'Family Management', description: 'Centralize family member information, medical history, and care preferences in one secure platform for easy access and coordination.' },
            { icon: <CalendarIcon fontSize="large" color="primary" />, title: 'Care Scheduling', description: 'Schedule and manage care visits, appointments, and events with real-time updates and notifications for all family members.' },
            { icon: <MedicationIcon fontSize="large" color="primary" />, title: 'Medication Tracking', description: 'Track medications, dosages, and administration schedules with automated reminders and comprehensive medication logs.' },
        ]
    },
    {
        category: 'Communication & Coordination',
        features: [
            { icon: <MessageIcon fontSize="large" color="primary" />, title: 'Family Messaging', description: 'Facilitate seamless communication between family members, caregivers, and care facilities through secure messaging channels.' },
            { icon: <TaskIcon fontSize="large" color="primary" />, title: 'Task Management', description: 'Assign and track care tasks, responsibilities, and to-dos with clear assignments and completion tracking.' },
            { icon: <VisitIcon fontSize="large" color="primary" />, title: 'Visit Documentation', description: 'Document care visits, observations, and important updates with photos, notes, and timestamps for comprehensive care records.' },
        ]
    },
    {
        category: 'Health & Analytics',
        features: [
            { icon: <HealthIcon fontSize="large" color="primary" />, title: 'Vital Signs Tracking', description: 'Monitor and record vital signs, health metrics, and wellness data with visual trends and historical tracking.' },
            { icon: <AnalyticsIcon fontSize="large" color="primary" />, title: 'Care Analytics', description: 'Gain insights into care patterns, medication adherence, and health trends with comprehensive analytics and reporting.' },
            { icon: <NotificationIcon fontSize="large" color="primary" />, title: 'Smart Notifications', description: 'Receive timely alerts and notifications for medications, appointments, tasks, and important care updates.' },
            { icon: <SecurityIcon fontSize="large" color="primary" />, title: 'Secure & Compliant', description: 'Enterprise-grade security with HIPAA-compliant data handling, role-based access control, and comprehensive audit logs.' },
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
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    }
}));

const FeatureCard = ({ feature }) => (
    <Box sx={{ px: 2, height: '100%' }}>
        <StyledCard>
            <CardContent>
                {feature.icon}
                <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {feature.description}
                </Typography>
            </CardContent>
        </StyledCard>
    </Box>
);

const FeaturesGroup = () =>
{
    return (
        <Box sx={{ py: 10, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                    A Comprehensive Platform for Care Management
                </Typography>
                <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 8, maxWidth: '700px', mx: 'auto' }}>
                    SimpleGroup provides a complete suite of tools to streamline care coordination, enhance family communication, and improve health outcomes.
                </Typography>

                {featureCategories.map((category, index) => (
                    <Box key={index} sx={{ mb: 8 }}>
                        <Typography variant="h4" component="h3" textAlign="center" sx={{ mb: 5, fontWeight: 'medium' }}>
                            {category.category}
                        </Typography>
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                600: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                            style={{ paddingBottom: '40px', '--swiper-pagination-color': '#116530' }}
                        >
                            {category.features.map((feature, featureIndex) => (
                                <SwiperSlide key={featureIndex}>
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

