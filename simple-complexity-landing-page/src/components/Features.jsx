import React from 'react';
import { Box, Grid, Typography, Slide, Grow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useInView } from 'react-intersection-observer';

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';

const features = [
    {
        icon: <LightbulbOutlinedIcon sx={{ fontSize: 60 }} color="primary" />,
        title: 'Instant Clarity',
        description: 'Automatically simplify confusing form questions using our database of tooltips.',
        details: 'Ensures users quickly understand and complete forms without frustration. Perfect for standard form fields and common questions.',
    },
    {
        icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 60 }} color="primary" />,
        title: 'AI-Powered Insights',
        description: 'Real-time AI generation for tooltips when a question isn’t in our database.',
        details: 'Our cutting-edge AI analyzes context to generate accurate, plain language tooltips instantly—saving time and reducing confusion.',
    },
    {
        icon: <TranslateOutlinedIcon sx={{ fontSize: 60 }} color="primary" />,
        title: 'Multilingual Support',
        description: 'Overcome language barriers with built-in translations for non-English speakers.',
        details: 'Supports over 30 languages to ensure that everyone can fill out forms correctly, regardless of their native language.',
    },
    {
        icon: <VolumeUpOutlinedIcon sx={{ fontSize: 60 }} color="primary" />,
        title: 'Audio Support',
        description: 'Tooltips feature an audio button to read the explanation aloud.',
        details: 'Enhances accessibility for users with visual impairments or reading difficulties, and supports those who prefer auditory learning.',
    },
    {
        icon: <QuestionAnswerOutlinedIcon sx={{ fontSize: 60 }} color="primary" />,
        title: 'Interactive Question Assistant',
        description: 'Get direct answers and guidance through an intuitive chat interface.',
        details: 'Ask specific questions about form fields or general form-filling queries. Our AI-powered assistant provides relevant information, making complex forms easier to navigate.',
    },
    {
        icon: <HelpOutlineOutlinedIcon sx={{ fontSize: 60 }} color="primary" />,
        title: 'Support Assistant',
        description: 'Reach out for help on any form-related issue at any time.',
        details: 'Our 24/7 AI-driven support assistant is ready to guide you through troubleshooting, form guidance, and best practices—no waiting required.',
    },
    {
        icon: <ExtensionOutlinedIcon sx={{ fontSize: 60 }} color="primary" />,
        title: 'Seamless Integration',
        description: 'Use our browser extension or embed our SDK to deliver a smooth user experience.',
        details: 'Quick setup with one line of code and compatibility with most modern web platforms ensures effortless deployment and consistent performance.',
    },
];

const FeatureSectionContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    overflow: 'hidden',
}));

const FeatureRow = ({ feature, index }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const isEven = index % 2 === 0;
    const slideDirectionIcon = isEven ? 'right' : 'left';
    const slideDirectionText = isEven ? 'left' : 'right';

    return (
        <Box ref={ref} sx={{ overflow: 'hidden' }}>
            <FeatureSectionContainer>
                <Grid container spacing={6} alignItems="center" justifyContent="center" sx={{ px: { xs: 2, md: 4 } }}>
                    <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'center', md: isEven ? 'right' : 'left' }, order: { xs: 1, md: isEven ? 1 : 2 } }}>
                        <Slide direction={slideDirectionIcon} in={inView} timeout={800}>
                            <Box display="inline-block">
                                {feature.icon}
                            </Box>
                        </Slide>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ order: { xs: 2, md: isEven ? 2 : 1 } }}>
                        <Slide direction={slideDirectionText} in={inView} timeout={800}>
                            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
                                    {feature.description}
                                </Typography>
                                {feature.details && (
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.details}
                                    </Typography>
                                )}
                            </Box>
                        </Slide>
                    </Grid>
                </Grid>
            </FeatureSectionContainer>
        </Box>
    );
};

const Features = () => (
    <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Grow in timeout={500}>
            <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 4, fontWeight: 'bold' }}>
                Features
            </Typography>
        </Grow>
        {features.map((feature, index) => (
            <FeatureRow key={feature.title} feature={feature} index={index} />
        ))}
    </Box>
);

export default Features;
