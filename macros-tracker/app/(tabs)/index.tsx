import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-100 p-5 justify-center">
      {/* Header */}
      <View className="mb-8 items-center">
        <Text className="text-3xl font-bold text-gray-900">Welcome Back!</Text>
        <Text className="text-lg text-gray-600 text-center">
          Track your meals & stay on top of your macros
        </Text>
      </View>

      {/* Macro Overview */}
      <View className="bg-white rounded-xl p-6 shadow-md mb-8 mx-4">
        <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Today's Macros
        </Text>
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl">🔥</Text>
            <Text className="text-gray-600">Calories</Text>
            <Text className="text-xl font-bold">1,800 kcal</Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl">🥩</Text>
            <Text className="text-gray-600">Protein</Text>
            <Text className="text-xl font-bold">120g</Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl">🍞</Text>
            <Text className="text-gray-600">Carbs</Text>
            <Text className="text-xl font-bold">250g</Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl">🧈</Text>
            <Text className="text-gray-600">Fats</Text>
            <Text className="text-xl font-bold">70g</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="space-y-4 mx-4">
        <TouchableOpacity className="bg-blue-500 rounded-xl p-4 items-center">
          <Text className="text-white text-lg font-semibold">
            📷 Take a Picture
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-green-500 rounded-xl p-4 items-center">
          <Text className="text-white text-lg font-semibold">🍽️ Log Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-800 rounded-xl p-4 items-center">
          <Text className="text-white text-lg font-semibold">
            📜 View History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
