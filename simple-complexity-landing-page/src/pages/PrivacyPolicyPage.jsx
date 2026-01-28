import { Box, Container, Typography, Fade, Link } from "@mui/material";
import { useState, useEffect } from "react";

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
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          py: 8,
          px: 4,
          color: "#fff",
        }}
      >
        <Container maxWidth="md">
          <Fade in={loaded} timeout={1000}>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: 700 }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ textAlign: "center", opacity: 0.8 }}
              >
                Last Updated: January 28, 2026
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  1. Introduction
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  Welcome to SimpleGroup ("we", "us", "our"). We are committed to
                  protecting your privacy and the sensitive data entrusted to us.
                  This Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you use our website and care
                  management platform (collectively, the "Service").
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  2. Information We Collect
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  We may collect information about you in a variety of ways:
                  <ul>
                    <li>
                      <strong>Personal Data:</strong> Personally identifiable
                      information, such as your name, email address, and phone
                      number that you voluntarily give to us when you register.
                    </li>
                    <li>
                      <strong>Google User Data:</strong> If you choose to connect
                      your Google Account, we access your basic profile information
                      (name, email, profile picture) to facilitate login. If you enable
                      Calendar syncing, we access your Google Calendar data to sync
                      SimpleGroup events with your personal schedule.
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Information automatically
                      collected regarding your IP address, browser type, and
                      operating system.
                    </li>
                    <li>
                      <strong>Facility & Resident Data:</strong> Data regarding
                      facility operations and resident care, processed in
                      accordance with HIPAA and Data Processing Agreements.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  3. How We Use Your Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  We use the information we collect to:
                  <ul>
                    <li>Create and manage your account.</li>
                    <li>Provide care coordination and documentation features.</li>
                    <li>
                      <strong>Google Calendar Integration:</strong> We use read/write
                      access to your Google Calendar solely to allow you to view
                      SimpleGroup shifts/events/tasks in your Google Calendar and to
                      prevent scheduling conflicts. We do not use this data for
                      advertising purposes.
                    </li>
                    <li>Send you emails regarding account security and updates.</li>
                    <li>Comply with legal obligations and healthcare regulations.</li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  4. Data Protection and Security
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  We implement robust security measures to protect your personal information:
                  <ul>
                    <li>
                      <strong>Encryption:</strong> All data transmitted between your 
                      browser and our servers is encrypted using Secure Socket Layer (SSL) 
                      technology. Sensitive data at rest is encrypted using industry-standard standards.
                    </li>
                    <li>
                      <strong>Access Controls:</strong> Access to sensitive personal and 
                      facility data is restricted to authorized personnel who need to know 
                      that information to operate, develop, or improve our Service.
                    </li>
                    <li>
                      <strong>Security Audits:</strong> We conduct regular security assessments 
                      to identify and mitigate potential vulnerabilities.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  5. Data Retention and Deletion
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  <strong>Retention Policy:</strong> We retain your personal data and 
                  Google user data only for as long as your account is active or as needed 
                  to provide you with the Service. Facility and resident data is retained 
                  in accordance with applicable healthcare laws (e.g., HIPAA retention requirements).
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  <strong>Deletion Request:</strong> You have the right to request the 
                  deletion of your personal data.
                  <ul>
                    <li>
                      <strong>Self-Service:</strong> You may disconnect your Google Account 
                      at any time via your User Profile settings. This immediately revokes 
                      our access to your Google data.
                    </li>
                    <li>
                      <strong>Manual Request:</strong> To request permanent deletion of 
                      your account and associated data, please email us at{' '}
                      <Link href="mailto:privacy@simple-complexity.com" color="inherit" sx={{ fontWeight: 'bold' }}>
                        privacy@simple-complexity.com
                      </Link>. We will process your request within 30 days, subject to 
                      any legal obligations to retain certain records.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  6. Google Limited Use Disclosure
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9, fontStyle: 'italic', borderLeft: '4px solid #fff', pl: 2 }}>
                  SimpleGroup's use and transfer to any other app of information received 
                  from Google APIs will adhere to the{' '}
                  <Link 
                    href="https://developers.google.com/terms/api-services-user-data-policy" 
                    target="_blank" 
                    rel="noopener"
                    color="inherit" 
                    sx={{ textDecoration: 'underline' }}
                  >
                    Google API Services User Data Policy
                  </Link>, including the Limited Use requirements.
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  7. Disclosure of Your Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  We do not sell your personal data. We may share information with:
                  <ul>
                    <li>
                      <strong>Service Providers:</strong> Third-party vendors (e.g., hosting, 
                      payment processing) who perform services on our behalf and are bound 
                      by confidentiality agreements.
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> If required by law or to protect 
                      the rights and safety of others.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  8. Contact Us
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  If you have questions about this Privacy Policy or our data practices, 
                  please contact us at: <br />
                  <strong>Email:</strong> privacy@simple-complexity.com
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default PrivacyPolicyPage;