import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Svg, Circle } from "react-native-svg";

export default function DayMacrosScreen() {
  const { date } = useLocalSearchParams();

  // Mock macro data for the selected day
  const macros = {
    protein: 120,
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

  const macroColors = {
    protein: "#FF3B30",
    carbs: "#FF9500",
    fats: "#4CD964",
    sugar: "#007AFF",
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <View className="bg-white rounded-xl p-4 mb-6">
        <Text className="text-xl font-bold text-center mb-4">
          Daily Progress
        </Text>

        {/* Macro Fitness Wheel */}
        <View className="items-center">
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

          {/* Macro Information */}
          <View className="mt-6 w-full">
            {Object.entries(macros).map(([key, value]) => (
              <View key={key} className="flex-row items-center mb-3">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor:
                      macroColors[key as keyof typeof macroColors],
                  }}
                />
                <Text className="flex-1 text-gray-600 capitalize">{key}</Text>
                <Text className="text-gray-600">
                  {value}g / {goals[key as keyof typeof goals]}g
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
