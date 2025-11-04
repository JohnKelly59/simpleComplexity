import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const GuidedSetupGroup = () => (
    <Box sx={{ py: 10, backgroundColor: 'background.default', textAlign: 'center' }}>
        <Container maxWidth="md">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Unlock the Full Potential of SimpleGroup
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
                Schedule a complimentary 1:1 demo with our team to explore the platform's capabilities and get expert assistance with your care coordination setup.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/contact"
                sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.1rem', px: 5, py: 1.5 }}
            >
                Request a Live Demo
            </Button>
        </Container>
    </Box>
);

export default GuidedSetupGroup;

