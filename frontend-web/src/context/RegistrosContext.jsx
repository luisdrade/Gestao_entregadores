import React, { createContext, useContext, useState } from 'react';

const RegistrosContext = createContext(null);

export function RegistrosProvider({ children }) {
  const [registros, setRegistros] = useState([]);
  const [veiculos, setVeiculos] = useState([]);

  const value = {
    registros,
    setRegistros,
    veiculos,
    setVeiculos
  };

  return (
    <RegistrosContext.Provider value={value}>
      {children}
    </RegistrosContext.Provider>
  );
}

export function useRegistros() {
  const context = useContext(RegistrosContext);
  if (!context) {
    throw new Error('useRegistros must be used within a RegistrosProvider');
  }
  return context;
}

export { RegistrosContext };
