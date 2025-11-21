// src/components/Tooltip/TooltipIcon.jsx
import React, { useMemo, useState, useCallback } from "react";
import { IconButton, Tooltip, Box, Typography, Divider } from "@mui/material";
import { HelpOutline, VolumeUp } from "@mui/icons-material";
import { useSdk } from "./../../context/SdkContext";
import { speak } from "../../services/ttsService";

const TooltipIcon = ({ fieldKey, getContent }) => {
  const [open, setOpen] = useState(false);
  const { selectedLang } = useSdk();

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const content = useMemo(() => getContent(fieldKey), [fieldKey, getContent]);

  const handlePlayAudio = useCallback(
    (e) => {
      e.stopPropagation(); // Prevents the tooltip from closing on click
      if (content) {
        speak(content, selectedLang);
      }
    },
    [content, selectedLang]
  );

  const tooltipTitle = useMemo(() => {
    if (!content) return "";
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ opacity: 0.85, fontWeight: "bold" }}
          >
            {fieldKey}
          </Typography>
          <Divider sx={{ my: 0.5, bgcolor: "rgba(255, 255, 255, 0.2)" }} />
          <Typography variant="body2">{content}</Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handlePlayAudio}
          aria-label="Play audio"
          sx={{ color: "white", alignSelf: "center", flexShrink: 0 }}
        >
          <VolumeUp fontSize="inherit" />
        </IconButton>
      </Box>
    );
  }, [content, fieldKey, handlePlayAudio]);

  if (!content) return null;

  return (
    <Tooltip
      open={open}
      onClose={handleClose}
      title={tooltipTitle}
      placement="bottom"
      arrow
      disableFocusListener
      disableHoverListener
      disableTouchListener
      PopperProps={{
        sx: {
          "& .MuiTooltip-tooltip": {
            backgroundColor: "rgba(18, 18, 18, 0.92)",
            color: "#fff",
            maxWidth: 360,
            p: 1.5,
            borderRadius: 2,
            boxShadow: 6,
          },
          "& .MuiTooltip-arrow": {
            color: "rgba(18, 18, 18, 0.92)",
          },
        },
      }}
    >
      <IconButton
        size="small"
        aria-label={`Help for ${fieldKey}`}
        onClick={handleToggle}
        sx={{ ml: 0.5, verticalAlign: "middle" }}
      >
        <HelpOutline fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default TooltipIcon;