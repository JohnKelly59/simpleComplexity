import { useState, useEffect } from 'react';
import {
  alpha,
  Box,
  Chip,
  Container,
  Typography,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqItems = [
  {
    question: 'What is SimpleGroup?',
    answer:
      'SimpleGroup is a comprehensive healthcare operations and communication platform built for assisted living, memory care, skilled nursing, and independent living communities. It brings clinical workflows, messaging, scheduling, admissions, documentation, forms, and family communication into one secure system.',
  },
  {
    question: 'Who is SimpleGroup built for?',
    answer:
      'SimpleGroup supports administrators, clinical staff, caregivers, residents, and family members. Facilities use it to streamline operations, manage admissions, track care, and maintain compliance. Families use it to stay informed, communicate securely, and coordinate visits.',
  },
  {
    question: 'What clinical features does SimpleGroup include?',
    answer:
      'SimpleGroup includes eMAR (Electronic Medication Administration Records), vitals monitoring with visual trends, incident reporting with AI-assisted drafts, care task management, and comprehensive clinical profiles including diagnoses, allergies, immunizations, and emergency contacts.',
  },
  {
    question: 'How do admission workflows work?',
    answer:
      'SimpleGroup offers configurable multi-step admission workflows. You can create reusable templates, guide new resident intake step-by-step, and use AI to extract data from paper forms and auto-map fields to clinical records. Steps can be paused, skipped, reopened, or restarted at any time.',
  },
  {
    question: 'How does SimpleGroup handle facility access controls?',
    answer:
      'SimpleGroup includes role-based permissions, facility-level assignment, custom role creation, and scoped access by responsibility. Admins can control who can view or edit clinical records, incidents, documents, schedules, and communications at a granular level.',
  },
  {
    question: 'What AI capabilities are available?',
    answer:
      'SimpleGroup offers AI-assisted summaries, AI form generation, document extraction, admission data mapping, and operational insights. All AI features are human-in-the-loop — teams review and approve AI-generated content before it becomes part of records.',
  },
  {
    question: 'What is Simple Group Forms?',
    answer:
      'Simple Group Forms is a built-in form builder that supports both AI-generated and manually-created forms. Forms include role-based and user-level access controls, secure external links for respondents without accounts, and downloadable PDF exports for audits and compliance.',
  },
  {
    question: 'Can families and staff communicate securely?',
    answer:
      'Yes. HIPAA-compliant secure messaging supports 1-on-1 and group communication across care teams and families, with push notifications, conversation history, and a family activity feed for posts and updates.',
  },
  {
    question: 'Does SimpleGroup support scheduling and visits?',
    answer:
      'Yes. Teams can manage staff shifts, facility events with RSVP, family visit requests and approvals, and personal calendars — all in one unified scheduling view with Google Calendar two-way sync.',
  },
  {
    question: 'Does SimpleGroup provide audit and compliance support?',
    answer:
      'Yes. The platform includes comprehensive audit logging with timestamped records, filterable by user, action, and resource. Data is encrypted at rest, and the platform is designed for HIPAA compliance.',
  },
  {
    question: 'What platforms is SimpleGroup available on?',
    answer:
      'SimpleGroup is available as a web application and an iOS mobile app, with Android support coming soon. The platform is responsive and works across desktop, tablet, and mobile devices.',
  },
  {
    question: 'How can I request a demo or speak with sales?',
    answer:
      'Use the Contact page to request a personalized walkthrough. Our team will provide a tailored demo based on your facility size, staffing model, and care workflow priorities.',
  },
];

const FAQPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <title>FAQ | SimpleGroup</title>
      <meta
        name="description"
        content="Frequently asked questions about SimpleGroup, including features, access controls, AI capabilities, security, and onboarding."
      />
      <Box
        sx={{
          '--faq-ink': '#0f172a',
          '--faq-muted': '#4b5563',
          '--faq-emerald': '#116530',
          '--faq-gold': '#D4A017',
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 4, md: 7 },
          background:
            'radial-gradient(circle at 10% 8%, rgba(17,101,48,0.12), transparent 34%), radial-gradient(circle at 86% 88%, rgba(212,160,23,0.16), transparent 40%), linear-gradient(180deg, #ffffff 0%, #f6faf8 100%)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${alpha('#116530', 0.2)}`,
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(15, 23, 42, 0.12)',
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  background:
                    'linear-gradient(112deg, rgba(17,101,48,0.1) 0%, rgba(212,160,23,0.16) 100%)',
                }}
              >
                <Chip
                  icon={<HelpOutlineRoundedIcon />}
                  label="Support"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: '#0b3f24',
                    bgcolor: alpha('#116530', 0.14),
                    '& .MuiChip-icon': { color: '#0b3f24' },
                  }}
                />
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: 'var(--faq-ink)', mb: 1 }}>
                  Frequently Asked Questions
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--faq-muted)', maxWidth: 760 }}>
                  Answers to common questions about SimpleGroup for healthcare teams and families.
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Stack spacing={1.5}>
                  {faqItems.map((item, index) => (
                    <motion.div
                      key={item.question}
                      initial={{ opacity: 0, y: 10 }}
                      animate={loaded ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.35, delay: 0.05 + index * 0.03 }}
                    >
                      <Accordion
                        elevation={0}
                        sx={{
                          borderRadius: 2,
                          border: `1px solid ${alpha('#116530', 0.16)}`,
                          backgroundColor: alpha('#ffffff', 0.94),
                          overflow: 'hidden',
                          '&::before': { display: 'none' },
                          '&.Mui-expanded': {
                            borderColor: alpha('#116530', 0.34),
                            boxShadow: '0 10px 20px rgba(17, 101, 48, 0.1)',
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: 'var(--faq-emerald)' }} />}
                          sx={{ px: { xs: 2, sm: 2.5 }, py: 0.4 }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--faq-ink)' }}>
                            {item.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pt: 0.5, pb: 2.2 }}>
                          <Typography variant="body1" sx={{ color: 'var(--faq-muted)', lineHeight: 1.75 }}>
                            {item.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default FAQPage;