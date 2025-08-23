import {
  Box,
  Typography,
  Card,
  CardMedia,
  useTheme,
} from '@mui/material';

const Demo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 10, textAlign: 'center',backgroundColor: 'background.default' }}>
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
          sx={{
            width: '100%',
            height: { xs: 250, sm: 400 },
            objectFit: 'cover',
          }}
        />
      </Card>
    </Box>
  );
};

export default Demo;
