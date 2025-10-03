import {
  Box,
  Typography,
  Card,
  CardMedia,
  Container,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ExtensionIcon from '@mui/icons-material/Extension';

const videos = [
  {
    title: 'Business Dashboard',
    src: 'https://simlplecomplexity.s3.us-east-2.amazonaws.com/dashboarddemo.mp4',
    icon: <DashboardIcon fontSize="large" color="primary" />,
  },
   {
    title: 'Chrome Extension Walkthrough',
    src: 'https://simlplecomplexity.s3.us-east-2.amazonaws.com/SFDemo.mp4',
    icon: <ExtensionIcon fontSize="large" color="primary" />,
  },
  {
    title: 'SDK Showcase',
    src: 'https://simlplecomplexity.s3.us-east-2.amazonaws.com/landingpagedemo.mp4',
    icon: <DataObjectIcon fontSize="large" color="primary" />,
  },
];

const Demo = () => {
  return (
    <Box sx={{ py: 10, textAlign: 'center', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          See It in Action
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Watch how SimpleForm turns complex forms into clear, user-friendly experiences.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4, flexWrap: 'wrap' }}>
          {videos.map((video, index) => (
            <Card
              key={index}
              elevation={4}
              sx={{
                overflow: 'hidden',
                borderRadius: 3,
                width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 22px)' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ p: 2 }}>
                {video.icon}
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  {video.title}
                </Typography>
              </Box>
              <CardMedia
                component="video"
                src={video.src}
                playsInline
                muted
                controls
                preload="metadata"
                sx={{
                  width: '100%',
                  height: 250,
                  objectFit: 'cover',
                }}
              />
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Demo;