import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
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
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', p: 4 }}>
        <Container maxWidth="md">
          <Fade in={loaded} timeout={1000}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1a1a2e' }}>
                  Frequently Asked Questions
                </Typography>
                <Typography variant="h6" sx={{ color: '#4a5568' }}>
                  Answers to common questions about SimpleGroup for healthcare teams and families.
                </Typography>
              </Box>

              {faqItems.map((item, index) => (
                <Accordion
                  key={index}
                  elevation={0}
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.7 }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default FAQPage;