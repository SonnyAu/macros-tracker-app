import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { format, parseISO } from "date-fns";
import { useMacroContext } from "../../context/MacroContext";

export default function MacrosLayout() {
  // Get the date parameter if it exists
  const { date } = useLocalSearchParams();
  const { darkMode } = useMacroContext();

  // Format the date for the header if it exists
  const formattedDate = date
    ? format(parseISO(date as string), "MMMM d, yyyy")
    : "";

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: darkMode ? "#1e1e1e" : "#FFFFFF",
        },
        headerTintColor: darkMode ? "#FFFFFF" : "#000000",
        headerTitleStyle: {
          color: darkMode ? "#FFFFFF" : "#000000",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Weekly Overview",
        }}
      />
      <Stack.Screen
        name="monthly"
        options={{
          title: "Monthly Overview",
          headerShown: false, // Hide the header since monthly has its own
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="day/[date]"
        options={{
          title: formattedDate || "Daily Details",
        }}
      />
    </Stack>
  );
}
