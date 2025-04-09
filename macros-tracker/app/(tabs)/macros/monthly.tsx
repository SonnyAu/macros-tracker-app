import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Calendar, DateData } from "react-native-calendars";
import { format } from "date-fns";

export default function MonthlyMacrosScreen() {
  const today = format(new Date(), "yyyy-MM-dd");

  // Mock data for calendar markings
  const markedDates = {
    [today]: { selected: true, selectedColor: "#4CAF50" },
    "2024-03-01": { marked: true, dotColor: "#4CAF50" }, // On target
    "2024-03-04": { marked: true, dotColor: "#FF5733" }, // Below target
    "2024-03-10": { marked: true, dotColor: "#2196F3" }, // Above target
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Calendar */}
      <View className="bg-white rounded-xl p-4 mb-6">
        <Calendar
          markingType="dot"
          markedDates={markedDates}
          theme={{
            todayTextColor: "#4CAF50",
            selectedDayBackgroundColor: "#4CAF50",
            selectedDayTextColor: "#ffffff",
            dotColor: "#4CAF50",
            arrowColor: "#4CAF50",
          }}
          onDayPress={(day: DateData) => {
            router.push({
              pathname: "/(tabs)/macros/[date]",
              params: { date: day.dateString },
            });
          }}
        />
      </View>

      {/* Legend */}
      <View className="bg-white rounded-xl p-4">
        <Text className="text-lg font-bold mb-4">Legend</Text>
        <View className="space-y-3">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <Text>On Target</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
            <Text>Below Target</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
            <Text>Above Target</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
