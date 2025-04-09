import { Stack } from "expo-router";

export default function MacrosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Weekly Overview",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="monthly"
        options={{
          title: "Monthly Overview",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[date]"
        options={{
          title: "Daily Details",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
