import { Box, Container, Typography, Fade } from '@mui/material';
import { useState, useEffect } from 'react';

const AboutPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <title>About SimpleGroup | Our Mission</title>
      <meta
        name="description"
        content="Learn about SimpleGroup's mission: To enhance communication and streamline care coordination in assisted living and memory care communities."
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Container maxWidth="md">
          <Fade in={loaded} timeout={1000}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1a1a2e' }}>
                  About SimpleGroup
                </Typography>
                <Typography variant="h5" component="p" sx={{ color: '#4a5568' }}>
                  Enhancing care through seamless communication.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a1a2e', textAlign: 'center' }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: '#4a5568' }}>
                  At SimpleGroup, we are dedicated to solving the most pressing
                  operational challenges for Assisted Living and Memory Care
                  communities. We believe that by unifying care coordination and
                  providing transparent, real-time updates, we can build trust,
                  reduce liability, and free up valuable staff time. Our mission
                  is to create a connected care ecosystem that benefits
                  residents, families, and facilities alike.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a1a2e', textAlign: 'center' }}>
                  What We Do
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: '#4a5568' }}>
                  SimpleGroup provides a centralized platform designed to
                  streamline communication and documentation for care
                  facilities. We empower staff to coordinate seamlessly with
                  external caregivers and family members, ensuring everyone is on
                  the same page.
                </Typography>
                <Typography variant="body1" component="div" sx={{ color: '#4a5568' }}>
                  <strong>Key Benefits:</strong>
                  <ul>
                    <li>
                      <strong>Increase Occupancy Retention:</strong> By
                      fostering trust and transparency with families through
                      real-time updates, we help keep residents happy and beds
                      full.
                    </li>
                    <li>
                      <strong>Reduce Liability Risk:</strong> Our comprehensive
                      digital documentation creates an audit-proof trail of all
                      care activities, protecting your facility.
                    </li>
                    <li>
                      <strong>Save Staff Time:</strong> Automated notifications
                      and a family portal significantly reduce inbound calls,
                      allowing your staff to focus on what matters most—resident
                      care.
                    </li>
                    <li>
                      <strong>Unify Care Coordination:</strong> Eliminate
                      miscommunication and care gaps by bringing all
                      stakeholders together on a single, easy-to-use platform.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a1a2e', textAlign: 'center' }}>
                  Why Choose Us?
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: '#4a5568' }}>
                  We are committed to improving the quality of care and
                  operational efficiency in senior living communities. SimpleGroup
                  is more than just a software solution; it&apos;s a partnership
                  dedicated to helping you provide the best possible experience
                  for your residents and their families. By simplifying complex
                  processes, we help you build a stronger, more resilient
                  community.
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
