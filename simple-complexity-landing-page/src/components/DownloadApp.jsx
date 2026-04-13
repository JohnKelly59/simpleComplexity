import { Box, Container, Typography, Button, Stack, Card } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';

const platforms = [
  {
    icon: <LanguageIcon sx={{ fontSize: 32 }} />,
    title: 'Web Platform',
    desc: 'Access from any browser — no installation required.',
    href: 'https://simplegroup.simple-complexity.com',
    label: 'Open Web App',
    external: true,
  },
  {
    icon: <AppleIcon sx={{ fontSize: 32 }} />,
    title: 'iOS',
    desc: 'Available on the App Store for iPhone and iPad.',
    href: 'https://apps.apple.com/us/app/simplegroup/id6755089694',
    label: 'App Store',
    external: true,
  },
  {
    icon: <AndroidIcon sx={{ fontSize: 32 }} />,
    title: 'Android',
    desc: 'Available on Google Play for Android devices.',
    href: 'https://play.google.com/store',
    label: 'Google Play',
    external: true,
  },
];

const DownloadApp = () => (
  <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
      <Typography
        variant="overline"
        sx={{ color: '#116530', fontWeight: 700, letterSpacing: 2, mb: 1, display: 'block' }}
      >
        Platform Access
      </Typography>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 800, color: '#1a1a2e', mb: 2 }}
      >
        Available Where Your Teams Work
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: '#4a5568', mb: 5, maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}
      >
        SimpleGroup runs on web, iOS, and Android — so staff, families, and administrators
        can stay connected from any device.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        justifyContent="center"
      >
        {platforms.map((p) => (
          <Card
            key={p.title}
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              textAlign: 'center',
              transition: 'border-color 0.2s ease',
              '&:hover': { borderColor: '#116530' },
            }}
          >
            <Box sx={{ color: '#116530', mb: 1.5 }}>{p.icon}</Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
              {p.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, minHeight: 40 }}>
              {p.desc}
            </Typography>
            <Button
              component="a"
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="primary"
              size="small"
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {p.label}
            </Button>
          </Card>
        ))}
      </Stack>
    </Container>
  </Box>
);

export default DownloadApp;
