// src/components/SpeedDial.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Tooltip, Typography, SpeedDial as MuiSpeedDial, SpeedDialAction, CircularProgress } from '@mui/material';
import { useSdk } from '../context/SdkContext';
import * as recordingService from '../services/recordingService';
import { translatePageElements } from '../services/ttsService';
import SdkIcon from '../assets/icon128.png';
import CreateTicketModal from './CreateTicketModal';

// Import MUI icons
import {
    Visibility, VisibilityOff, SupportAgent, Language, Refresh,
    Translate, Mic, MicOff, Videocam, VideocamOff, Stop, PlayArrow,
    OpenWith as MoveIcon, ArrowBack, NorthWest, NorthEast, SouthWest, SouthEast, ConfirmationNumber, Edit as EditIcon
} from '@mui/icons-material';

const SpeedDial = () => {
  const {
    apiKey,
    businessSettings,
    tooltipsEnabled, setTooltipsEnabled,
    setSupportChatOpen, setLanguagePanelOpen,
    speedDialPosition, setSpeedDialPosition,
    isLoading, setIsLoading,
    isRecording, setIsRecording,
    isCameraEnabled, setIsCameraEnabled,
    isMicEnabled, setIsMicEnabled,
    setVideoBlob, setSubmissionModalOpen,
    triggerRefresh,
    selectedLang,
    originalTextNodes, setOriginalTextNodes,
    recordingTime, setRecordingTime
  } = useSdk();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMoveMenuOpen, setMoveMenuOpen] = useState(false);
  const [isTicketMenuOpen, setTicketMenuOpen] = useState(false);
  const [isPreRecording, setIsPreRecording] = useState(false);
  const [isCreateTicketModalOpen, setCreateTicketModalOpen] = useState(false);
  const timerIntervalRef = useRef(null);

  // --- Timer Logic ---
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording, setRecordingTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // --- Toggle Handlers ---
  const handleToggleCamera = async () => {
    const success = await recordingService.toggleCamera(!isCameraEnabled);
    if (success) setIsCameraEnabled(!isCameraEnabled);
  };
  
  const handleToggleMic = async () => {
    const success = await recordingService.toggleMic(!isMicEnabled);
    if (success) setIsMicEnabled(!isMicEnabled);
  };

  if (!businessSettings) return null;

  const handleToggleTooltips = () => setTooltipsEnabled(!tooltipsEnabled);
  const handleOpenSupportChat = () => setSupportChatOpen(true);
  const handleOpenLanguage = () => setLanguagePanelOpen(true);
  const handlePositionChange = (position) => {
    setSpeedDialPosition(position);
    setMoveMenuOpen(false);
  };
  const handleRefreshTooltips = () => triggerRefresh();
  const handleOpenCreateTicketModal = () => {
      setCreateTicketModalOpen(true);
      setTicketMenuOpen(false);
  }

  const handleTranslatePage = async () => {
    setIsLoading(true);
    try {
      await translatePageElements(apiKey, selectedLang, originalTextNodes, setOriginalTextNodes);
    } catch (error) {
      console.error("Page translation failed:", error);
      alert("Sorry, the page could not be translated.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = async () => {
    setIsLoading(true);
    const success = await recordingService.startRecording({
      isCameraEnabled,
      isMicEnabled,
      onStop: (blob) => {
        setVideoBlob(blob);
        setSubmissionModalOpen(true);
        setIsRecording(false);
        setIsPreRecording(false);
      },
    });
    setIsLoading(false);
    if (success) {
      setIsRecording(true);
      setIsOpen(false);
    } else {
      setIsPreRecording(false);
    }
  };

  const handleStopRecording = () => {
    recordingService.stopRecording();
  };
  
  const handleEnterPreRecording = () => {
    setIsPreRecording(true);
    setTicketMenuOpen(false);
  };

  const handleExitPreRecording = () => {
    setIsPreRecording(false);
    setTicketMenuOpen(true);
  };

  const mainActions = [
    tooltipsEnabled && { icon: <Refresh />, name: 'Refresh Tooltips', action: handleRefreshTooltips },
    businessSettings.showPageTranslation && { icon: <Translate />, name: 'Translate Page', action: handleTranslatePage },
    businessSettings.showLanguageSelector && { icon: <Language />, name: 'Select Language', action: handleOpenLanguage },
    businessSettings.showSupportChat && { icon: <SupportAgent />, name: 'Support Chat', action: handleOpenSupportChat },
    businessSettings.showTooltips && { icon: tooltipsEnabled ? <Visibility /> : <VisibilityOff />, name: tooltipsEnabled ? 'Disable Tooltips' : 'Enable Tooltips', action: handleToggleTooltips },
    businessSettings.showTicketCreation && { icon: <ConfirmationNumber />, name: 'Get Support', action: () => setTicketMenuOpen(true) },
    { icon: <MoveIcon />, name: 'Move Widget', action: () => setMoveMenuOpen(true) },
  ].filter(Boolean);

  const ticketActions = [
      { icon: <EditIcon />, name: 'Written Ticket', action: handleOpenCreateTicketModal },
      businessSettings.showVideoRecording && { icon: <Videocam />, name: 'Record Video for Ticket', action: handleEnterPreRecording },
      { icon: <ArrowBack />, name: 'Back', action: () => setTicketMenuOpen(false) },
  ].filter(Boolean);

  const moveActions = [
      { icon: <NorthWest />, name: 'Top-Left', action: () => handlePositionChange('top-left') },
      { icon: <NorthEast />, name: 'Top-Right', action: () => handlePositionChange('top-right') },
      { icon: <SouthWest />, name: 'Bottom-Left', action: () => handlePositionChange('bottom-left') },
      { icon: <SouthEast />, name: 'Bottom-Right', action: () => handlePositionChange('bottom-right') },
      { icon: <ArrowBack />, name: 'Back', action: () => setMoveMenuOpen(false) },
  ];

  const preRecordingActions = [
    { icon: <PlayArrow />, name: 'Start Recording', action: handleStartRecording },
    { icon: isMicEnabled ? <Mic /> : <MicOff />, name: 'Toggle Mic', action: () => setIsMicEnabled(!isMicEnabled) },
    { icon: isCameraEnabled ? <Videocam /> : <VideocamOff />, name: 'Toggle Camera', action: () => setIsCameraEnabled(!isCameraEnabled) },
    { icon: <ArrowBack />, name: 'Back', action: handleExitPreRecording },
  ];

  const recordingActions = [
      { icon: <Stop />, name: 'Finish Recording', action: handleStopRecording },
      { icon: isMicEnabled ? <Mic /> : <MicOff />, name: 'Toggle Mic', action: handleToggleMic },
      { icon: isCameraEnabled ? <Videocam /> : <VideocamOff />, name: 'Toggle Camera', action: handleToggleCamera },
  ];

  const fabPosition = {
      position: 'fixed',
      bottom: speedDialPosition.includes('bottom') ? 25 : 'auto',
      top: speedDialPosition.includes('top') ? 25 : 'auto',
      right: speedDialPosition.includes('right') ? 25 : 'auto',
      left: speedDialPosition.includes('left') ? 25 : 'auto',
  };
  
  const speedDialDirection = speedDialPosition.includes('top') ? 'down' : 'up';

  const getCurrentActions = () => {
    if (isMoveMenuOpen) return moveActions;
    if (isTicketMenuOpen) return ticketActions;
    if (isRecording) return recordingActions;
    if (isPreRecording) return preRecordingActions;
    return mainActions;
  };

  return (
    <>
      <Box sx={{...fabPosition, display: 'flex', alignItems: 'center', gap: 2 }}>
        {isRecording && (
          <Box sx={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#f44336' }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {formatTime(recordingTime)}
            </Typography>
          </Box>
        )}
        <MuiSpeedDial
          isTouch={true}
          ariaLabel="SimpleForm SDK Options"
          icon={
              isLoading ? <CircularProgress size={24} color="inherit" /> : 
              <img src={businessSettings.logo_url || SdkIcon} alt="SDK Icon" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          }
          onClose={(event, reason) => {
              if (reason === 'blur') return;
              setIsOpen(false);
          }}
          onOpen={() => setIsOpen(true)}
          open={isOpen}
          direction={speedDialDirection}
          sx={{
            '& .MuiFab-primary': {
              backgroundColor: isRecording ? '#f44336' : '#0A1929',
              '&:hover': {
                backgroundColor: isRecording ? '#d32f2f' : '#003366'
              }
            }
          }}
        >
          {getCurrentActions().map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          ))}
        </MuiSpeedDial>
      </Box>
      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setCreateTicketModalOpen(false)}
      />
    </>
  );
};

export default SpeedDial;