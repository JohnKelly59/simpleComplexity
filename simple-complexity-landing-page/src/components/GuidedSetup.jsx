import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const GuidedSetup = () => (
    <Box sx={{ py: 8, backgroundColor: '#f0f4f8', textAlign: 'center' }}>
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Interested in a Guided Setup?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
                We offer a complimentary 1:1 demo to walk you through the app's capabilities and assist with integration.
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={RouterLink}
                to="/contact"
            >
                Schedule a Demo
            </Button>
        </Container>
    </Box>
);

export default GuidedSetup;