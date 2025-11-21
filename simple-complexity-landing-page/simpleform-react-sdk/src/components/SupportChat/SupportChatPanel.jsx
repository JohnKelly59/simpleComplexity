// src/components/SupportChat/SupportChatPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Drawer, Typography, TextField, IconButton, List, ListItem, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useSdk } from '../../context/SdkContext';
import { sendSupportQuery } from '../../api/api';

const SupportChatPanel = () => {
  const { apiKey, isSupportChatOpen, setSupportChatOpen, selectedLang } = useSdk();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref to auto-scroll

  // Function to scroll to the bottom of the messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom every time a new message is added
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    // Optimistically add a "Thinking..." message
    const thinkingMsg = { sender: 'bot', text: 'Thinking...' };
    setMessages(prev => [...prev, thinkingMsg]);

    try {
      const pageContext = document.body.innerText;
      const data = await sendSupportQuery(apiKey, input, pageContext, selectedLang);
      const answer = data.answer;
      const botMsg = { sender: 'bot', text: answer || "Sorry, I couldn't find an answer." };
      
      // Replace the "Thinking..." message with the actual response
      setMessages(prev => [...prev.filter(m => m !== thinkingMsg), botMsg]);

    } catch (error) {
      console.error("Support query failed:", error);
      const errorMsg = { sender: 'error', text: 'Sorry, an error occurred. Please try again.' };
      setMessages(prev => [...prev.filter(m => m !== thinkingMsg), errorMsg]);
    } finally {
      setIsLoading(false); // Re-enable input and button
    }
  };

  // Define styles for different message types
  const getMessageStyles = (sender) => {
    const baseStyles = {
      p: 1.5,
      borderRadius: '12px',
      maxWidth: '85%',
      lineHeight: 1.5,
      wordBreak: 'break-word',
    };

    switch (sender) {
      case 'user':
        return { ...baseStyles, bgcolor: 'primary.main', color: 'primary.contrastText', borderBottomRightRadius: '4px' };
      case 'bot':
        return { ...baseStyles, bgcolor: '#f0f0f0', color: 'text.primary', borderBottomLeftRadius: '4px' };
      case 'error':
        return { ...baseStyles, bgcolor: '#fdecea', color: '#611a15', borderBottomLeftRadius: '4px' };
      default:
        return baseStyles;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isSupportChatOpen}
      onClose={() => setSupportChatOpen(false)}
      // Prevent the main page from being darkened
      ModalProps={{ sx: { '& .MuiModal-backdrop': { backgroundColor: 'transparent' } } }}
      // Styling for the panel itself
      PaperProps={{ sx: { width: 330, maxHeight: 480, height: '100%', bottom: 95, top: 'auto', right: 25, borderRadius: '16px', boxShadow: 3 } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
          <Typography variant="h6" sx={{ fontSize: '17px', fontWeight: 600 }}>Support Assistant</Typography>
          <IconButton onClick={() => setSupportChatOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <List sx={{ flex: 1, overflowY: 'auto', p: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              p: 0,
            }}>
              <Box sx={getMessageStyles(msg.sender)}>
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>

        {/* Input Form */}
        <Box
          component="form"
          sx={{ p: '16px 20px', display: 'flex', gap: '10px', alignItems: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask a question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <IconButton type="submit" color="primary" disabled={isLoading} sx={{ p: '10px' }}>
            {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SupportChatPanel;