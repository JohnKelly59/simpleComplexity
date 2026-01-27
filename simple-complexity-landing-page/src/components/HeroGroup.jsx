// src/components/HeroGroup.jsx
import
{
    Box,
    Typography,
    Button,
    Container,
    Grow,
    Stack,
    Chip,
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HeroGroup = () =>
{
    return (
        <Box
            sx={{
                minHeight: "90vh",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                position: "relative",
                p: 4,
                overflow: "hidden",
                background: "linear-gradient(135deg, #0D47A1 0%, #1B5E20 100%)", // Deep Blue to Forest Green
            }}
        >
            {/* Background Overlay for texture/depth */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 0%, transparent 25%), radial-gradient(circle at 80% 50%, #ffffff 0%, transparent 25%)',
                    zIndex: 1,
                }}
            />

            <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 4 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    href="https://simplegroup.simple-complexity.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    Login
                </Button>
            </Box>

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3 }}>
                <Grow in={true} timeout={1000}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                            component="img"
                            src={"/simplegroup-logo.png"}
                            alt="SimpleGroup Logo"
                            sx={{
                                width: { xs: "300px", sm: "300px" },
                                mb: 0,
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                            }}
                        />
                        {/* <Chip label="Beta" color="secondary" size="small" sx={{ mt : -5, mb: 2 }} /> */}
                        <Typography
                            variant="h1"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                letterSpacing: '-0.02em',
                                lineHeight: 1.2,
                                mb: 3,
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            The Complete Platform for<br />
                            <Box component="span" sx={{ color: '#4CAF50' }}>Healthcare Management</Box>
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 6,
                                maxWidth: "800px",
                                mx: "auto",
                                lineHeight: 1.6,
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 400
                            }}
                        >
                            Connect residents, families, and staff in one unified ecosystem.
                            Streamline operations, enhance communication, and deliver superior care with SimpleGroup.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                href="#features-section-group"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(0,0,0,0.3)' },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Explore Features
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                href="contact"
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    borderWidth: 2,
                                    '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                Contact Sales
                            </Button>
                        </Stack>
                    </Box>
                </Grow>
            </Container>
        </Box>
    );
};

export default HeroGroup;

