import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MedicationIcon from '@mui/icons-material/Medication';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SyncIcon from '@mui/icons-material/Sync';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ForumIcon from '@mui/icons-material/Forum';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import DrawIcon from '@mui/icons-material/Draw';
import LinkIcon from '@mui/icons-material/Link';
import ScannerIcon from '@mui/icons-material/Scanner';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GavelIcon from '@mui/icons-material/Gavel';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PaymentIcon from '@mui/icons-material/Payment';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import FlowIcon from '@mui/icons-material/AccountTree';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import MapIcon from '@mui/icons-material/Map';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const featureCategories = [
  {
    label: 'Care & Clinical',
    features: [
      { icon: <MedicationIcon />, title: 'eMAR & Medication Tracking', desc: 'Manage prescriptions, dosages, schedules, and administration records with complete audit trails for every med pass.' },
      { icon: <MonitorHeartIcon />, title: 'Vitals Monitoring & Trends', desc: 'Record blood pressure, heart rate, temperature, and other metrics with visual trend charts for early detection.' },
      { icon: <ReportProblemIcon />, title: 'Incident Reporting', desc: 'Log and track incidents with structured reports, follow-up actions, and AI-generated summary drafts for faster documentation.' },
      { icon: <AssignmentIcon />, title: 'Care Task Management', desc: 'Create, assign, and track care tasks with scheduling, recurrence, completion tracking, and staff accountability.' },
      { icon: <VaccinesIcon />, title: 'Diagnoses, Allergies & Immunizations', desc: 'Maintain comprehensive clinical profiles including diagnoses, allergy alerts, and immunization records per resident.' },
      { icon: <ContactEmergencyIcon />, title: 'Emergency Contacts', desc: 'Store and access emergency contact information for each resident, instantly available to authorized staff.' },
    ],
  },
  {
    label: 'Admissions',
    features: [
      { icon: <FlowIcon />, title: 'Step-by-Step Admission Workflows', desc: 'Guide new resident intake through configurable multi-step workflows — submit, skip, reopen, pause, or restart any step.' },
      { icon: <ContentPasteIcon />, title: 'Customizable Admission Templates', desc: 'Create reusable admission templates, clone them, set facility defaults, and version your intake processes.' },
      { icon: <MapIcon />, title: 'AI-Powered Data Mapping', desc: 'Automatically map form fields to clinical records — medications, diagnoses, allergies, vitals — with AI suggestions and manual overrides.' },
      { icon: <ScannerIcon />, title: 'Document Intake & Extraction', desc: 'Scan or upload paper forms and let AI extract structured data directly into your admission workflow steps.' },
      { icon: <RestartAltIcon />, title: 'Flexible Workflow Controls', desc: 'Pause, resume, restart, or quit workflows. Reopen completed steps for edits. Cross-step data prefill reduces duplicate entry.' },
      { icon: <AssignmentTurnedInIcon />, title: 'Data Confirmation & Apply', desc: 'Review AI-mapped data, confirm accuracy, then apply directly to resident records — keeping humans in full control.' },
    ],
  },
  {
    label: 'Operations',
    features: [
      { icon: <CalendarMonthIcon />, title: 'Facility Calendar & Events', desc: 'Plan and manage facility-wide activities, outings, and appointments with shared calendars and RSVP tracking.' },
      { icon: <BadgeIcon />, title: 'Staff Shift Management', desc: 'Schedule staff shifts, manage coverage, and improve handoff planning with staffing continuity tools.' },
      { icon: <HomeWorkIcon />, title: 'Visit Request & Approval', desc: 'Families request visits, staff approve or decline — with full scheduling, status tracking, and documentation.' },
      { icon: <SyncIcon />, title: 'Google Calendar Integration', desc: 'Two-way sync with Google Calendar so personal and facility schedules stay aligned automatically.' },
      { icon: <EventNoteIcon />, title: 'Unified Schedule View', desc: 'See events, tasks, and shifts in one aggregated view with date-range filtering and event statistics.' },
      { icon: <EventAvailableIcon />, title: 'Event Invitations & RSVP', desc: 'Invite individual users or entire facilities to events with built-in RSVP acceptance and tracking.' },
    ],
  },
  {
    label: 'Communication',
    features: [
      { icon: <ForumIcon />, title: 'Secure Messaging', desc: 'HIPAA-compliant 1-on-1 and group messaging with full conversation history, read receipts, and real-time delivery.' },
      { icon: <FamilyRestroomIcon />, title: 'Family Connections Portal', desc: 'Invite and manage family relationships. Families see resident care info, visit schedules, and activity updates.' },
      { icon: <DynamicFeedIcon />, title: 'Posts & Activity Feed', desc: 'Facility staff publish updates, families comment and react. A social feed keeps everyone informed without phone calls.' },
      { icon: <NotificationsActiveIcon />, title: 'Push Notifications', desc: 'Real-time alerts on mobile and web. Register devices, set preferences, and control notification delivery per user.' },
      { icon: <ConnectWithoutContactIcon />, title: 'Family Invitations', desc: 'Send, accept, or decline family connection invitations. Track relationship status and manage privacy controls.' },
      { icon: <CameraAltIcon />, title: 'Visit Documentation', desc: 'Document care visits with photos, notes, and observations for comprehensive care records shared with families.' },
    ],
  },
  {
    label: 'Forms & Documents',
    features: [
      { icon: <AutoAwesomeIcon />, title: 'AI Form Builder', desc: 'Generate complete multi-section forms with conditional logic, structured tables, and nested fields — not just starter drafts.' },
      { icon: <DrawIcon />, title: 'Manual Form Creator', desc: 'Build forms from scratch with full control over sections, field types, validation rules, and completion settings.' },
      { icon: <LinkIcon />, title: 'Secure Form Assignments', desc: 'Generate token-based secure links for external form submission — no login required for respondents.' },
      { icon: <SecurityIcon />, title: 'Role-Based & User-Level Access', desc: 'Govern every form and submission with RBAC plus direct per-user controls for operational precision.' },
      { icon: <DescriptionIcon />, title: 'Document Management', desc: 'Upload, store, and manage documents in a secure cloud repository with permissions and resident associations.' },
      { icon: <DownloadDoneIcon />, title: 'Downloadable Records & PDFs', desc: 'Export form submissions as PDFs for audits, reporting, and downstream compliance analysis.' },
    ],
  },
  {
    label: 'Admin & Compliance',
    features: [
      { icon: <AdminPanelSettingsIcon />, title: 'Role-Based Permissions', desc: 'Fine-grained read/write controls across messaging, documents, incidents, medications, and scheduling per role.' },
      { icon: <GroupWorkIcon />, title: 'Custom Role Creation', desc: 'Create facility-specific roles beyond defaults — tailor permissions to your organization\'s exact operational needs.' },
      { icon: <FactCheckIcon />, title: 'Comprehensive Audit Logging', desc: 'Track every user action with timestamped logs. Filter by user, action, and resource for full compliance visibility.' },
      { icon: <GavelIcon />, title: 'HIPAA Compliance', desc: 'Encrypted data at rest, permission-based access, protected workflows, and audit trails supporting regulatory requirements.' },
      { icon: <DashboardIcon />, title: 'Admin Dashboard & CMS', desc: 'System-wide oversight with user statistics, facility metrics, subscription management, and master data controls.' },
      { icon: <FileDownloadIcon />, title: 'Data Export & Reporting', desc: 'Export user data, generate operational reports, and download records for external compliance and analysis.' },
      { icon: <PersonAddIcon />, title: 'User Onboarding Workflows', desc: 'Guided setup wizards for new users — profile creation, facility selection, role assignment, and consent management.' },
      { icon: <PaymentIcon />, title: 'Billing & Subscription Management', desc: 'Stripe-powered billing with flexible plans, self-service portal, invoice history, and per-resident seat management.' },
    ],
  },
  {
    label: 'AI & Intelligence',
    features: [
      { icon: <SummarizeIcon />, title: 'AI Summary Generation', desc: 'Generate fast, editable summaries from care communications and activity — reduce documentation burden and improve shift handoffs.' },
      { icon: <ScannerIcon />, title: 'AI Form Extraction', desc: 'Upload paper documents and let AI extract structured form data, build complete form schemas, and pre-fill fields automatically.' },
      { icon: <TipsAndUpdatesIcon />, title: 'Operational Insights', desc: 'Surface trends and high-priority context from platform activity so teams make faster, better-informed care decisions.' },
      { icon: <PsychologyIcon />, title: 'Smart Notification Context', desc: 'Pair alerts with relevant context so staff understand why an action matters and what should happen next.' },
      { icon: <SmartToyIcon />, title: 'Human-in-the-Loop Review', desc: 'Every AI-assisted output goes through team review before becoming part of workflows or records — AI supports, never replaces.' },
      { icon: <AutoAwesomeIcon />, title: 'AI-Powered Admission Mapping', desc: 'AI suggests data mappings from admission forms to clinical records — confirm and apply with full team oversight.' },
    ],
  },
];

const FeatureItem = ({ icon, title, desc }) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      border: '1px solid #e2e8f0',
      borderRadius: 2.5,
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        borderColor: '#116530',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: 'rgba(17,101,48,0.07)',
            color: '#116530',
            display: 'flex',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.65 }}>
            {desc}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);
  const current = featureCategories[activeTab];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
          >
            Platform Capabilities
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Everything You Need to Manage Care
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#4a5568', maxWidth: 700, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            From clinical workflows and resident admissions to family engagement and compliance —
            SimpleGroup covers every aspect of senior care operations.
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 48,
              },
            }}
          >
            {featureCategories.map((cat, i) => (
              <Tab key={i} label={cat.label} />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {current.features.map((feature, i) => (
            <FeatureItem key={i} {...feature} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
