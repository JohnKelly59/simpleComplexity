import { Box, Container, Link, Typography } from '@mui/material';
import scFlatLogo from '../assets/SC_FLAT.png';

const Footer = () =>
{
    return (
        <Box
            sx={{
                py: 4,
                mt: 4,
                backgroundColor: '#f5f5f5',
            }}
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
                {/* LOGO */}
                <Box
                    component="img"
                    src={scFlatLogo}
                    alt="SC Flat Logo"
                    sx={{
                        width: '80px',
                        mb: 1,
                    }}
                />

                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} Tooltip Accessibility. All rights reserved.
                </Typography>

                <Box mt={1}>
                    <Link href="#" sx={{ mx: 1 }}>
                        About
                    </Link>
                    <Link href="#" sx={{ mx: 1 }}>
                        Blog
                    </Link>
                    <Link href="#" sx={{ mx: 1 }}>
                        Contact
                    </Link>
                    <Link href="#" sx={{ mx: 1 }}>
                        Privacy Policy
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
