import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CircularProgress,
  useTheme,
} from '@mui/material';

const Demo = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <Box sx={{ py: 10, textAlign: 'center', backgroundColor: theme.palette.grey[100] }}>
      <Typography variant="h4" gutterBottom>
        See It in Action
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Watch how SimpleForm turns complex forms into clear, user-friendly experiences.
      </Typography>

      <Card
        elevation={4}
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mt: 4,
          overflow: 'hidden',
          borderRadius: 3,
          position: 'relative',
        }}
      >
        <CardMedia
          component="video"
          src="https://simlplecomplexity.s3.us-east-2.amazonaws.com/SFDemo.mp4"
          playsInline
          muted
          controls
          preload="metadata"
          poster="https://simlplecomplexity.s3.us-east-2.amazonaws.com/SFDemoPoster.jpg"
          onLoadedData={handleLoadedData}
          sx={{
            width: '100%',
            height: { xs: 250, sm: 400 },
            objectFit: 'cover',
          }}
        />

        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Demo;
