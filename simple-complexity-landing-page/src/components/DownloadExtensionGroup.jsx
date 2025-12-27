import { useState } from 'react';
import { Box, Button, Container, Typography, Grow } from '@mui/material';
import MobileIcon from '@mui/icons-material/PhoneAndroid';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';

const DownloadExtensionGroup = () =>
{
    const [iosHover, setIosHover] = useState(false);
    const [androidHover, setAndroidHover] = useState(false);

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const buttonStyles = {
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        px: 3,
        py: 1.5,
        minWidth: '220px',
    };

    return (
        <Box ref={ref} id="download-section-group" sx={{ py: 8, backgroundColor: 'background.paper', textAlign: 'center' }}>
            <Container maxWidth="lg">
                <Grow in={inView} timeout={1000}>
                    <Box>
                        <MobileIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Access SimpleGroup on Any Device
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
                            Stay connected with your family and care team wherever you are. SimpleGroup is available on web, iOS, and Android platforms.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                            <Button
                                component={RouterLink}
                                to="https://simplegroup.simple-complexity.com"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={buttonStyles}
                            >
                                Explore the Platform
                            </Button>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Download the mobile app for your device:
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={!iosHover ? <MobileIcon /> : null}
                                sx={buttonStyles}
                                onMouseEnter={() => setIosHover(true)}
                                onMouseLeave={() => setIosHover(false)}
                            >
                                {iosHover ? "Coming Soon" : "Download for iOS"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"                   
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={!androidHover ? <MobileIcon /> : null}
                                sx={buttonStyles}
                                onMouseEnter={() => setAndroidHover(true)}
                                onMouseLeave={() => setAndroidHover(false)}
                            >
                                {androidHover ? "Coming Soon" : "Download for Android"}
                            </Button>
                        </Box>
                    </Box>
                </Grow>
            </Container>
        </Box>
    );
};

export default DownloadExtensionGroup;

