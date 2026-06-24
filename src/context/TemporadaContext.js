import React, { createContext, useContext, useState } from 'react';

const TemporadaContext = createContext(null);

const STORAGE_KEY = 'badminton_temporada';

export function TemporadaProvider({ children }) {
  const [temporada, setTemporadaState] = useState(
    () => localStorage.getItem(STORAGE_KEY)
  );

  const setTemporada = (t) => {
    localStorage.setItem(STORAGE_KEY, t);
    setTemporadaState(t);
  };

  return (
    <TemporadaContext.Provider value={{ temporada, setTemporada }}>
      {children}
    </TemporadaContext.Provider>
  );
}

export function useTemporada() {
  return useContext(TemporadaContext);
}
