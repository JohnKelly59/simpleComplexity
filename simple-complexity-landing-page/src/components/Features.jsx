// src/components/Features.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// 1. Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Import relevant business-oriented icons
import SdkIcon from '@mui/icons-material/DataObject';
import AiIcon from '@mui/icons-material/AutoAwesome';
import TranslateIcon from '@mui/icons-material/Translate';
import AnalyticsIcon from '@mui/icons-material/QueryStats';
import SupportIcon from '@mui/icons-material/SupportAgent';
import VideoIcon from '@mui/icons-material/Duo';
import AccessibilityIcon from '@mui/icons-material/AccessibilityNew';
import FunnelIcon from '@mui/icons-material/FilterAlt';
import LogsIcon from '@mui/icons-material/ReceiptLong';
import FeedbackIcon from '@mui/icons-material/Feedback';

const featureCategories = [
  {
    category: 'Core SDK Features',
    features: [
      { icon: <SdkIcon fontSize="large" color="primary" />, title: 'Seamless SDK Integration', description: 'Easily embed our lightweight SDK into your existing forms to provide instant value to your users without compromising on performance or developer cost.' },
      { icon: <AiIcon fontSize="large" color="primary" />, title: 'AI-Powered Tooltips', description: 'Leverage our AI to automatically generate clear, helpful tooltips for any form field, reducing user confusion and support requests.' },
      { icon: <VideoIcon fontSize="large" color="primary" />, title: 'Product Demos & Tutorials', description: 'Create engaging product demos and tutorials directly within your app, guiding users through complex workflows and features.' },
    ]
  },
  {
    category: 'Engagement & Accessibility',
    features: [
      { icon: <TranslateIcon fontSize="large" color="primary" />, title: 'Full Page Translation', description: 'Capture a global audience by offering instant, full-page translations, making your application accessible to users worldwide.' },
      { icon: <AccessibilityIcon fontSize="large" color="primary" />, title: 'Enhanced Accessibility', description: 'Improve usability for all users with features like audio support and clear, concise language, ensuring compliance and a better user experience.' },
      { icon: <SupportIcon fontSize="large" color="primary" />, title: 'Interactive Support Assistant', description: 'Provide 24/7 support with our AI-driven assistant, answering user questions in real-time and reducing the load on your support team.' },
    ]
  },
  {
    category: 'Analytics & Support',
    features: [
      { icon: <AnalyticsIcon fontSize="large" color="primary" />, title: 'User Behavior Analytics', description: 'Gain valuable insights into user behavior with detailed analytics on form completions, drop-offs, and tooltip interactions.' },
      { icon: <FunnelIcon fontSize="large" color="primary" />, title: 'Conversion Funnels', description: 'Track and optimize your conversion funnels with real-time data, identifying friction points and improving your user onboarding process.' },
      { icon: <LogsIcon fontSize="large" color="primary" />, title: 'Audit & Event Logs', description: 'Maintain a complete record of all SDK actions, including AI-generated tooltips, translations, and user interactions, for auditing and compliance.' },
      { icon: <FeedbackIcon fontSize="large" color="primary" />, title: 'Video Feedback Loop', description: 'Allow users to record and submit video feedback directly from your app to your dashboard, providing clear insights for customer service and developers.' },
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

const Features = () => {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
          A Powerful SDK to Drive Business Growth
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 8, maxWidth: '700px', mx: 'auto' }}>
          SimpleForm provides a comprehensive suite of tools to improve user onboarding, reduce support costs, and unlock global markets.
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
              style={{ paddingBottom: '40px', '--swiper-pagination-color':'#116530' }}
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

export default Features;