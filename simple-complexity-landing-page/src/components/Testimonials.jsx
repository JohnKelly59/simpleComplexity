// src/components/Testimonials.jsx
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

// 1. Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    {
        quote: "Testing the SDK integration was straightforward. We can already see the potential for reducing support tickets. The video feedback feature is going to be a game-changer.",
        role: "Head of Product (Beta Tester)",
    },
    {
        quote: "I've been testing the tool on confusing documents, and it provides great clarity. The interface is discreet and effective. A very promising beta.",
        role: "Educator (Beta Participant)",
    },
    {
        quote: "We joined the beta to see if it could improve onboarding. The AI tooltips are already helping users complete forms faster in our test environment.",
        role: "CTO (Early Access User)",
    },
    {
        quote: "Testing this as a one-stop shop for user experience has been great. It's tailored for businesses and education, and the feature set is impressive for a beta.",
        role: "UX Specialist (Beta Tester)",
    },
    {
        quote: "The beta analytics dashboard is giving us early insights into user struggles. We're using this test data to plan our form simplifications.",
        role: "CEO (Beta Partner)",
    },
    {
        quote: "It combines AI with a lot of tools. Testing the language features and SDK showed us how it stands out. Excited for the stable release.",
        role: "Developer (Beta Tester)",
    }
];

const TestimonialCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    margin: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
    fontSize: 40,
    color: theme.palette.primary.main,
    transform: 'rotate(180deg)',
    marginBottom: theme.spacing(1),
}));

const Testimonials = () => {
    return (
        <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                    Feedback from our Beta Testers
                </Typography>

                {/* 2. Replace Slider with Swiper */}
                <Swiper
                    modules={[Pagination, Autoplay]} // Enable required modules
                    spaceBetween={30} // Space between slides
                    slidesPerView={1} // Default slides to show
                    pagination={{ clickable: true }} // Make dots clickable
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        400: {
                            slidesPerView: 1,
                        },
                        600: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    style={{ paddingBottom: '40px',   '--swiper-pagination-color':'#116530' }} // Add padding for pagination dots
                >
                    {testimonials.map((testimonial, index) => (
                        // 4. Wrap each item in a SwiperSlide
                        <SwiperSlide key={index}>
                            <TestimonialCard elevation={3} sx={{ height: '100%' }}>
                                <Box>
                                    <QuoteIcon />
                                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, minHeight: '120px' }}>
                                        "{testimonial.quote}"
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
                                        {testimonial.role}
                                    </Typography>
                                </Box>
                            </TestimonialCard>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
        </Box>
    );
};

export default Testimonials;