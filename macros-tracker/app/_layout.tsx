import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MacroProvider } from "./context/MacroContext";
import { AuthProvider } from "./context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { useMacroContext } from "./context/MacroContext";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Export main layout for top-level of the app
export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen when the app is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <MacroProvider>
        <RootLayoutNav />
      </MacroProvider>
    </AuthProvider>
  );
}

// Component for navigation once context providers are initialized
function RootLayoutNav() {
  const { darkMode } = useMacroContext();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: darkMode ? "#1e1e1e" : "#FFFFFF",
            },
            headerTintColor: darkMode ? "#FFFFFF" : "#000000",
            headerTitleStyle: {
              color: darkMode ? "#FFFFFF" : "#000000",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
