import { Box, Button, Container, Typography, Grow } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import { useInView } from 'react-intersection-observer';

const DownloadExtension = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const buttonStyles = {
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        px: 4,
        py: 1.5,
        minWidth: '300px', 
    };

    return (
        <Box ref={ref} id="download-section" sx={{ py: 8, backgroundColor: 'background.default', textAlign: 'center' }}>
            <Container maxWidth="md">
                <Grow in={inView} timeout={1000}>
                    <Box>
                        <ExtensionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Get the Simple Complexity Extension
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
                            Start simplifying forms today. Install our browser extension to get instant, AI-powered tooltips directly in your browser.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
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
                                variant="contained"
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
                                variant="contained"
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
                                variant="contained"
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