import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                    Trusted by Innovators
                </Typography>
                <Slider {...settings}>
                    {testimonials.map((testimonial, index) => (
                        <Box key={index} sx={{ px: 2 }}>
                             <TestimonialCard elevation={3}>
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
                        </Box>
                    ))}
                </Slider>
            </Container>
        </Box>
    );
};

export default Testimonials;