import { Box, Typography } from '@mui/material';

const Demo = () =>
{
    return (
        <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                See It in Action
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Watch our demo to see how tooltips transform confusing forms into clear, user-friendly experiences.
            </Typography>
            {/* Replace the below Box with your demo video or animated GIF */}
            <Box
                sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    mt: 2,
                }}
            >
                <Typography variant="h6" color="textSecondary">
                    Demo Video/GIF Placeholder
                </Typography>
            </Box>
        </Box>
    );
};

export default Demo;
