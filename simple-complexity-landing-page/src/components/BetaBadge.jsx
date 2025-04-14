import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';


const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const BetaBadgeStyled = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  padding: '5px 10px',
  borderRadius: '5px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  animation: `${pulse} 1.5s infinite`, 
}));

const BetaBadge = () => {
  return (
    <BetaBadgeStyled>
      <Typography variant="caption">BETA</Typography>
    </BetaBadgeStyled>
  );
};

export default BetaBadge;