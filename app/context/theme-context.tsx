import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  type PaletteMode,
  useMediaQuery,
} from '@mui/material';
import React, {
  createContext,
  type FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTheme } from '../config/theme';

interface IThemeContext {
  theme?: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext>({
  theme: undefined,
  toggleTheme: () => {},
});

export const useThemeToggle = () => useContext(ThemeContext);

export const ThemeProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const preferredMode: PaletteMode = useMediaQuery(
    '(prefers-color-scheme: dark)',
  )
    ? 'dark'
    : 'light';

  const [theme, setTheme] = useState<PaletteMode>(preferredMode);

  useEffect(() => {
    const cachedTheme = localStorage.getItem('theme') as PaletteMode;
    if (cachedTheme) {
      setTheme(cachedTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      if (prevTheme === 'dark') {
        localStorage.setItem('theme', 'light');
        return 'light';
      } else {
        localStorage.setItem('theme', 'dark');
        return 'dark';
      }
    });
  }, []);

  const dynamicTheme = getTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={dynamicTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
