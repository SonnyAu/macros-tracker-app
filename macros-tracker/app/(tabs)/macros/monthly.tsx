import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

export default function MonthlyMacrosScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold text-center mb-4">
        📅 Monthly Macros
      </Text>

      <Calendar
        markingType={"dot"}
        markedDates={{
          "2025-03-01": { marked: true, dotColor: "#4CAF50" },
          "2025-03-04": { marked: true, dotColor: "#FF5733" },
          "2025-03-10": { marked: true, dotColor: "#2196F3" },
        }}
        theme={{
          todayTextColor: "#FF5733",
          arrowColor: "#4CAF50",
        }}
      />

      {/* Button to Go Back */}
      <TouchableOpacity
        className="bg-green-500 rounded-xl p-4 mt-5 items-center"
        onPress={() => router.push("/macros")}
      >
        <Text className="text-white text-lg font-semibold">
          🔙 Back to Weekly View
        </Text>
      </TouchableOpacity>
    </View>
  );
}
