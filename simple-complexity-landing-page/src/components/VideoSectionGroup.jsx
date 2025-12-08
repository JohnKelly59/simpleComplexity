import React, { useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

const VideoSectionGroup = () => {
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  const handleVideoClick = () => {
    if (!showControls) {
      setShowControls(true);
      if (videoRef.current) {
        // Optional: Unmute when user interacts, as they likely want to hear it now.
        // However, browsers might block unmuting without a direct user gesture stack.
        // The click event here IS a user gesture, so it should work.
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => console.log("Play failed:", e));
      }
    }
  };

  return (
    <Box sx={{ py: 10, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Watch the Demo
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          See how SimpleGroup works in action.
        </Typography>
        
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px', // Limit width for better viewing
            mx: 'auto',
            borderRadius: 4,
            overflow: 'hidden',
            
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

export default VideoSectionGroup;
