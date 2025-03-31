import { Box, Typography, Card, CardMedia, useTheme } from '@mui/material';

const Demo = () =>
{
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
                    src="https://simlplecomplexity.s3.us-east-2.amazonaws.com/Tooltipdemo1.mp4"
                    autoPlay
                    muted
                    loop
                    controls={false}
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
