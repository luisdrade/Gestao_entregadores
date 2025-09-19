import React from 'react';
import { Box } from '@mui/material';
import DeliveryNavbar from './DeliveryNavbar';

const DeliveryLayout = ({ children }) => {
  return (
    <Box>
      <DeliveryNavbar />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
};

export default DeliveryLayout;
