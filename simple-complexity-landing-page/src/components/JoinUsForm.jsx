import { useState } from 'react';
import { Box, Button, TextField, Alert } from '@mui/material';
import emailjs from '@emailjs/browser';

const JoinUsForm = () =>
{
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        try
        {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,      // Replace with your EmailJS Service ID
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,     // Replace with your EmailJS Template ID
                { user_email: email },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY     // Replace with your EmailJS Public Key
            );
            setSubmitted(true);
            setEmail('');
        } catch (err)
        {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexDirection: 'column' }}
        >
            <TextField
                variant="outlined"
                label="Enter your email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <Button type="submit" variant="contained" size="large" color="secondary">
                Join the Waitlist
            </Button>
            {submitted && <Alert severity="success">You're on the list!</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
};

export default JoinUsForm;
