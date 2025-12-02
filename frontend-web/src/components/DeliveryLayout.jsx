import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';

const DeliveryLayout = ({ children }) => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#e5e5e5', 
      width: '100%', 
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          width: '100%',
          flex: 1,
          pb: { xs: 2, sm: 4 },
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DeliveryLayout;
