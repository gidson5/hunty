import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Stack, type ErrorBoundaryProps, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { hideSplashScreen } from '@utils/splashScreenManager';

SplashScreen.preventAutoHideAsync();
import { ThemeProvider, useTheme } from '@providers/ThemeProvider';
import { ThemedCustomText, ThemedButton } from '@components/themed';
import { StackHeader } from '@components/navigation/StackHeader';
import { Sentry } from '@config/sentry';
import { useFonts } from '../hooks/useFonts';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.Native.captureException(error);
  }, [error]);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
          <View style={styles.errorContainer}>
            <ThemedCustomText variant="h2" style={styles.errorTitle}>
              Something went wrong
            </ThemedCustomText>
            <ThemedCustomText variant="body" style={styles.errorMessage}>
              {error.message || 'Unexpected navigation error.'}
            </ThemedCustomText>
            <ThemedButton text="Try again" onPress={retry} variant="primary" size="md" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function RootLayoutInner() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loaded, error] = useFonts();

  useEffect(() => {
    if (loaded || error) {
      hideSplashScreen();
    }
  }, [loaded, error]);

  useEffect(() => {
    const backAction = () => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'right', 'bottom', 'left']}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            header: (props) => <StackHeader {...props} />,
            headerTintColor: '#ffffff',
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings/theme" options={{ title: 'Theme' }} />
          <Stack.Screen name="details" options={{ title: 'Details' }} />
          <Stack.Screen name="nested" options={{ title: 'Nested' }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
  },
});
