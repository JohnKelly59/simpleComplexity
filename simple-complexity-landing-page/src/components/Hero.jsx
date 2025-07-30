import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grow,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as ScrollLink } from "react-scroll";
import scColorLogo from "../assets/SC_COLOR.png";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (isNotMobile) {
      const timer = setTimeout(() => {
        setShowVideo(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isNotMobile]);

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
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, #116530, #134E8E)",
          zIndex: 1,
          opacity: showVideo ? 0 : 1,
          transition: "opacity 1s ease-in-out",
        }}
      />
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "50%",
            left: "50%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: showVideo ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
          src="https://simlplecomplexity.s3.us-east-2.amazonaws.com/Tooltipdemo1.mp4"
        />
      )}
      {showVideo && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 2,
            transition: "background-color 1s ease-in-out",
          }}
        />
      )}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 3 }}>
        <Grow in={true} timeout={1000}>
          <Box>
            <Box
              component="img"
              src={scColorLogo}
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
              Understand Any Form. Instantly.
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, maxWidth: "650px", mx: "auto" }}
            >
              Auto-generated tooltips that simplify and translate confusing form
              questions—in real time.
            </Typography>
            <ScrollLink to="demo-section" smooth={true} duration={500}>
              <Button variant="contained" color="secondary" size="large">
                See How It Works
              </Button>
            </ScrollLink>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default Hero;
