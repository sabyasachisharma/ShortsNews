import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppearanceType = 'light' | 'dark' | 'system';

export function useAppearance() {
  const systemColorScheme = useColorScheme();
  const [appearance, setAppearance] = useState<AppearanceType>('system');
  
  useEffect(() => {
    loadSavedAppearance();
  }, []);

  const loadSavedAppearance = async () => {
    try {
      const saved = await AsyncStorage.getItem('appearance');
      if (saved) setAppearance(saved as AppearanceType);
    } catch (error) {
      console.error('Error loading appearance:', error);
    }
  };

  const setAppearanceType = async (type: AppearanceType) => {
    try {
      await AsyncStorage.setItem('appearance', type);
      setAppearance(type.toLowerCase() as AppearanceType);
    } catch (error) {
      console.error('Error saving appearance:', error);
    }
  };

  const currentColorScheme = appearance === 'system' 
    ? systemColorScheme 
    : appearance === 'dark' ? 'dark' : 'light';

  return {
    appearance,
    setAppearanceType,
    currentColorScheme
  };
} 