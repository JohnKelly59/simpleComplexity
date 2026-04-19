import {
  alpha,
  Box,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

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
          '--about-ink': '#0f172a',
          '--about-muted': '#4b5563',
          '--about-emerald': '#116530',
          '--about-gold': '#D4A017',
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 4, md: 7 },
          background:
            'radial-gradient(circle at 8% 12%, rgba(17,101,48,0.12), transparent 32%), radial-gradient(circle at 88% 82%, rgba(212,160,23,0.16), transparent 40%), linear-gradient(180deg, #ffffff 0%, #f6faf8 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${alpha('#116530', 0.18)}`,
                overflow: 'hidden',
                background:
                  'linear-gradient(140deg, rgba(255,255,255,0.97) 0%, rgba(253,251,244,0.95) 100%)',
                boxShadow: '0 24px 64px rgba(15, 23, 42, 0.12)',
              }}
            >
              <Grid container>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      p: { xs: 3, sm: 4, md: 5 },
                      height: '100%',
                      background:
                        'linear-gradient(180deg, rgba(17,101,48,0.1) 0%, rgba(212,160,23,0.14) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Chip
                      label="About SimpleGroup"
                      sx={{
                        width: 'fit-content',
                        mb: 2,
                        fontWeight: 700,
                        bgcolor: alpha('#116530', 0.14),
                        color: '#0b3f24',
                      }}
                    />
                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{ color: 'var(--about-ink)', fontWeight: 800, lineHeight: 1.1, mb: 1.5 }}
                    >
                      Enhancing care through seamless communication.
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--about-muted)', mb: 3 }}>
                      We help Assisted Living and Memory Care communities reduce
                      complexity, improve trust, and keep every stakeholder aligned.
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <VerifiedRoundedIcon sx={{ color: 'var(--about-emerald)' }} />
                        <Typography variant="body2" sx={{ color: 'var(--about-muted)' }}>
                          Reliable documentation and transparency
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <InsightsRoundedIcon sx={{ color: 'var(--about-gold)' }} />
                        <Typography variant="body2" sx={{ color: 'var(--about-muted)' }}>
                          Operational clarity for staff and leadership
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <GroupsRoundedIcon sx={{ color: 'var(--about-emerald)' }} />
                        <Typography variant="body2" sx={{ color: 'var(--about-muted)' }}>
                          Better coordination across caregivers and families
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ p: { xs: 3, sm: 4.5, md: 5 } }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--about-ink)', mb: 1 }}>
                          Our Mission
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'var(--about-muted)' }}>
                          At SimpleGroup, we are dedicated to solving the most pressing
                          operational challenges for Assisted Living and Memory Care
                          communities. We believe that by unifying care coordination and
                          providing transparent, real-time updates, we can build trust,
                          reduce liability, and free up valuable staff time. Our mission
                          is to create a connected care ecosystem that benefits
                          residents, families, and facilities alike.
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--about-ink)', mb: 1 }}>
                          What We Do
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'var(--about-muted)', mb: 1.25 }}>
                          SimpleGroup provides a centralized platform designed to
                          streamline communication and documentation for care
                          facilities. We empower staff to coordinate seamlessly with
                          external caregivers and family members, ensuring everyone is on
                          the same page.
                        </Typography>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--about-ink)' }}>
                          Key Benefits
                        </Typography>
                        <List sx={{ mt: 0.75, pl: 1.2, color: 'var(--about-muted)', listStyleType: 'disc' }}>
                          <ListItem sx={{ display: 'list-item', py: 0.45 }}>
                            <ListItemText primary="Increase Occupancy Retention: By fostering trust and transparency with families through real-time updates, we help keep residents happy and beds full." />
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', py: 0.45 }}>
                            <ListItemText primary="Reduce Liability Risk: Our comprehensive digital documentation creates an audit-proof trail of all care activities, protecting your facility." />
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', py: 0.45 }}>
                            <ListItemText primary="Save Staff Time: Automated notifications and a family portal significantly reduce inbound calls, allowing your staff to focus on what matters most: resident care." />
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', py: 0.45 }}>
                            <ListItemText primary="Unify Care Coordination: Eliminate miscommunication and care gaps by bringing all stakeholders together on a single, easy-to-use platform." />
                          </ListItem>
                        </List>
                      </Box>

                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--about-ink)', mb: 1 }}>
                          Why Choose Us?
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'var(--about-muted)' }}>
                          We are committed to improving the quality of care and
                          operational efficiency in senior living communities. SimpleGroup
                          is more than just a software solution; it&apos;s a partnership
                          dedicated to helping you provide the best possible experience
                          for your residents and their families. By simplifying complex
                          processes, we help you build a stronger, more resilient
                          community.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
