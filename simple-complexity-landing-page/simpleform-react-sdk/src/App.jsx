// src/App.jsx
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { SdkProvider, useSdk } from "./context/SdkContext";
import { fetchBusinessDetails } from "./api/api";
import muiTheme from "./styles/theme";

// Import hooks and services
import useFormFieldObserver from "./hooks/useFormFieldObserver.jsx";
import useFormTracker from "./hooks/useFormTracker"; // Import the new hook
import { initTTS } from "./services/ttsService";

// Import components
import SpeedDial from "./components/SpeedDial";
import SupportChatPanel from "./components/SupportChat/SupportChatPanel";
import LanguagePanel from "./components/LanguagePanel";
import VideoSubmissionModal from "./components/VideoSubmissionModal";

const SdkApp = () => {
  const {
    apiKey,
    businessSettings,
    setBusinessSettings,
    setIsLoading,
    fetchAndSetAllTooltips,
    getContent,
    refreshTrigger,
    setTooltipsEnabled, // Get the setter for tooltips enabled state
  } = useSdk();
  const { scanAndInject } = useFormFieldObserver(getContent);
  useFormTracker(); // Use the form tracker hook

  useEffect(() => {
    initTTS();

    const loadData = async () => {
      if (apiKey) {
        setIsLoading(true);
        try {
          const details = await fetchBusinessDetails(apiKey);
          setBusinessSettings(details);

          // Set the tooltip state based on the API response
          setTooltipsEnabled(details.showTooltips);

          // Only scan for tooltips if the feature is enabled
          if (details.showTooltips) {
            const keys = scanAndInject();
            if (keys.length > 0) {
              await fetchAndSetAllTooltips(keys);
            }
          }
        } catch (error) {
          console.error("Failed to initialize SDK:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [apiKey, setBusinessSettings, setIsLoading, fetchAndSetAllTooltips, refreshTrigger, setTooltipsEnabled]);

  return (
    <>
      {/* Conditionally render the SpeedDial based on its setting */}
      {businessSettings.showSpeedDial && (
        <>
          <SpeedDial />
          <SupportChatPanel />
          <LanguagePanel />
          <VideoSubmissionModal />
        </>
      )}
    </>
  );
};

const App = ({ config }) => (
  <SdkProvider initial={config}>
    <ThemeProvider theme={muiTheme}>
      <SdkApp />
    </ThemeProvider>
  </SdkProvider>
);

export default App;