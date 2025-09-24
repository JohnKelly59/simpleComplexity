import { Box, Button, Container, Typography, Grow } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';

const DownloadExtension = () => {
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
        <Box ref={ref} id="download-section" sx={{ py: 8, backgroundColor: 'background.paper', textAlign: 'center' }}>
            <Container maxWidth="lg">
                <Grow in={inView} timeout={1000}>
                    <Box>
                        <ExtensionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Integrate Our SDK or Try the Extension
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
                           For full business integration and analytics, explore our powerful SDK. For individual use, our browser extension is a great way to start.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                             <Button
                                component={RouterLink}
                                to="/showcase"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={buttonStyles}
                            >
                                Explore the SDK
                            </Button>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Or, download the extension for your browser:
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                href="https://chromewebstore.google.com/detail/fdioljldkjdjcpihdnjdakiijdpagljg?utm_source=item-share-cbe"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<ExtensionIcon />}
                                sx={buttonStyles}
                            >
                                Download for Chrome
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                href="https://addons.mozilla.org/en-US/firefox/addon/simpleform/"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<ExtensionIcon />}
                                sx={buttonStyles}
                            >
                                Download for Firefox
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                href="https://microsoftedge.microsoft.com/addons/detail/jahmieadndjhhadbjcofnakpgheodhdn"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<ExtensionIcon />}
                                sx={buttonStyles}
                            >
                                Download for Edge
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                href="https://apps.apple.com/us/app/simple-form/id6748097506"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<ExtensionIcon />}
                                sx={buttonStyles}
                            >
                                Download for Safari (iOS)
                            </Button>
                        </Box>
                    </Box>
                </Grow>
            </Container>
        </Box>
    );
};

export default DownloadExtension;