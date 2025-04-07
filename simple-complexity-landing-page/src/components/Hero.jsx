import { Box, Typography, Container, Fade } from '@mui/material';
import { useState, useEffect } from 'react';
import JoinUsForm from './JoinUsForm';
import scColorLogo from '../assets/SC_COLOR.png';

const Hero = () =>
{
    const [loaded, setLoaded] = useState(false);

    useEffect(() =>
    {
        const timeout = setTimeout(() => setLoaded(true), 200);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                background: 'linear-gradient(to right, #116530, #134E8E)',
            }}
        >
            <Container maxWidth="sm">
                <Fade in={loaded} timeout={1000}>
                    <Box>
                        <Box
                            component="img"
                            src={scColorLogo}
                            alt="SC Logo"
                            sx={{
                                width: '240px',
                                mb: 1,
                            }}
                        />
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                            Understand Any Form. Instantly.
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4 }}>
                            Auto-generated tooltips that simplify and translate confusing form questions—in real time.
                        </Typography>
                        <JoinUsForm />
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Hero;
