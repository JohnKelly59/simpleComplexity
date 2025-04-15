import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, CardMedia, useTheme, CircularProgress } from '@mui/material';

const Demo = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleVideoLoaded = () => {
      setIsLoading(false);
    };

    if (videoElement) {
      videoElement.addEventListener('canplaythrough', handleVideoLoaded);

      if (videoElement.readyState >= 4) {
        setIsLoading(false);
      }
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('canplaythrough', handleVideoLoaded);
      }
    };
  }, []);

  return (
    <Box sx={{ py: 10, textAlign: 'center', backgroundColor: theme.palette.grey[100] }}>
      <Typography variant="h4" gutterBottom>
        See It in Action
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Watch how Form-Tooltip turns complex forms into clear, user-friendly experiences.
      </Typography>

      <Card
        elevation={4}
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mt: 4,
          overflow: 'hidden',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 250, sm: 400 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isLoading ? theme.palette.grey[200] : 'transparent',
          }}
        >
          {isLoading && <CircularProgress sx={{ position: 'absolute' }} />}

          <CardMedia
            ref={videoRef}
            component="video"
            src="https://simlplecomplexity.s3.us-east-2.amazonaws.com/Tooltipdemo1.mp4"
            autoPlay
            muted
            loop
            controls={false}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Demo;
