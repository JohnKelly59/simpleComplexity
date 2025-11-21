// src/context/SdkContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { fetchTooltipsForKeys } from "../api/api";

export const SdkContext = createContext(null);

export const SdkProvider = ({ children, initial = {} }) => {
  const [apiKey, setApiKey] = useState(initial.apiKey ?? "");
  const [businessSettings, setBusinessSettings] = useState(
    initial.businessSettings ?? {}
  );
  const [tooltipsEnabled, setTooltipsEnabled] = useState(
    initial.tooltipsEnabled ?? false
  );
  // Load language from localStorage or default to 'en'
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem('simpleform_sdk_persistent_lang') ?? initial.selectedLang ?? "en"
  );
  const [speedDialPosition, setSpeedDialPosition] = useState(
    initial.speedDialPosition ?? "bottom-right"
  );
  const [isSupportChatOpen, setSupportChatOpen] = useState(
    initial.isSupportChatOpen ?? false
  );
  const [isLanguagePanelOpen, setLanguagePanelOpen] = useState(
    initial.isLanguagePanelOpen ?? false
  );
  const [isLoading, setIsLoading] = useState(initial.isLoading ?? false);

  const [tooltipData, setTooltipData] = useState({});

  const fetchAndSetAllTooltips = useCallback(
    async (keys) => {
      if (!apiKey || !keys || keys.length === 0) return;
      try {
        const data = await fetchTooltipsForKeys(apiKey, keys, selectedLang);
        setTooltipData(data);
      } catch (error) {
        console.error("Failed to fetch tooltips:", error);
      }
    },
    [apiKey, selectedLang]
  );

  const getContent = useCallback(
    (key) => {
      return tooltipData[key] || "";
    },
    [tooltipData]
  );

  const [originalTextNodes, setOriginalTextNodes] = useState(new Map());
  const [isRecording, setIsRecording] = useState(initial.isRecording ?? false);
  const [isPaused, setIsPaused] = useState(initial.isPaused ?? false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(
    initial.isCameraEnabled ?? false
  );
  const [isMicEnabled, setIsMicEnabled] = useState(
    initial.isMicEnabled ?? false
  );
  const [videoBlob, setVideoBlob] = useState(initial.videoBlob ?? null);
  const [isSubmissionModalOpen, setSubmissionModalOpen] = useState(
    initial.isSubmissionModalOpen ?? false
  );
  const [recordingTime, setRecordingTime] = useState(0); // State for timer
  const handleCloseSubmissionModal = useCallback(() => {
    setSubmissionModalOpen(false);
  }, []);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshTrigger((n) => n + 1), []);

  const value = useMemo(
    () => ({
      apiKey,
      setApiKey,
      businessSettings,
      setBusinessSettings,
      tooltipsEnabled,
      setTooltipsEnabled,
      selectedLang,
      setSelectedLang,
      speedDialPosition,
      setSpeedDialPosition,
      isSupportChatOpen,
      setSupportChatOpen,
      isLanguagePanelOpen,
      setLanguagePanelOpen,
      isLoading,
      setIsLoading,
      originalTextNodes,
      setOriginalTextNodes,
      isRecording,
      setIsRecording,
      isPaused,
      setIsPaused,
      isCameraEnabled,
      setIsCameraEnabled,
      isMicEnabled,
      setIsMicEnabled,
      videoBlob,
      setVideoBlob,
      isSubmissionModalOpen,
      setSubmissionModalOpen,
      handleCloseSubmissionModal,
      refreshTrigger,
      triggerRefresh,
      fetchAndSetAllTooltips,
      getContent,
      recordingTime, 
      setRecordingTime,
    }),
    [
      apiKey,
      businessSettings,
      tooltipsEnabled,
      selectedLang,
      speedDialPosition,
      isSupportChatOpen,
      isLanguagePanelOpen,
      isLoading,
      originalTextNodes,
      isRecording,
      isPaused,
      isCameraEnabled,
      isMicEnabled,
      videoBlob,
      isSubmissionModalOpen,
      handleCloseSubmissionModal,
      refreshTrigger,
      triggerRefresh,
      fetchAndSetAllTooltips,
      getContent,
      recordingTime,
    ]
  );

  return <SdkContext.Provider value={value}>{children}</SdkContext.Provider>;
};

export const useSdk = () => {
  const ctx = useContext(SdkContext);
  if (!ctx) throw new Error("useSdk must be used within SdkProvider");
  return ctx;
};