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
        quote: "SimpleGroup has transformed how our family coordinates care for our aging parents. We can all stay updated on medications, appointments, and care visits in real-time. It's been a game-changer.",
        role: "Family Caregiver",
    },
    {
        quote: "As a care facility administrator, SimpleGroup has streamlined our communication with families significantly. The medication tracking and visit documentation features are essential tools for our daily operations.",
        role: "Care Facility Administrator",
    },
    {
        quote: "The platform makes it so easy to manage my mother's care schedule. I can coordinate with my siblings, track medications, and ensure nothing falls through the cracks. Highly recommend!",
        role: "Daughter & Primary Caregiver",
    },
    {
        quote: "SimpleGroup's messaging feature has improved our family communication dramatically. We can share updates, photos, and coordinate care responsibilities seamlessly.",
        role: "Family Member",
    },
    {
        quote: "The vital signs tracking and health analytics have helped us monitor my father's condition more effectively. The visual trends make it easy to spot changes and share with healthcare providers.",
        role: "Son & Care Coordinator",
    },
    {
        quote: "SimpleGroup combines all the tools we need for comprehensive care management in one platform. The secure messaging, task management, and visit documentation are all we need.",
        role: "Care Manager",
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
                    Trusted by Families and Care Providers
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

