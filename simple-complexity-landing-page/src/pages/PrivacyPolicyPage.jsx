import { Box, Container, Typography, Fade } from "@mui/material";
import { useState, useEffect } from "react";

const PrivacyPolicyPage = () =>
{
  const [loaded, setLoaded] = useState(false);

  useEffect(() =>
  {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <title>Privacy Policy | SimpleGroup</title>
      <meta
        name="description"
        content="Read the official SimpleGroup privacy policy to understand how we collect, use, disclose, and safeguard your information when you use our care management platform."
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
                Last Updated: November 23, 2025
              </Typography>
              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Introduction
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  Welcome to SimpleGroup ("we", "us", "our"). We are
                  committed to protecting your privacy and the sensitive data entrusted to us. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you use our website and care management platform (collectively, the "Service"). 
                  Please read this policy carefully. If you do not agree with the terms of this
                  privacy policy, please do not access the Service.
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Information We Collect
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  We may collect information about you in a variety of ways. The
                  information we may collect via the Service includes:
                  <ul>
                    <li>
                      <strong>Personal Data:</strong> Personally identifiable
                      information, such as your name, email address, and phone number that you
                      voluntarily give to us when you register for the Service,
                      request a demo, or contact us.
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Information automatically
                      collected when you access the Service, such as your IP
                      address, browser type, operating system, access times, and
                      the pages you have viewed directly before and after
                      accessing the Service.
                    </li>
                    <li>
                      <strong>Facility & Resident Data:</strong> In the course of providing our care management services, 
                      we process data regarding facility operations, staff activities, and resident care. 
                      This information is processed in strict accordance with applicable healthcare privacy regulations 
                      (including HIPAA where applicable) and our Data Processing Agreements with your facility.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  How We Use Your Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  Having accurate information permits us to provide you with a
                  smooth, efficient, and customized experience. Specifically, we
                  may use information collected about you via the Service to:
                  <ul>
                    <li>Create and manage your account and facility access.</li>
                    <li>
                      Provide, operate, and maintain the Service, including care coordination and documentation features.
                    </li>
                    <li>Improve, personalize, and expand the Service.</li>
                    <li>Understand and analyze how you use the Service to improve workflows.</li>
                    <li>
                      Develop new products, services, features, and
                      functionality.
                    </li>
                    <li>
                      Communicate with you, either directly or through one of
                      our partners, including for customer service, to provide
                      you with updates and other information relating to the
                      Service, and for marketing and promotional purposes (where
                      permitted by law and with your consent where required).
                    </li>
                    <li>Process your transactions (if applicable).</li>
                    <li>
                      Send you emails (e.g., account notifications, security alerts, responses to inquiries).
                    </li>
                    <li>Find and prevent fraud and ensure data security.</li>
                    <li>Comply with legal obligations and healthcare regulations.</li>
                  </ul>
                </Typography>
              </Box>
              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Disclosure of Your Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  We may share information we have collected about you in
                  certain situations. Your information may be disclosed as
                  follows:
                  <ul>
                    <li>
                      <strong>By Law or to Protect Rights:</strong> If we
                      believe the release of information about you is necessary
                      to respond to legal process, to investigate or remedy
                      potential violations of our policies, or to protect the
                      rights, property, and safety of others, we may share your
                      information as permitted or required by any applicable
                      law, rule, or regulation.
                    </li>
                    <li>
                      <strong>Third-Party Service Providers:</strong> We may
                      share your information with third parties that perform
                      services for us or on our behalf, including payment
                      processing, data analysis, email delivery,
                      hosting services, customer service, and marketing assistance. 
                      All providers are vetted for security and compliance.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> We may share or
                      transfer your information in connection with, or during
                      negotiations of, any merger, sale of company assets,
                      financing, or acquisition of all or a portion of our
                      business to another company.
                    </li>
                  </ul>
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Us
                </Typography>
                <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                  If you have questions or comments about this Privacy Policy,
                  please contact us using the contact form on our website or by
                  emailing us at privacy@simple-complexity.com
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
