// src/components/LanguagePanel.jsx
import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSdk } from '../context/SdkContext';
import { fetchLanguages } from '../api/api';

const LanguagePanel = () => {
  const { apiKey, isLanguagePanelOpen, setLanguagePanelOpen, selectedLang, setSelectedLang } = useSdk();
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLanguagePanelOpen) {
      setIsLoading(true);
      fetchLanguages(apiKey, selectedLang)
        .then(data => setLanguages(data))
        .catch(err => console.error("Failed to fetch languages", err))
        .finally(() => setIsLoading(false));
    }
  }, [isLanguagePanelOpen, apiKey, selectedLang]);

  const handleSelectLanguage = (langCode) => {
    setSelectedLang(langCode);
    localStorage.setItem('simpleform_sdk_persistent_lang', langCode);
    setLanguagePanelOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      open={isLanguagePanelOpen}
      onClose={() => setLanguagePanelOpen(false)}
      PaperProps={{
        sx: { width: 330, maxHeight: 480, height: '100%', bottom: 95, top: 'auto', right: 25, borderRadius: '16px', boxShadow: 3 }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontSize: '17px', fontWeight: 600 }}>Select Language</Typography>
          <IconButton onClick={() => setLanguagePanelOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Language List */}
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            languages.map(lang => (
              <ListItem key={lang.code} disablePadding>
                <ListItemButton 
                    selected={selectedLang === lang.code} 
                    onClick={() => handleSelectLanguage(lang.code)}
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        },
                    }}
                >
                  <ListItemText primary={lang.name} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default LanguagePanel;