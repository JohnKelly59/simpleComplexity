import { useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

const VideoSection = () => {
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  const handleVideoClick = () => {
    if (!showControls) {
      setShowControls(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
          >
            Product Demo
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Watch SimpleGroup in Action
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#4a5568', maxWidth: 600, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            See how clinical workflows, family communication, and facility operations
            come together in one platform.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 800,
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            cursor: !showControls ? 'pointer' : 'default',
          }}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            src="https://simlplecomplexity.s3.us-east-2.amazonaws.com/SGdemo1.mp4"
            width="100%"
            height="auto"
            autoPlay
            muted
            loop
            playsInline
            controls={showControls}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default VideoSection;
