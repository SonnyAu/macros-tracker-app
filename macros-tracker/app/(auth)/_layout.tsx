import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMacroContext } from "../context/MacroContext";

export default function AuthLayout() {
  const { darkMode } = useMacroContext();

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
