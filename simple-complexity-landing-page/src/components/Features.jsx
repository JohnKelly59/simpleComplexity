import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Icons (assuming they are imported as in your original file)
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ClosedCaptionOutlinedIcon from '@mui/icons-material/ClosedCaptionOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';


// Your featureCategories data remains the same
const featureCategories = [
    {
        category: 'Core Features',
        features: [
            { icon: <LightbulbOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Instant Clarity', description: 'Automatically simplify confusing form questions using our database of tooltips.' },
            { icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'AI-Powered Insights', description: 'Real-time AI generation for tooltips when a question isn’t in our database.' },
            { icon: <ExtensionOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Seamless Integration', description: 'Use our browser extension or embed our SDK to deliver a smooth user experience.' },
        ]
    },
    {
        category: 'Accessibility & Translation',
        features: [
            { icon: <TranslateOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Multilingual Support', description: 'Overcome language barriers with built-in translations for non-English speakers.' },
            { icon: <LanguageOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Full Page Translation', description: 'Instantly translate entire web pages with a single click, preserving layout and functionality.' },
            { icon: <VolumeUpOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Audio Support', description: 'Tooltips feature an audio button to read the explanation aloud.' },
        ]
    },
    {
        category: 'Content & Media',
        features: [
            { icon: <VideocamOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Video Recording', description: 'Capture your screen and camera in one go with our built-in recorder.' },
            { icon: <ClosedCaptionOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'AI Caption Creation', description: 'Let our AI analyze your videos and automatically generate engaging, context-aware captions.' },
            { icon: <ShareOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Social Media Sharing', description: 'Post your videos directly to social media with AI-generated captions, all from one place.' },
        ]
    },
    {
        category: 'Support & Analytics',
        features: [
            { icon: <QuestionAnswerOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Interactive Question Assistant', description: 'Get direct answers and guidance through an intuitive chat interface.' },
            { icon: <HelpOutlineOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Support Assistant', description: 'Reach out for help on any issue at any time with our 24/7 AI-driven support.' },
            { icon: <QueryStatsOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Analytics & Funnels', description: 'Track views, starts, completions, and drop-offs in real time.' },
            { icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 40 }} color="primary" />, title: 'Event Logs & Auditing', description: 'Centralized logs for SDK actions, translations, AI tooltips, and recordings.' },
        ]
    }
];

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
    width: '100%',
    minHeight: 200, // Ensure cards have a consistent height
}));

// A simple feature card, stripped of animation logic which is now handled by the parent
const FeatureCard = ({ feature }) => (
    <StyledCard>
        <CardContent>
            {feature.icon}
            <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'medium', mt: 2 }}>
                {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {feature.description}
            </Typography>
        </CardContent>
    </StyledCard>
);

const FeatureCategorySection = ({ category }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const MotionGrid = motion(Grid);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        // THIS IS THE FIX: Set a minimum height in the collapsed state
        <Box
            sx={{
                mb: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: isExpanded ? 'auto' : 350, // Reserve space when collapsed
                transition: 'min-height 0.4s ease-out', // Smooth height transition
            }}
        >
            <motion.div
                layout
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h3" textAlign="center" sx={{ mb: 4, fontWeight: 'medium' }}>
                    {category.category}
                </Typography>

                <AnimatePresence>
                    {!isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'relative', width: 300, height: 200, display: 'flex', justifyContent: 'center' }}
                        >
                            {category.features.slice(0, 3).map((feature, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{
                                        rotate: (index - 1) * 10,
                                        y: -20,
                                        scale: 1.05
                                    }}
                                    style={{
                                        position: 'absolute',
                                        width: '80%',
                                        originX: 0.5,
                                        originY: 1,
                                        rotate: (index - 1) * 3,
                                        zIndex: 3 - index,
                                    }}
                                >
                                    <FeatureCard feature={feature} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <MotionGrid
                        container
                        spacing={4}
                        justifyContent="center"
                        sx={{ px: { xs: 2, md: 4 }, width: '100%' }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {category.features.map((feature, featureIndex) => (
                            <MotionGrid item xs={12} sm={6} md={4} key={featureIndex} variants={itemVariants}>
                                <FeatureCard feature={feature} />
                            </MotionGrid>
                        ))}
                    </MotionGrid>
                )}
            </AnimatePresence>
        </Box>
    );
};


const Features = () => {
    return (
        <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
            <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                Everything You Need to Simplify Complexity
            </Typography>

            {featureCategories.map((category, index) => (
                <FeatureCategorySection key={index} category={category} />
            ))}
        </Box>
    );
};

export default Features;