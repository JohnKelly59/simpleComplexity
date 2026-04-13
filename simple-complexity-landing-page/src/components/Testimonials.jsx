import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    quote:
      'SimpleGroup has transformed how our facility coordinates care. Medications, incidents, and visits are tracked in real time. Our operational efficiency improved noticeably within the first quarter.',
    name: 'Margaret D.',
    role: 'Executive Director',
    facility: 'Sunrise Assisted Living',
  },
  {
    quote:
      'The family portal gives us peace of mind. We can see our mother\'s medication schedule, upcoming visits, and communicate securely with her care team — all from one app.',
    name: 'David R.',
    role: 'Primary Caregiver',
    facility: 'Family Member',
  },
  {
    quote:
      'The admission workflow system cut our intake processing time by over half. AI-powered form extraction and data mapping means less manual entry and fewer errors during onboarding.',
    name: 'Patricia K.',
    role: 'Director of Admissions',
    facility: 'Meadowbrook Senior Living',
  },
  {
    quote:
      'Incident reporting used to take ages. Now staff document everything in minutes, and the AI summary drafts help us maintain consistent, thorough records for state surveys.',
    name: 'Thomas B.',
    role: 'Compliance Officer',
    facility: 'Heritage Health & Rehabilitation',
  },
  {
    quote:
      'Having messaging, scheduling, and task management in one place eliminated constant phone calls and paper trails. Our staff can focus on residents instead of chasing information.',
    name: 'Linda M.',
    role: 'Director of Nursing',
    facility: 'Oakwood Memory Care',
  },
  {
    quote:
      'The role-based permissions give us the control we need. Each staff member sees exactly what they should — no more, no less. It\'s the kind of access management we expected from a mature platform.',
    name: 'James W.',
    role: 'IT Administrator',
    facility: 'Crestview Senior Communities',
  },
];

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
}));

const Testimonials = () => (
  <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="overline"
          sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
        >
          Testimonials
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
        >
          Trusted by Care Teams and Families
        </Typography>
      </Box>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          600: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: '48px', '--swiper-pagination-color': '#116530' }}
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <TestimonialCard>
              <Box>
                <FormatQuoteIcon
                  sx={{ fontSize: 32, color: '#116530', opacity: 0.4, transform: 'rotate(180deg)', mb: 1 }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontStyle: 'italic', color: '#4a5568', lineHeight: 1.7, mb: 3.5 }}
                >
                  &ldquo;{t.quote}&rdquo;
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                {t.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                {t.role}{t.facility ? ` — ${t.facility}` : ''}
              </Typography>
            </TestimonialCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  </Box>
);

export default Testimonials;
