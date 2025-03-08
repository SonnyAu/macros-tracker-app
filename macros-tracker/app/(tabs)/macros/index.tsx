import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ProgressBar } from "react-native-paper";
import { Svg, Circle } from "react-native-svg";

export default function MacrosScreen() {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  // Get start of the current week (Sunday)
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });

  // Generate the 7 days of the current week
  const currentWeekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      formatted: format(date, "EEE"), // Day abbreviation (Mon, Tue, etc.)
      dayNumber: format(date, "d"), // Day number (1, 2, 3, etc.)
      fullDate: format(date, "yyyy-MM-dd"), // Full date (YYYY-MM-DD)
    };
  });

  // Mock macro data for the selected day
  const macros = {
    protein: 120, // in grams
    carbs: 250,
    fats: 70,
    sugar: 30,
  };

  // Daily Macro Goals
  const goals = {
    protein: 150,
    carbs: 300,
    fats: 100,
    sugar: 50,
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 20, paddingBottom: 80 }} // Ensures scrollability
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-2xl font-bold text-center mb-4">
        📊 Weekly Macros
      </Text>

      {/* Weekly View (Rounded Buttons) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5"
      >
        {currentWeekDays.map(({ formatted, dayNumber, fullDate }) => (
          <TouchableOpacity
            key={fullDate}
            className={`mx-2 p-4 rounded-full w-16 h-16 items-center justify-center ${
              selectedDate === fullDate ? "bg-blue-500 shadow-lg" : "bg-white"
            }`}
            onPress={() => setSelectedDate(fullDate)}
          >
            <Text
              className={`text-md font-bold ${
                selectedDate === fullDate ? "text-white" : "text-gray-700"
              }`}
            >
              {formatted}
            </Text>
            <Text
              className={`text-lg font-semibold ${
                selectedDate === fullDate ? "text-white" : "text-gray-700"
              }`}
            >
              {dayNumber}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Centered Macros Wheel */}
      <View className="items-center my-5">
        <Svg height="200" width="200" viewBox="0 0 100 100">
          {/* Background Circle */}
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#E5E5E5"
            strokeWidth="10"
            fill="none"
          />

          {/* Protein Progress */}
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#FF3B30"
            strokeWidth="10"
            fill="none"
            strokeDasharray="251.2"
            strokeDashoffset={(1 - macros.protein / goals.protein) * 251.2}
          />

          {/* Carbs Progress */}
          <Circle
            cx="50"
            cy="50"
            r="35"
            stroke="#FF9500"
            strokeWidth="10"
            fill="none"
            strokeDasharray="219.9"
            strokeDashoffset={(1 - macros.carbs / goals.carbs) * 219.9}
          />

          {/* Fats Progress */}
          <Circle
            cx="50"
            cy="50"
            r="30"
            stroke="#4CD964"
            strokeWidth="10"
            fill="none"
            strokeDasharray="188.4"
            strokeDashoffset={(1 - macros.fats / goals.fats) * 188.4}
          />

          {/* Sugar Progress */}
          <Circle
            cx="50"
            cy="50"
            r="25"
            stroke="#007AFF"
            strokeWidth="10"
            fill="none"
            strokeDasharray="157.1"
            strokeDashoffset={(1 - macros.sugar / goals.sugar) * 157.1}
          />
        </Svg>
        <Text className="text-lg font-semibold text-gray-700 mt-3">
          Macros for {selectedDate}
        </Text>
      </View>

      {/* Macro Progress Overview */}
      <View className="bg-white rounded-xl p-5 shadow-md">
        <Text className="text-lg font-semibold text-gray-700 mb-3">
          Weekly Progress
        </Text>

        {/* Protein */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600">🥩 Protein</Text>
          <Text className="text-gray-600">
            {macros.protein}g / {goals.protein}g
          </Text>
        </View>
        <ProgressBar
          progress={macros.protein / goals.protein}
          color="#FF3B30"
          style={{ height: 8, marginBottom: 10 }}
        />

        {/* Carbs */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600">🍞 Carbs</Text>
          <Text className="text-gray-600">
            {macros.carbs}g / {goals.carbs}g
          </Text>
        </View>
        <ProgressBar
          progress={macros.carbs / goals.carbs}
          color="#FF9500"
          style={{ height: 8, marginBottom: 10 }}
        />

        {/* Fats */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600">🧈 Fats</Text>
          <Text className="text-gray-600">
            {macros.fats}g / {goals.fats}g
          </Text>
        </View>
        <ProgressBar
          progress={macros.fats / goals.fats}
          color="#4CD964"
          style={{ height: 8, marginBottom: 10 }}
        />

        {/* Sugar */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600">🍭 Sugar</Text>
          <Text className="text-gray-600">
            {macros.sugar}g / {goals.sugar}g
          </Text>
        </View>
        <ProgressBar
          progress={macros.sugar / goals.sugar}
          color="#007AFF"
          style={{ height: 8, marginBottom: 10 }}
        />
      </View>

      {/* Button to Navigate to Monthly View */}
      <TouchableOpacity
        className="bg-blue-500 rounded-xl p-4 mt-5 items-center"
        onPress={() => router.push("/macros/monthly")}
      >
        <Text className="text-white text-lg font-semibold">
          📅 View Monthly Macros
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
