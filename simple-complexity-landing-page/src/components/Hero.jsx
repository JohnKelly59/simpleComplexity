import { Box, Typography, Container, Fade } from '@mui/material';
import { useState, useEffect } from 'react';
import JoinUsForm from './JoinUsForm';
import scColorLogo from '../assets/SC_COLOR.png';
import BetaBadge from './BetaBadge';

const Hero = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
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
                position: 'relative',
                p: 4,
                background: 'linear-gradient(to right, #116530, #134E8E)',
            }}
        >
            <BetaBadge />
            <Container maxWidth="sm">
                <Fade in={loaded} timeout={1000}>
                    <Box>
                        <Box
                            component="img"
                            src={scColorLogo}
                            alt="Simple Complexity Logo"
                            sx={{
                                width: '240px',
                                mb: 1,
                            }}
                        />
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                            Understand Any Form. Instantly.
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Auto-generated tooltips that simplify and translate confusing form questions—in real time.
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
                            Currently in Beta: Request your free Pro trial via our contact page and help shape the future of form clarity!
                        </Typography>
                        <JoinUsForm />
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Hero;