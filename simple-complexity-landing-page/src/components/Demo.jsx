import { Box, Typography, Container, Card, CardMedia } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import screenshot1 from '../assets/screenshots/screenshot1.png';
import screenshot2 from '../assets/screenshots/screenshot2.png';
import screenshot3 from '../assets/screenshots/screenshot3.png';
import screenshot4 from '../assets/screenshots/screenshot4.png';
import screenshot5 from '../assets/screenshots/screenshot5.png';
import screenshot6 from '../assets/screenshots/screenshot6.png';
import screenshot7 from '../assets/screenshots/screenshot7.png';

const screenshots = [
  { src: screenshot1, alt: 'Dashboard Overview' },
  { src: screenshot2, alt: 'Resident Care View' },
  { src: screenshot3, alt: 'Messaging Interface' },
  { src: screenshot4, alt: 'Calendar & Scheduling' },
  { src: screenshot5, alt: 'Medication Tracking' },
  { src: screenshot6, alt: 'Forms Builder' },
  { src: screenshot7, alt: 'Reports & Analytics' },
];

const Demo = () => (
  <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff', overflow: 'hidden' }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="overline"
          sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
        >
          Product Preview
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
        >
          See the Platform in Action
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#4a5568', maxWidth: 600, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}
        >
          An intuitive interface designed for care teams of all technical levels.
        </Typography>
      </Box>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        coverflowEffect={{ rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        style={{ paddingBottom: '50px', '--swiper-pagination-color': '#116530' }}
      >
        {screenshots.map((shot, index) => (
          <SwiperSlide key={index} style={{ width: '300px', height: 'auto' }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
              }}
            >
              <CardMedia
                component="img"
                image={shot.src}
                alt={shot.alt}
                sx={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  </Box>
);

export default Demo;
