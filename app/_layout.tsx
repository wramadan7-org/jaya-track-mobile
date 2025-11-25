import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import ErrorBoundary from "@/components/error-boundary";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Sentry from "@sentry/react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

Sentry.init({
  dsn: "https://6024dc8b3320a1c766572bfc7664c7da@o4510420810072064.ingest.us.sentry.io/4510420812955648",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,
  debug: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <ErrorBoundary>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  title: "",
                  statusBarHidden: true,
                  headerTintColor: colorScheme === "dark" ? "white" : "black",
                }}
              />
              <Stack.Screen
                name="form-product-modal"
                options={{
                  presentation: "modal",
                  title: "",
                  statusBarHidden: true,
                }}
              />
              <Stack.Screen
                name="form-sale-modal"
                options={{
                  presentation: "modal",
                  title: "",
                  statusBarHidden: true,
                }}
              />
              <Stack.Screen
                name="detail-sale-modal"
                options={{
                  presentation: "modal",
                  title: "",
                  statusBarHidden: true,
                }}
              />
            </Stack>
          </ErrorBoundary>
          <StatusBar style="auto" />
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
});
