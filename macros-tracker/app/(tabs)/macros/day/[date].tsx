import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Svg, Circle } from "react-native-svg";

export default function DayMacrosScreen() {
  const { date } = useLocalSearchParams(); // Get the date from the URL

  // Mock macro data for the selected day
  const macros = {
    protein: 120, // in grams
    carbs: 250,
    fats: 70,
    sugar: 30,
  };

  // Total Daily Goals (Adjust as needed)
  const goals = {
    protein: 150,
    carbs: 300,
    fats: 100,
    sugar: 50,
  };

  return (
    <View className="flex-1 bg-gray-100 p-5 items-center">
      <Text className="text-2xl font-bold text-center mb-4">
        📆 Macros for {date}
      </Text>

      {/* Macro Fitness Wheel */}
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

      {/* Button to Go Back */}
      <TouchableOpacity
        className="bg-red-500 rounded-xl p-4 mt-5 items-center"
        onPress={() => router.back()}
      >
        <Text className="text-white text-lg font-semibold">
          🔙 Back to Weekly View
        </Text>
      </TouchableOpacity>
    </View>
  );
}
