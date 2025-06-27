import { Box, keyframes } from "@mui/material";

// Define a more generic pulsing animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 10px 15px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const BetaBadge = () => {
  return (
    <Box
      sx={{
        backgroundColor: "secondary.main",
        color: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
        animation: `${pulse} 2.5s infinite`,
      }}
    >
      BETA
    </Box>
  );
};

export default BetaBadge;
