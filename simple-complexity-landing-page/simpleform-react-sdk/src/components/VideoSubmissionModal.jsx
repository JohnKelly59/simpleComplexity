// src/components/VideoSubmissionModal.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useSdk } from '../context/SdkContext';
import { sendVideoRecording } from '../api/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const VideoSubmissionModal = () => {
  const { apiKey, isSubmissionModalOpen, handleCloseSubmissionModal, videoBlob } = useSdk();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !description) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setIsSending(true);
    
    try {
      const filename = `recording-${Date.now()}.webm`;
      await sendVideoRecording(apiKey, videoBlob, filename, name, email, description);
      alert('Your recording has been sent successfully!');
      handleCloseSubmissionModal();
    } catch (err) {
      console.error("Failed to send video:", err);
      setError('Failed to send recording. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal open={isSubmissionModalOpen} onClose={handleCloseSubmissionModal}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2">Submit Your Recording</Typography>
        <Typography sx={{ mt: 2, mb: 2 }}>Provide your details and a description of the issue.</Typography>
        <TextField fullWidth required label="Full Name" value={name} onChange={e => setName(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth required type="email" label="Email Address" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth required multiline rows={3} label="Description" value={description} onChange={e => setDescription(e.target.value)} sx={{ mb: 2 }} />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleCloseSubmissionModal} disabled={isSending}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSending}>
            {isSending ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VideoSubmissionModal;