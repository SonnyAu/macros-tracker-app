import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useMacroContext } from "../context/MacroContext";
import { useState, useEffect } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { macroGoals, useGrams, darkMode } = useMacroContext();

  // For demonstration, these would normally come from a tracking service
  const [consumed, setConsumed] = useState({
    protein: 92,
    carbs: 186,
    fats: 42,
    sugar: 28,
    calories: 1280,
  });

  // Calculate percentage of goals met
  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const proteinProgress = calculateProgress(
    consumed.protein,
    Number(macroGoals.protein)
  );
  const carbsProgress = calculateProgress(
    consumed.carbs,
    Number(macroGoals.carbs)
  );
  const fatsProgress = calculateProgress(
    consumed.fats,
    Number(macroGoals.fats)
  );

  // Overall progress is an average of the three main macros
  const overallProgress = Math.round(
    (proteinProgress + carbsProgress + fatsProgress) / 3
  );

  return (
    <ScrollView className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <View className="flex-1 p-6 pt-12">
        {/* Header */}
        <View className="mb-8">
          <Text
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            } mb-1`}
          >
            Welcome Back!
          </Text>
          <Text
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Let's track your nutrition today
          </Text>
        </View>

        {/* Macro Overview Card */}
        <View
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-3xl p-6 shadow-lg mb-8`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Today's Macros
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/macros")}
              className="bg-blue-500 px-3 py-1 rounded-full"
            >
              <Text className="text-white font-medium">Details</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View
            className={`h-3 ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            } rounded-full w-full mb-5`}
          >
            <View
              className={`h-3 bg-blue-500 rounded-full`}
              style={{ width: `${overallProgress}%` }}
            />
          </View>

          <View className="flex-row justify-between mb-3">
            <View
              className={`items-center ${
                darkMode ? "bg-gray-700" : "bg-blue-50"
              } p-3 rounded-2xl flex-1 mr-2`}
            >
              <View className="w-full h-1 bg-gray-400 rounded-full mb-2">
                <View
                  className="h-1 bg-blue-500 rounded-full"
                  style={{
                    width: `${calculateProgress(consumed.calories, 2000)}%`,
                  }}
                />
              </View>
              <Text className="text-xl mb-1">🔥</Text>
              <Text
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Calories
              </Text>
              <Text
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {consumed.calories}
              </Text>
              <Text
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Goal: 2000
              </Text>
            </View>

            <View
              className={`items-center ${
                darkMode ? "bg-gray-700" : "bg-red-50"
              } p-3 rounded-2xl flex-1 mx-2`}
            >
              <View className="w-full h-1 bg-gray-400 rounded-full mb-2">
                <View
                  className="h-1 bg-red-500 rounded-full"
                  style={{ width: `${proteinProgress}%` }}
                />
              </View>
              <Text className="text-xl mb-1">🥩</Text>
              <Text
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Protein
              </Text>
              <Text
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {consumed.protein}
                {useGrams ? "g" : "oz"}
              </Text>
              <Text
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Goal: {macroGoals.protein}
                {useGrams ? "g" : "oz"}
              </Text>
            </View>

            <View
              className={`items-center ${
                darkMode ? "bg-gray-700" : "bg-yellow-50"
              } p-3 rounded-2xl flex-1 ml-2`}
            >
              <View className="w-full h-1 bg-gray-400 rounded-full mb-2">
                <View
                  className="h-1 bg-yellow-500 rounded-full"
                  style={{ width: `${carbsProgress}%` }}
                />
              </View>
              <Text className="text-xl mb-1">🍞</Text>
              <Text
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Carbs
              </Text>
              <Text
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {consumed.carbs}
                {useGrams ? "g" : "oz"}
              </Text>
              <Text
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Goal: {macroGoals.carbs}
                {useGrams ? "g" : "oz"}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View
              className={`items-center ${
                darkMode ? "bg-gray-700" : "bg-green-50"
              } p-3 rounded-2xl flex-1 mr-2`}
            >
              <View className="w-full h-1 bg-gray-400 rounded-full mb-2">
                <View
                  className="h-1 bg-green-500 rounded-full"
                  style={{ width: `${fatsProgress}%` }}
                />
              </View>
              <Text className="text-xl mb-1">🧈</Text>
              <Text
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Fats
              </Text>
              <Text
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {consumed.fats}
                {useGrams ? "g" : "oz"}
              </Text>
              <Text
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Goal: {macroGoals.fats}
                {useGrams ? "g" : "oz"}
              </Text>
            </View>

            <View
              className={`items-center ${
                darkMode ? "bg-gray-700" : "bg-pink-50"
              } p-3 rounded-2xl flex-1 ml-2`}
            >
              <View className="w-full h-1 bg-gray-400 rounded-full mb-2">
                <View
                  className="h-1 bg-pink-500 rounded-full"
                  style={{
                    width: `${calculateProgress(
                      consumed.sugar,
                      Number(macroGoals.sugar)
                    )}%`,
                  }}
                />
              </View>
              <Text className="text-xl mb-1">🍭</Text>
              <Text
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Sugar
              </Text>
              <Text
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {consumed.sugar}
                {useGrams ? "g" : "oz"}
              </Text>
              <Text
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Goal: {macroGoals.sugar}
                {useGrams ? "g" : "oz"}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-gray-800"
          } mb-4`}
        >
          Quick Actions
        </Text>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => router.push("/scanner")}
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-2xl p-4 flex-row items-center shadow-sm`}
          >
            <View className="bg-blue-100 p-3 rounded-xl mr-4">
              <IconSymbol name="camera.fill" color="#3b82f6" size={24} />
            </View>
            <View>
              <Text
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } text-lg font-semibold`}
              >
                Scan Food
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Identify food with your camera
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/macros")}
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-2xl p-4 flex-row items-center shadow-sm`}
          >
            <View className="bg-green-100 p-3 rounded-xl mr-4">
              <IconSymbol name="chart.pie.fill" color="#22c55e" size={24} />
            </View>
            <View>
              <Text
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } text-lg font-semibold`}
              >
                Log Meal
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Track your food intake
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-2xl p-4 flex-row items-center shadow-sm`}
          >
            <View className="bg-purple-100 p-3 rounded-xl mr-4">
              <IconSymbol name="person.fill" color="#8b5cf6" size={24} />
            </View>
            <View>
              <Text
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } text-lg font-semibold`}
              >
                My Profile
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                View history & settings
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
