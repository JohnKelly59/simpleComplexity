import {
  alpha,
  Box,
  Chip,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PrivacyPolicyPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <title>Privacy Policy | SimpleGroup</title>
      <meta
        name="description"
        content="Read the official SimpleGroup privacy policy. Learn about our data protection, Google user data usage, retention policies, and how to request data deletion."
      />
      <Box
        sx={{
          "--privacy-ink": "#0f172a",
          "--privacy-muted": "#4b5563",
          "--privacy-emerald": "#116530",
          "--privacy-gold": "#D4A017",
          flexGrow: 1,
          py: { xs: 4, md: 7 },
          px: { xs: 2, sm: 3 },
          color: "var(--privacy-ink)",
          background:
            "radial-gradient(circle at 12% 10%, rgba(17,101,48,0.1), transparent 34%), radial-gradient(circle at 88% 90%, rgba(212,160,23,0.15), transparent 40%), linear-gradient(180deg, #ffffff 0%, #f7faf8 100%)",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${alpha("#116530", 0.2)}`,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(15, 23, 42, 0.12)",
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  background:
                    "linear-gradient(110deg, rgba(17,101,48,0.1) 0%, rgba(212,160,23,0.16) 100%)",
                }}
              >
                <Chip
                  label="Legal"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    bgcolor: alpha("#116530", 0.14),
                    color: "#0b3f24",
                  }}
                />
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                  Privacy Policy
                </Typography>
                <Typography variant="body2" sx={{ color: "var(--privacy-muted)" }}>
                  Last Updated: January 28, 2026
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      1. Introduction
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)" }}>
                      Welcome to SimpleGroup ("we", "us", "our"). We are committed to
                      protecting your privacy and the sensitive data entrusted to us.
                      This Privacy Policy explains how we collect, use, disclose, and
                      safeguard your information when you use our website and care
                      management platform (collectively, the "Service").
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      2. Information We Collect
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)", mb: 1 }}>
                      We may collect information about you in a variety of ways:
                    </Typography>
                    <List sx={{ pl: 1.2, listStyleType: "disc" }}>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Personal Data: Personally identifiable information, such as your name, email address, and phone number that you voluntarily give to us when you register." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Google User Data: If you choose to connect your Google Account, we access your basic profile information (name, email, profile picture) to facilitate login. If you enable Calendar syncing, we access your Google Calendar data to sync SimpleGroup events with your personal schedule." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Usage Data: Information automatically collected regarding your IP address, browser type, and operating system." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Facility & Resident Data: Data regarding facility operations and resident care, processed in accordance with HIPAA and Data Processing Agreements." />
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      3. How We Use Your Information
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)", mb: 1 }}>
                      We use the information we collect to:
                    </Typography>
                    <List sx={{ pl: 1.2, listStyleType: "disc" }}>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Create and manage your account." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Provide care coordination and documentation features." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Google Calendar Integration: We use read/write access to your Google Calendar solely to allow you to view SimpleGroup shifts/events/tasks in your Google Calendar and to prevent scheduling conflicts. We do not use this data for advertising purposes." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Send you emails regarding account security and updates." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Comply with legal obligations and healthcare regulations." />
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      4. Data Protection and Security
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)", mb: 1 }}>
                      We implement robust security measures to protect your personal information:
                    </Typography>
                    <List sx={{ pl: 1.2, listStyleType: "disc" }}>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Encryption: All data transmitted between your browser and our servers is encrypted using Secure Socket Layer (SSL) technology. Sensitive data at rest is encrypted using industry-standard standards." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Access Controls: Access to sensitive personal and facility data is restricted to authorized personnel who need to know that information to operate, develop, or improve our Service." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Security Audits: We conduct regular security assessments to identify and mitigate potential vulnerabilities." />
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      5. Data Retention and Deletion
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)", mb: 1 }}>
                      Retention Policy: We retain your personal data and Google user data
                      only for as long as your account is active or as needed to provide
                      you with the Service. Facility and resident data is retained in
                      accordance with applicable healthcare laws (e.g., HIPAA retention requirements).
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)", mb: 1 }}>
                      Deletion Request: You have the right to request the deletion of your personal data.
                    </Typography>
                    <List sx={{ pl: 1.2, listStyleType: "disc" }}>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Self-Service: You may disconnect your Google Account at any time via your User Profile settings. This immediately revokes our access to your Google data." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText
                          primary={
                            <>
                              Manual Request: To request permanent deletion of your account and associated data, please email us at{" "}
                              <Link href="mailto:privacy@simple-complexity.com" sx={{ fontWeight: 700 }}>
                                privacy@simple-complexity.com
                              </Link>
                              . We will process your request within 30 days, subject to any legal obligations to retain certain records.
                            </>
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>

                  <Box
                    sx={{
                      borderLeft: `4px solid ${alpha("#116530", 0.7)}`,
                      pl: 2,
                      py: 0.5,
                      backgroundColor: alpha("#116530", 0.04),
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      6. Google Limited Use Disclosure
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)", fontStyle: "italic" }}>
                      SimpleGroup's use and transfer to any other app of information received
                      from Google APIs will adhere to the{" "}
                      <Link
                        href="https://developers.google.com/terms/api-services-user-data-policy"
                        target="_blank"
                        rel="noopener"
                        sx={{ textDecoration: "underline" }}
                      >
                        Google API Services User Data Policy
                      </Link>
                      , including the Limited Use requirements.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      7. Disclosure of Your Information
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)", mb: 1 }}>
                      We do not sell your personal data. We may share information with:
                    </Typography>
                    <List sx={{ pl: 1.2, listStyleType: "disc" }}>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Service Providers: Third-party vendors (e.g., hosting, payment processing) who perform services on our behalf and are bound by confidentiality agreements." />
                      </ListItem>
                      <ListItem sx={{ display: "list-item", py: 0.45 }}>
                        <ListItemText primary="Legal Requirements: If required by law or to protect the rights and safety of others." />
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      8. Contact Us
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-muted)" }}>
                      If you have questions about this Privacy Policy or our data practices, please contact us at:
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--privacy-ink)", mt: 1, fontWeight: 700 }}>
                      privacy@simple-complexity.com
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default PrivacyPolicyPage;