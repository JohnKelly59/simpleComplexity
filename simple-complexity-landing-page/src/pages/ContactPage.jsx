import { useState, useEffect } from "react";
import {
  alpha,
  Box,
  Button,
  TextField,
  Alert,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "", // Added phone field to state
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setError("Email configuration is missing. Please contact support.");
      setLoading(false);
      console.error(
        "EmailJS environment variables for contact form are not set."
      );
      return;
    }

    try {
      await emailjs.send(serviceId, templateId, formData, publicKey);
      setSubmitted(true);
      // Reset form fields, including the new phone field
      setFormData({
        user_name: "",
        user_email: "",
        user_phone: "",
        message: "",
      });
    } catch (err) {
      console.error("EmailJS Contact Error:", err);
      setError(
        "Something went wrong sending your message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Contact Us | Simple Complexity</title>
      <meta
        name="description"
        content="Have questions or feedback for the Simple Complexity team? Reach out to us for more information about our SDK, pricing, or to request a demo."
      />
      <Box
        sx={{
          "--contact-ink": "#0f172a",
          "--contact-muted": "#4b5563",
          "--contact-emerald": "#116530",
          "--contact-gold": "#D4A017",
          "--contact-paper": "#fefcf6",
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 4, md: 7 },
          background:
            "radial-gradient(circle at 12% 8%, rgba(212, 160, 23, 0.16), transparent 38%), radial-gradient(circle at 90% 88%, rgba(17, 101, 48, 0.18), transparent 44%), linear-gradient(180deg, #ffffff 0%, #f7faf8 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: alpha("#D4A017", 0.15),
            filter: "blur(30px)",
            top: -70,
            left: -100,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: alpha("#116530", 0.2),
            filter: "blur(42px)",
            bottom: -120,
            right: -120,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${alpha("#116530", 0.18)}`,
                overflow: "hidden",
                background:
                  "linear-gradient(130deg, rgba(255,255,255,0.95) 0%, rgba(254,252,246,0.95) 100%)",
                boxShadow: "0 24px 64px rgba(15, 23, 42, 0.14)",
              }}
            >
              <Grid container>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      height: "100%",
                      p: { xs: 3, sm: 4, md: 5 },
                      color: "var(--contact-ink)",
                      background:
                        "linear-gradient(180deg, rgba(17,101,48,0.08) 0%, rgba(212,160,23,0.12) 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={loaded ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Chip
                        label="Direct Support"
                        sx={{
                          mb: 2,
                          width: "fit-content",
                          fontWeight: 700,
                          letterSpacing: 0.2,
                          color: "#0b3f24",
                          bgcolor: alpha("#116530", 0.14),
                        }}
                      />
                    </motion.div>

                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{ fontWeight: 800, lineHeight: 1.1, mb: 1.5 }}
                    >
                      Let's build something clear and useful.
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: "var(--contact-muted)", maxWidth: 380, mb: 3 }}
                    >
                      Questions about setup, pricing, or implementation? Send us a
                      message and our team will follow up with practical next steps.
                    </Typography>

                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <AccessTimeRoundedIcon sx={{ color: "var(--contact-emerald)" }} />
                        <Typography variant="body2" sx={{ color: "var(--contact-muted)" }}>
                          Typical response time: under 1 business day
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <MailOutlineRoundedIcon sx={{ color: "var(--contact-gold)" }} />
                        <Typography variant="body2" sx={{ color: "var(--contact-muted)" }}>
                          Include your use case for a faster, tailored response
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <SupportAgentRoundedIcon sx={{ color: "var(--contact-emerald)" }} />
                        <Typography variant="body2" sx={{ color: "var(--contact-muted)" }}>
                          Product and technical support in one thread
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ p: { xs: 3, sm: 4.5, md: 5 } }}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={loaded ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.16 }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ color: "var(--contact-ink)", mb: 0.75, fontWeight: 800 }}
                      >
                        Contact Us
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--contact-muted)", mb: 3 }}>
                        Share as much context as you can. The more detail you provide,
                        the better we can help.
                      </Typography>
                    </motion.div>

                    <Box
                      component={motion.form}
                      initial="hidden"
                      animate={loaded ? "visible" : "hidden"}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
                      }}
                      onSubmit={handleSubmit}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <TextField
                          label="Your Name"
                          variant="outlined"
                          name="user_name"
                          value={formData.user_name}
                          onChange={handleChange}
                          required
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "var(--contact-paper)",
                            },
                          }}
                        />
                      </motion.div>

                      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <TextField
                          label="Your Email"
                          variant="outlined"
                          type="email"
                          name="user_email"
                          value={formData.user_email}
                          onChange={handleChange}
                          required
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "var(--contact-paper)",
                            },
                          }}
                        />
                      </motion.div>

                      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <TextField
                          label="Phone (Optional)"
                          variant="outlined"
                          type="tel"
                          name="user_phone"
                          value={formData.user_phone}
                          onChange={handleChange}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "var(--contact-paper)",
                            },
                          }}
                        />
                      </motion.div>

                      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <TextField
                          label="Message (Optional)"
                          variant="outlined"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          fullWidth
                          multiline
                          rows={5}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "var(--contact-paper)",
                            },
                          }}
                        />
                      </motion.div>

                      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            mt: 0.5,
                            py: 1.4,
                            borderRadius: 2,
                            fontWeight: 700,
                            letterSpacing: 0.2,
                            background:
                              "linear-gradient(90deg, var(--contact-emerald) 0%, #1f8a48 100%)",
                            boxShadow: "0 10px 20px rgba(17, 101, 48, 0.28)",
                            "&:hover": {
                              background:
                                "linear-gradient(90deg, #0f5a2a 0%, #17743b 100%)",
                            },
                          }}
                        >
                          {loading ? "Sending..." : "Send Message"}
                        </Button>
                      </motion.div>

                      {submitted && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                          Message sent successfully! We'll get back to you soon.
                        </Alert>
                      )}
                      {error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {error}
                        </Alert>
                      )}
                    </Box>
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

export default ContactPage;
