import { Box, Typography, Card, CardMedia, useTheme } from '@mui/material';

// **1. Import or define your poster image URL**
//    Ideally, this is a thumbnail or the first frame of your video.
const posterImageUrl = "https://your-s3-bucket/path/to/your/poster-image.jpg"; // Replace with your actual poster image URL

const Demo = () => {
    const theme = useTheme();

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
                <CardMedia
                    component="video"
                    // **2. Add the image prop here**
                    image={posterImageUrl} // This will act as the poster
                    src="https://simlplecomplexity.s3.us-east-2.amazonaws.com/Tooltipdemo1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline // Good practice for mobile autoplay
                    controls={false} // Keep controls hidden as originally intended
                    sx={{
                        width: '100%',
                        height: { xs: 250, sm: 400 },
                        objectFit: 'cover',
                        // Optional: Add a background color while things load initially
                        // backgroundColor: theme.palette.grey[300], // Or another placeholder color
                    }}
                />
            </Card>
        </Box>
    );
};

export default Demo;