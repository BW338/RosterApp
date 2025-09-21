import React, { createContext, useState, useMemo } from 'react';

// 1. Crear el Contexto
// Este es el objeto que los componentes usarán para acceder a los datos.
export const ThemeContext = createContext();

// 2. Crear el Proveedor (Provider)
// Este es el componente que contendrá el estado y lo proveerá a sus hijos.
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Usamos useMemo para evitar que el objeto de valor se recree en cada render,
  // optimizando el rendimiento para que los consumidores solo se re-rendericen cuando isDarkMode cambie.
  const themeValue = useMemo(() => ({ isDarkMode, setIsDarkMode }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};