import { useState, useEffect } from 'react';
import { Box, Button, TextField, Alert, Container, Typography, Fade } from '@mui/material';
import emailjs from '@emailjs/browser';

const ContactPage = () =>
{
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() =>
    {
        const timeout = setTimeout(() => setLoaded(true), 200);
        return () => clearTimeout(timeout);
    }, []);

    const handleChange = (e) =>
    {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSubmitted(false);

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey)
        {
            setError('Email configuration is missing. Please contact support.');
            setLoading(false);
            console.error("EmailJS environment variables for contact form are not set.");
            return;
        }

        try
        {
            await emailjs.send(
                serviceId,
                templateId,
                formData,
                publicKey
            );
            setSubmitted(true);
            setFormData({ user_name: '', user_email: '', message: '' });
        } catch (err)
        {
            console.error('EmailJS Contact Error:', err);
            setError('Something went wrong sending your message. Please try again later.');
        } finally
        {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, color: '#fff' }}>
            <Container maxWidth="sm">
                <Fade in={loaded} timeout={1000}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                            Contact Us
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                            Have questions or feedback? Reach out to us!
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <TextField
                                label="Your Name"
                                variant="outlined"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                required
                                fullWidth
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 1 }}
                                InputLabelProps={{ style: { color: '#555' } }}
                            />
                            <TextField
                                label="Your Email"
                                variant="outlined"
                                type="email"
                                name="user_email"
                                value={formData.user_email}
                                onChange={handleChange}
                                required
                                fullWidth
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 1 }}
                                InputLabelProps={{ style: { color: '#555' } }}
                            />
                            <TextField
                                label="Message"
                                variant="outlined"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                fullWidth
                                multiline
                                rows={4}
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 1 }}
                                InputLabelProps={{ style: { color: '#555' } }}
                            />
                            <Button type="submit" variant="contained" size="large" color="secondary" disabled={loading} sx={{ mt: 1 }}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                            {submitted && <Alert severity="success" sx={{ mt: 2, color: '#000' }}>Message sent successfully! We'll get back to you soon.</Alert>}
                            {error && <Alert severity="error" sx={{ mt: 2, color: '#000' }}>{error}</Alert>}
                        </Box>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default ContactPage;