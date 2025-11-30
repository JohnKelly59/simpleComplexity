// src/components/TestimonialsGroup.jsx
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
        quote: "Testing the SimpleGroup beta has transformed how our family coordinates care. Even in early access, we can stay updated on medications and visits. It's already a game-changer.",
        role: "Family Caregiver (Beta Tester)",
    },
    {
        quote: "Participating in the beta trial, SimpleGroup has shown it can streamline our communication. The medication tracking features we tested are essential tools.",
        role: "Care Facility Administrator (Beta Partner)",
    },
    {
        quote: "The beta platform makes it easy to manage my mother's care schedule. Testing the coordination features with my siblings has been great. Highly recommend joining the beta!",
        role: "Daughter & Primary Caregiver (Beta User)",
    },
    {
        quote: "Testing the messaging feature in the beta has improved our family communication. We've been able to share updates and coordinate seamlessly during the trial.",
        role: "Family Member (Beta Tester)",
    },
    {
        quote: "The beta's vital signs tracking helped us monitor my father's condition. Seeing the visual trends in this early version makes it easy to spot changes.",
        role: "Son & Care Coordinator (Beta Participant)",
    },
    {
        quote: "SimpleGroup's beta combines all the tools we need. We've been testing the secure messaging and task management, and it's exactly what we need.",
        role: "Care Manager (Beta Tester)",
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

const TestimonialsGroup = () =>
{
    return (
        <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                    Beta Feedback from Families and Care Providers
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
                    style={{ paddingBottom: '40px', '--swiper-pagination-color': '#116530' }} // Add padding for pagination dots
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

export default TestimonialsGroup;

