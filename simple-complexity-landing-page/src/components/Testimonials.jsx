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
        quote: "Integrating the SDK was straightforward. We saw a 15% reduction in support tickets related to form questions within the first month. The video feedback feature is a game-changer for our dev team.",
        role: "Head of Product",
    },
    {
        quote: "This tool provides clarity for any forms or documents that may seem confusing. The interface is discreet yet very effective when it comes to providing information.",
        role: "Educator",
    },
    {
        quote: "SimpleForm has significantly improved our user onboarding. The AI tooltips help new users complete complex setup forms much faster, leading to a measurable lift in our activation rate.",
        role: "Chief Technology Officer",
    },
    {
        quote: "It serves as a one-stop shop is tailored to better user experiences for businesses or educational institutions. Having all of these functions in one software allows you to stand out.",
        role: "UX Specialist",
    },
    {
        quote: "The analytics dashboard gives us clear insights into where users struggle on our application forms. We've used this data to simplify our forms and improve our completion rates.",
        role: "Chief Executive Officer",
    },
    {
        quote: "It combines AI with a lot of other tools, making it like a Swiss Army knife type of app. The language features and SDK are what make it stand out.",
        role: "Developer",
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
                    Trusted by Innovators
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