import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { openRundeFontFamilies, openRundeFontSources, palette } from './src/theme';

void SplashScreen.preventAutoHideAsync();

const navigationTheme: Theme = {
  dark: true,
  colors: {
    primary: palette.accent,
    background: palette.background,
    card: palette.surface,
    text: palette.text,
    border: palette.border,
    notification: palette.highlight,
  },
  fonts: {
    regular: {
      fontFamily: openRundeFontFamilies.regular,
      fontWeight: '400',
    },
    medium: {
      fontFamily: openRundeFontFamilies.medium,
      fontWeight: '500',
    },
    bold: {
      fontFamily: openRundeFontFamilies.bold,
      fontWeight: '700',
    },
    heavy: {
      fontFamily: openRundeFontFamilies.bold,
      fontWeight: '800',
    },
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts(openRundeFontSources);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
