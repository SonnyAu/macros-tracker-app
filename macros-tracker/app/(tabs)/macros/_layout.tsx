import { Stack } from "expo-router";

export default function MacrosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="monthly" />
    </Stack>
  );
}
