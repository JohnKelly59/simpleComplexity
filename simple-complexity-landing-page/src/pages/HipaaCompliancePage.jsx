import {
  Box,
  Container,
  Typography,
  Fade,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import StorageIcon from "@mui/icons-material/Storage";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudIcon from "@mui/icons-material/Cloud";
import DevicesIcon from "@mui/icons-material/Devices";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const sections = [
  {
    icon: <LockIcon sx={{ fontSize: 28 }} />,
    title: "Encryption & Data Protection",
    items: [
      "All data encrypted in transit via TLS 1.2+",
      "Database encryption at rest using AES-256",
      "Signed URLs for secure file access with expiration",
      "Encrypted backup storage",
      "Sensitive fields encrypted at the application layer",
    ],
  },
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />,
    title: "Access Controls & Authentication",
    items: [
      "Role-based access control (RBAC) with 70+ granular permissions",
      "Facility-scoped data isolation — users only access their facility's data",
      "Multi-factor authentication (MFA) support",
      "Session management with automatic token expiration",
      "Custom roles with facility-level permission assignment",
      "OAuth 2.0 authentication (Google, Apple)",
    ],
  },
  {
    icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
    title: "Audit Logging & Accountability",
    items: [
      "Comprehensive audit trail for all user actions",
      "Immutable logs with timestamps and user attribution",
      "Activity tracking across clinical, administrative, and communication actions",
      "Audit logs accessible to facility administrators",
    ],
  },
  {
    icon: <StorageIcon sx={{ fontSize: 28 }} />,
    title: "Data Integrity & Retention",
    items: [
      "Soft deletes preserve data integrity — records are never permanently destroyed without authorization",
      "GDPR-compliant user data export with signed download links",
      "PostgreSQL database with transactional integrity and referential constraints",
      "Automated database backups",
    ],
  },
  {
    icon: <CloudIcon sx={{ fontSize: 28 }} />,
    title: "Infrastructure & Hosting",
    items: [
      "Hosted on HIPAA-eligible AWS infrastructure",
      "Business Associate Agreements (BAAs) in place with infrastructure providers",
      "Isolated environments for production data",
      "Regular security updates and dependency patching",
    ],
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 28 }} />,
    title: "Application Security",
    items: [
      "API authentication via Laravel Sanctum with scoped tokens",
      "CSRF and XSS protections built into the framework",
      "Input validation and sanitization on all endpoints",
      "Rate limiting on sensitive endpoints (authentication, AI features)",
      "CORS policies restricting cross-origin access",
    ],
  },
  {
    icon: <NotificationsActiveIcon sx={{ fontSize: 28 }} />,
    title: "Breach Notification & Incident Response",
    items: [
      "Incident response procedures in place for potential breaches",
      "Real-time error monitoring and alerting",
      "Commitment to notify affected parties within 60 days of a confirmed breach, consistent with HIPAA requirements",
    ],
  },
];

const HipaaCompliancePage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <title>HIPAA Compliance | SimpleGroup</title>
      <meta
        name="description"
        content="Learn how SimpleGroup protects healthcare data with encryption, access controls, audit logging, and HIPAA-aligned security practices."
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          py: 8,
          px: 4,
          color: "#1a1a2e",
          bgcolor: "#f8fafc",
        }}
      >
        <Container maxWidth="md">
          <Fade in={loaded} timeout={1000}>
            <Box>
              {/* Header */}
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Chip
                  label="Security & Compliance"
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: "#116530",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  HIPAA Compliance
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.7,
                    maxWidth: 600,
                    mx: "auto",
                    lineHeight: 1.8,
                  }}
                >
                  SimpleGroup is built from the ground up with healthcare data
                  security in mind. Our platform implements administrative,
                  physical, and technical safeguards aligned with the HIPAA
                  Security Rule to protect electronic Protected Health
                  Information (ePHI).
                </Typography>
              </Box>

              {/* Checklist Sections */}
              <Stack spacing={3}>
                {sections.map((section) => (
                  <Paper
                    key={section.title}
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      border: "1px solid #e2e8f0",
                      borderRadius: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 2.5,
                      }}
                    >
                      <Box sx={{ color: "#116530" }}>{section.icon}</Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, fontSize: "1.2rem" }}
                      >
                        {section.title}
                      </Typography>
                    </Box>
                    <Stack spacing={1.5}>
                      {section.items.map((item) => (
                        <Box
                          key={item}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                          }}
                        >
                          <CheckCircleIcon
                            sx={{
                              color: "#116530",
                              fontSize: 20,
                              mt: "2px",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ opacity: 0.85, lineHeight: 1.6 }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              {/* Disclaimer */}
              <Paper
                elevation={0}
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.7, lineHeight: 1.7 }}
                >
                  <strong>Note:</strong> There is no official "HIPAA
                  Certification." HIPAA compliance is an ongoing process of
                  implementing and maintaining appropriate safeguards. SimpleGroup
                  continuously evaluates and improves its security posture to
                  align with HIPAA requirements. If you have questions about our
                  security practices, please{" "}
                  <Box
                    component="a"
                    href="/contact"
                    sx={{ color: "#116530", fontWeight: 600 }}
                  >
                    contact us
                  </Box>
                  .
                </Typography>
              </Paper>

              <Typography
                variant="caption"
                display="block"
                sx={{ textAlign: "center", mt: 3, opacity: 0.5 }}
              >
                Last Updated: April 2026
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default HipaaCompliancePage;
