import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import scFlatLogo from '../assets/SC_FLAT.png';

const Footer = ({ variant = 'default' }) =>
{

    const baseSx = {
        py: 4,
        width: '100%',
    };

    const variantSx = {
        default: {
            backgroundColor: '#f5f5f5',
            borderTop: '1px solid #e0e0e0',
            color: 'text.secondary',
            '& a': {
                color: 'primary.main',
            },
        },
        styled: {
            background: 'linear-gradient(to right, #116530, #134E8E)',
            color: '#fff',
            '& a': {
                color: '#fff',
                textDecorationColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                    textDecorationColor: '#fff',
                }
            },
        },
    };

    return (
        <Box
            component="footer"
            sx={{ ...baseSx, ...variantSx[variant] }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Box
                    component="img"
                    src={scFlatLogo}
                    alt="SC Flat Logo"
                    sx={{
                        width: '80px',
                        mb: 1,
                    }}
                />
                <Typography variant="body2" color="inherit" sx={{ opacity: variant === 'styled' ? 0.9 : 1 }}>
                    © {new Date().getFullYear()} Simple Complexity. All rights reserved.
                </Typography>

                <Box mt={1}>
                    <MuiLink component={RouterLink} to="/about" sx={{ mx: 1 }}>
                        About
                    </MuiLink>
                    <MuiLink component={RouterLink} to="/blog" sx={{ mx: 1 }}>Blog</MuiLink>
                    <MuiLink component={RouterLink} to="/contact" sx={{ mx: 1 }}>
                        Contact
                    </MuiLink>
                    <MuiLink component={RouterLink} to="/privacy" sx={{ mx: 1 }}>
                        Privacy Policy
                    </MuiLink>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;