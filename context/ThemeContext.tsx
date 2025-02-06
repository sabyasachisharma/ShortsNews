import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  colorScheme: ColorSchemeName;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('dark');

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    console.log('ThemeContext: Setting theme to:', newTheme);
    setColorScheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          console.log('ThemeContext: Loading saved theme:', savedTheme);
          setColorScheme(savedTheme as ColorSchemeName);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  console.log('ThemeContext: Current colorScheme:', colorScheme);

  return (
    <ThemeContext.Provider value={{ 
      colorScheme, 
      setTheme: handleThemeChange 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 