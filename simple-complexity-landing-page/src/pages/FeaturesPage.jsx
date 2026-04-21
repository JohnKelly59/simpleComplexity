import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
} from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ForumIcon from '@mui/icons-material/Forum';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const featureData = [
  {
    category: 'Authentication & User Accounts',
    icon: <LockPersonIcon fontSize="large" />,
    items: [
      'Sign Up & Login: Email/Password registration.',
      'Social Login: Google and Apple integration.',
      'Password Management: Forgot and reset flows.',
      'Onboarding: Dedicated user onboarding flow.',
      'Profile: Edit details, avatar, banner, and user attributes.',
      'Roles: Admin, Staff, Family, and Resident.',
      'Custom Roles: Create facility-specific roles with tailored permissions.',
      'Session Security: Verified login and protected account workflows.',
    ],
  },
  {
    category: 'Facility Management & Access Controls',
    icon: <ApartmentIcon fontSize="large" />,
    items: [
      'Operations: Create, edit, and manage care facilities.',
      'Staffing: Manage users, teams, and assignments.',
      'Resident Room Tracking: Store and update resident room numbers in facility context for accurate location visibility.',
      'Invitations: Search and invite users easily.',
      'Scoped Access: Facility-level access segmentation.',
      'Role Permissions: Fine-grained read/write controls by module.',
      'Clinical Restrictions: Limit medication, vitals, and incident access.',
      'Communication Controls: Restrict conversation and feed visibility by role.',
      'Approval Boundaries: Delegate privileged actions to approved administrators.',
    ],
  },
  {
    category: 'Messaging & Communication',
    icon: <ForumIcon fontSize="large" />,
    items: [
      'Secure Chat: 1-on-1 and Group messaging.',
      'Care Teams: Dedicated group channels.',
      'History: Full conversation archives.',
      'Family Connections: Manage relationships and invitations.',
      'Social Feed: Community news, posts, comments, and reactions.',
      'Push Notifications: Real-time alerts with device management.',
      'Escalation Ready: Trigger urgent communication for time-sensitive events.',
    ],
  },
  {
    category: 'Calendar, Scheduling & Visits',
    icon: <EventAvailableIcon fontSize="large" />,
    items: [
      'Events: Manage facility-wide activities with RSVP.',
      'Unified View: Staff, activity, and personal events.',
      'Work Orders: Create, assign, prioritize, and track maintenance requests by status, category, due date, and location.',
      'Google Sync: Two-way sync with personal calendars.',
      'Visits: Family request and approval system.',
      'Shifts: Staff shift management and coverage visibility.',
      'Event Invitations: Invite users or entire facilities.',
      'Coverage Visibility: Improve handoff planning and staffing continuity.',
    ],
  },
  {
    category: 'Care & Clinical Workflows',
    icon: <MonitorHeartIcon fontSize="large" />,
    items: [
      'Medications: Track prescriptions & schedules.',
      'eMAR: Electronic Administration Records with audit trails.',
      'Tasks: Daily care task tracking and assignment.',
      'Vitals: Monitor BP, heart rate, temperature, and more.',
      'Incidents: Log and track reports with AI-assisted drafts.',
      'Diagnoses & Allergies: Comprehensive clinical profiles.',
      'Immunizations: Maintain vaccination records.',
      'Emergency Contacts: Instant access for authorized staff.',
      'Care Accountability: Time-stamped activity and completion records.',
    ],
  },
  {
    category: 'Admission Workflows',
    icon: <AccountTreeIcon fontSize="large" />,
    items: [
      'Step-by-Step Intake: Configurable multi-step admission workflows.',
      'Templates: Create, clone, and version reusable admission templates.',
      'AI Data Mapping: Auto-map form fields to clinical records.',
      'Document Extraction: Scan paper forms and extract structured data.',
      'Flexible Controls: Pause, resume, restart, skip, or reopen steps.',
      'Cross-Step Prefill: Reduce duplicate data entry across workflow steps.',
      'Confirmation: Review AI-mapped data before applying to records.',
    ],
  },
  {
    category: 'Files, Records & Documents',
    icon: <FolderSharedIcon fontSize="large" />,
    items: [
      'Storage: Secure cloud file storage.',
      'Management: Associate docs with residents.',
      'Access: Centralized repository with permissions.',
      'Forms Builder: AI-powered and manual form creation.',
      'Secure Links: Token-based external form submission.',
      'PDF Downloads: Export submissions for reporting.',
      'Permissioned Visibility: Limit sensitive document access to approved roles.',
    ],
  },
  {
    category: 'AI Assistant & Automation',
    icon: <AutoAwesomeIcon fontSize="large" />,
    items: [
      'AI Summaries: Generate fast drafts from care communications and activity.',
      'AI Form Builder: Generate complete multi-section forms with AI.',
      'AI Form Extraction: Extract structured data from uploaded documents.',
      'AI Admission Mapping: Auto-suggest data mappings for intake workflows.',
      'Operational Insights: Surface trends and key context for staff decisions.',
      'Reduced Admin Load: Speed up repetitive documentation workflows.',
      'Action Support: Help teams prioritize follow-up tasks and communication.',
      'Human-in-the-Loop: Teams review and finalize AI-supported output.',
    ],
  },
  {
    category: 'Billing & Subscriptions',
    icon: <PaymentIcon fontSize="large" />,
    items: [
      'Stripe: Secure payment processing.',
      'Flexible Plans: Facility or individual billing.',
      'Portal: Self-service billing history and invoices.',
      'Scalable: Per-resident seat management.',
      'Subscription Controls: Admin exemptions and upgrade/downgrade.',
    ],
  },
  {
    category: 'Notifications & Escalations',
    icon: <NotificationsActiveIcon fontSize="large" />,
    items: [
      'Push: Real-time mobile and web alerts.',
      'Smart Alerts: For messages, incidents, and care events.',
      'Work Order Assignment Alerts: Send push + email notifications to assignees when work orders are assigned or reassigned.',
      'Email: Summaries and urgent notifications.',
      'Preferences: Granular user control per notification type.',
      'Device Management: Register and manage push devices.',
      'Role-Aware Delivery: Notify the right teams based on responsibility.',
    ],
  },
  {
    category: 'Admin, Audit & System',
    icon: <AdminPanelSettingsIcon fontSize="large" />,
    items: [
      'Audit Logs: Full compliance tracking with timestamped records.',
      'Admin Dashboard: High-level system oversight and CMS.',
      'Data Control: Master data management and export.',
      'Global Search: Find users, facilities, posts, and documents.',
      'Multi-Platform: Web, iOS, and Android access.',
      'User Onboarding: Guided setup wizards for new users.',
      'Operational Oversight: Cross-functional visibility into platform usage.',
    ],
  },
];

const FeaturesPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Box
      sx={{
        py: 6,
        px: 4,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Container maxWidth="xl">
        <Fade in={loaded} timeout={800}>
          <Box>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}
              >
                Complete Platform Capabilities
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: '#4a5568', maxWidth: 700, mx: 'auto', fontWeight: 400 }}
              >
                A comprehensive ecosystem designed to streamline operations, enhance care,
                and connect families — covering every aspect of senior care management.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: 3,
                justifyContent: 'center',
              }}
            >
              {featureData.map((feature, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #e2e8f0',
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
                  }}
                >
                  <Box sx={{ height: 4, bgcolor: 'primary.main', width: '100%', flexShrink: 0 }} />
                  <CardContent sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(17,101,48,0.07)',
                          color: '#116530',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#1a1a2e' }}>
                        {feature.category}
                      </Typography>
                    </Box>
                    <List disablePadding>
                      {feature.items.map((item, idx) => (
                        <ListItem key={idx} disableGutters alignItems="flex-start" sx={{ pb: 0.75, pt: 0.25 }}>
                          <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: '#116530', opacity: 0.7 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: '#4a5568',
                              sx: { lineHeight: 1.5 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default FeaturesPage;