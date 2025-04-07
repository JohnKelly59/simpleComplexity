import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import scColorLogo from '../assets/SC_COLOR.png';

const Header = () =>
{
    return (

        <AppBar
            position="static"
            sx={{
                background: 'linear-gradient(to right, #116530, #134E8E)',
                boxShadow: 'none',
                py: 1,
            }}
        >
            <Toolbar sx={{ justifyContent: 'center' }}>
                <IconButton component={RouterLink} to="/" sx={{ p: 0 }}>
                    <Box
                        component="img"
                        src={scColorLogo}
                        alt="Simple Complexity Logo"
                        sx={{
                            height: '100px',
                            width: 'auto',
                        }}
                    />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;