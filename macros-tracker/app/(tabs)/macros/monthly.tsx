import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Calendar, DateData } from "react-native-calendars";
import { format } from "date-fns";
import { useMacroContext } from "../../context/MacroContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function MonthlyMacrosScreen() {
  const { darkMode } = useMacroContext();
  const today = format(new Date(), "yyyy-MM-dd");

  // Mock data for calendar markings
  const markedDates = {
    [today]: { selected: true, selectedColor: "#4CAF50" },
    "2024-03-01": { marked: true, dotColor: "#4CAF50" }, // On target
    "2024-03-04": { marked: true, dotColor: "#FF5733" }, // Below target
    "2024-03-10": { marked: true, dotColor: "#2196F3" }, // Above target
  };

  return (
    <View className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <ScrollView className="flex-1">
        {/* Header with back button */}
        <View className="px-6 pt-12 pb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons
              name="arrow-back"
              size={24}
              color={darkMode ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>
          <Text
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Monthly View
          </Text>
        </View>

        {/* Calendar */}
        <View
          className={`mx-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-4 mb-6 shadow-sm`}
        >
          <Calendar
            markingType="dot"
            markedDates={markedDates}
            theme={{
              calendarBackground: darkMode ? "#1F2937" : "#FFFFFF",
              textSectionTitleColor: darkMode ? "#FFFFFF" : "#4CAF50",
              textSectionTitleDisabledColor: darkMode ? "#666666" : "#d9e1e8",
              selectedDayBackgroundColor: "#4CAF50",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#4CAF50",
              dayTextColor: darkMode ? "#FFFFFF" : "#2d4150",
              textDisabledColor: darkMode ? "#666666" : "#d9e1e8",
              dotColor: "#4CAF50",
              selectedDotColor: "#ffffff",
              arrowColor: "#4CAF50",
              disabledArrowColor: darkMode ? "#666666" : "#d9e1e8",
              monthTextColor: darkMode ? "#FFFFFF" : "#2d4150",
              indicatorColor: "#4CAF50",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            onDayPress={(day: DateData) => {
              // Go back to the weekly view first
              router.back();
              // After a small delay, navigate to the day detail view
              setTimeout(() => {
                router.push({
                  pathname: "/(tabs)/macros/day/[date]",
                  params: { date: day.dateString },
                });
              }, 100);
            }}
          />
        </View>

        {/* Legend */}
        <View
          className={`mx-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-5 mb-6 shadow-sm`}
        >
          <Text
            className={`text-lg font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Legend
          </Text>
          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full bg-green-500 mr-3" />
              <Text className={darkMode ? "text-white" : "text-gray-800"}>
                On Target (80-100% of goals)
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full bg-red-500 mr-3" />
              <Text className={darkMode ? "text-white" : "text-gray-800"}>
                Below Target (Less than 80% of goals)
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full bg-blue-500 mr-3" />
              <Text className={darkMode ? "text-white" : "text-gray-800"}>
                Above Target (More than 100% of goals)
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View
          className={`mx-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-5 mb-6 shadow-sm`}
        >
          <Text
            className={`text-lg font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Monthly Summary
          </Text>

          <View className="flex-row justify-between mb-3">
            <Text className={darkMode ? "text-gray-400" : "text-gray-600"}>
              On Target Days
            </Text>
            <Text
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              12 days
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Below Target Days
            </Text>
            <Text
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              8 days
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Above Target Days
            </Text>
            <Text
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              5 days
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Not Recorded
            </Text>
            <Text
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              6 days
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
