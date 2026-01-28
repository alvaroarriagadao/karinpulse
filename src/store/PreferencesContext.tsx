import React, { createContext, useState, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

type PreferencesContextType = {
  toggleTheme: () => void;
  isThemeDark: boolean;
};

export const PreferencesContext = createContext<PreferencesContextType>({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [isThemeDark, setIsThemeDark] = useState(colorScheme === 'dark');

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
};
