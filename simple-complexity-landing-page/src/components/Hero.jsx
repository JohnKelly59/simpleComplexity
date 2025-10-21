// src/components/Hero.jsx
import {
  Box,
  Typography,
  Button,
  Container,
  Grow,
} from "@mui/material";
import { Link as ScrollLink } from "react-scroll";

const Hero = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        p: 4,
        overflow: "hidden",
        background: "linear-gradient(to right, #116530, #134E8E)",
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 4 }}>
        <Button
         variant="contained" color="secondary" size="large"
          sx={{ color: 'white' }}
          href="https://app.simple-complexity.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to App
        </Button>
      </Box>
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 3 }}>
        <Grow in={true} timeout={1000}>
          <Box>
            <Box
              component="img"
              src={"/SC_COLOR.png"}
              alt="Simple Complexity Logo"
              sx={{
                width: { xs: "180px", sm: "240px" },
                mb: 1,
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Simplify Your Forms. Grow Your Business.
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, maxWidth: "600px", mx: "auto" }}
            >
              Reduce support tickets and boost form completion rates with our
              AI-assisted SDK.
            </Typography>
              <Button variant="contained" color="secondary" size="large" href="/showcase"  sx={{ color: 'white' }}>
                See How It Works
              </Button>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default Hero;