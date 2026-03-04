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
      'SimpleGroup is a healthcare operations and communication platform built for assisted living, memory care, and care coordination teams. It brings messaging, scheduling, tasking, documentation, and family communication into one secure system.',
  },
  {
    question: 'Who is SimpleGroup built for?',
    answer:
      'SimpleGroup supports administrators, clinical staff, caregivers, and family members. Facilities use it to improve operations and coordination, while families use it to stay informed and connected.',
  },
  {
    question: 'How does SimpleGroup handle facility access controls?',
    answer:
      'SimpleGroup includes role-based permissions, facility-level assignment, and scoped access by responsibility. Admins can control who can view or edit clinical records, incidents, documents, schedules, and communications.',
  },
  {
    question: 'What AI capabilities are available?',
    answer:
      'SimpleGroup offers AI-assisted summaries and operational support features that help teams quickly interpret activity context, reduce manual admin work, and speed decision-making. AI features are designed to support teams, not replace clinical judgment.',
  },
  {
    question: 'Can families and staff communicate securely?',
    answer:
      'Yes. Secure messaging supports direct and group communication across care teams and families, with notification controls and centralized conversation history.',
  },
  {
    question: 'Does SimpleGroup support scheduling and visits?',
    answer:
      'Yes. Teams can manage shifts, appointments, events, and family visit requests in one shared scheduling workflow to reduce coordination friction.',
  },
  {
    question: 'How are incidents, medications, and vitals tracked?',
    answer:
      'SimpleGroup includes dedicated workflows for incident reporting, medication tracking, and vital monitoring with structured records that improve continuity and accountability.',
  },
  {
    question: 'Does SimpleGroup provide audit and compliance support?',
    answer:
      'Yes. The platform includes audit logs and activity tracking to support internal oversight and compliance-oriented documentation practices.',
  },
  {
    question: 'How is data protected?',
    answer:
      'SimpleGroup uses secure authentication patterns, permission-based access, and protected data workflows to reduce unauthorized access and improve operational data governance. Database data is encrypted at rest, and the platform is HIPAA compliant.',
  },
  {
    question: 'How can I request a demo or speak with sales?',
    answer:
      'You can use the Contact page to request a walkthrough. The team can provide a tailored demo based on your facility size, staffing model, and care workflow priorities.',
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
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          p: 4,
          color: '#fff',
        }}
      >
        <Container maxWidth="md">
          <Fade in={loaded} timeout={1000}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Frequently Asked Questions
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Answers to common questions about SimpleGroup for healthcare teams and families.
                </Typography>
              </Box>

              {faqItems.map((item, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
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