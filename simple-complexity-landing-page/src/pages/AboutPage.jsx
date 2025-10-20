import { Box, Container, Typography, Fade } from "@mui/material";
import { useState, useEffect } from "react";

const AboutPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <title>About Simple Complexity | Our Mission</title>
      <meta
        name="description"
        content="Learn about Simple Complexity's mission: Making the complex simple by providing an intelligent tooltip and AI solution to clarify online forms."
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          color: "#fff",
        }}
      >
        <Container maxWidth="md">
          <Fade in={loaded} timeout={1000}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                About Simple Complexity
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Making the complex simple, one tooltip at a time.
              </Typography>

              <Box sx={{ mb: 4, textAlign: "left" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  At Simple Complexity, we believe that accessing information
                  and services online should be straightforward for everyone. We
                  saw a common frustration: confusing online forms filled with
                  jargon or unclear questions. This complexity leads to errors,
                  abandoned forms, and unnecessary stress for users. Our mission
                  is to eliminate this barrier by providing instant clarity
                  exactly when and where it's needed.
                </Typography>
              </Box>

              <Box sx={{ mb: 4, textAlign: "left" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  What We Do
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  Simple Complexity offers an intelligent tooltip solution
                  designed to simplify online forms. We leverage a combination
                  of a curated database and cutting-edge AI to provide clear,
                  plain-language explanations for form fields.
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  <strong>Key Features:</strong>
                  <ul>
                    <li>
                      <strong>Instant Clarity:</strong> Access our vast database
                      of pre-defined tooltips for common form questions.
                    </li>
                    <li>
                      <strong>AI-Powered Insights:</strong> For unique or
                      complex questions, our AI generates helpful explanations
                      in real-time.
                    </li>
                    <li>
                      <strong>Multilingual Support:</strong> We break down
                      language barriers by offering tooltips in over 30
                      languages.
                    </li>
                    <li>
                      <strong>Seamless Integration:</strong> Easily add Simple
                      Complexity to your website or application using our
                      browser extension or a simple SDK embed.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  Why Choose Us?
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  We are dedicated to improving user experience and
                  accessibility. By simplifying forms, we help businesses
                  increase completion rates, reduce support requests, and build
                  more inclusive digital environments. Whether through our free
                  plan or our powerful pro options, Simple Complexity is here to
                  make the web a little less complex for everyone.
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
