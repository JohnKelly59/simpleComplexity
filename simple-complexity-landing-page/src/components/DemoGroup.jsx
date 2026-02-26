import { Box, Typography, Container, Card, CardMedia } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Import screenshots
import screenshot1 from '../assets/screenshots/screenshot1.png';
import screenshot2 from '../assets/screenshots/screenshot2.png';
import screenshot3 from '../assets/screenshots/screenshot3.png';
import screenshot4 from '../assets/screenshots/screenshot4.png';
import screenshot5 from '../assets/screenshots/screenshot5.png';
import screenshot6 from '../assets/screenshots/screenshot6.png';
import screenshot7 from '../assets/screenshots/screenshot7.png';

const screenshots = [
    { src: screenshot1, alt: 'App Screenshot 1' },
    { src: screenshot2, alt: 'App Screenshot 2' },
    { src: screenshot3, alt: 'App Screenshot 3' },
    { src: screenshot4, alt: 'App Screenshot 4' },
    { src: screenshot5, alt: 'App Screenshot 5' },
    { src: screenshot6, alt: 'App Screenshot 6' },
    { src: screenshot7, alt: 'App Screenshot 7' },
];

const DemoGroup = () =>
{
    return (
        <Box sx={{ py: 10, textAlign: 'center', backgroundColor: 'background.default', overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    App Interface
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 6 }}>
                    Experience the intuitive design and powerful features of SimpleGroup.
                </Typography>

                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    className="mySwiper"
                    style={{ paddingBottom: '50px', '--swiper-pagination-color': '#1B5E20' }}
                >
                    {screenshots.map((shot, index) => (
                        <SwiperSlide key={index} style={{ width: '300px', height: 'auto' }}>
                            <Card elevation={10} sx={{ borderRadius: 4, overflow: 'hidden' }}>
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
};

export default DemoGroup;

