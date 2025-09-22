import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';

const DeliveryLayout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
};

export default DeliveryLayout;
