import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import Hero from './components/Hero';
import Features from './components/Features';
import Demo from './components/Demo';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

function App ()
{
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Hero />
      <Demo />
      <Features />
      <Pricing />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
