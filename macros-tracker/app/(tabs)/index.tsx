import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 p-6 pt-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            Welcome Back!
          </Text>
          <Text className="text-lg text-gray-600">
            Let's track your nutrition today
          </Text>
        </View>

        {/* Macro Overview Card */}
        <View className="bg-white rounded-3xl p-6 shadow-lg mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-800">
              Today's Macros
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/macros")}
              className="bg-blue-50 px-3 py-1 rounded-full"
            >
              <Text className="text-blue-600 font-medium">Details</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View className="h-3 bg-gray-200 rounded-full w-full mb-5">
            <View className="h-3 bg-blue-500 rounded-full w-3/5" />
          </View>

          <View className="flex-row justify-between">
            <View className="items-center bg-blue-50 p-3 rounded-2xl flex-1 mr-2">
              <Text className="text-2xl mb-1">🔥</Text>
              <Text className="text-gray-600 text-sm">Calories</Text>
              <Text className="text-xl font-bold text-gray-800">1,800</Text>
            </View>

            <View className="items-center bg-red-50 p-3 rounded-2xl flex-1 mx-2">
              <Text className="text-2xl mb-1">🥩</Text>
              <Text className="text-gray-600 text-sm">Protein</Text>
              <Text className="text-xl font-bold text-gray-800">120g</Text>
            </View>

            <View className="items-center bg-yellow-50 p-3 rounded-2xl flex-1 ml-2">
              <Text className="text-2xl mb-1">🍞</Text>
              <Text className="text-gray-600 text-sm">Carbs</Text>
              <Text className="text-xl font-bold text-gray-800">250g</Text>
            </View>
          </View>

          <View className="items-center bg-green-50 p-3 rounded-2xl mt-3">
            <Text className="text-2xl mb-1">🧈</Text>
            <Text className="text-gray-600 text-sm">Fats</Text>
            <Text className="text-xl font-bold text-gray-800">70g</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </Text>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => router.push("/scanner")}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center shadow-sm"
          >
            <View className="bg-blue-100 p-3 rounded-xl mr-4">
              <IconSymbol name="camera.fill" color="#3b82f6" size={24} />
            </View>
            <View>
              <Text className="text-gray-900 text-lg font-semibold">
                Scan Food
              </Text>
              <Text className="text-gray-500">
                Identify food with your camera
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/macros")}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center shadow-sm"
          >
            <View className="bg-green-100 p-3 rounded-xl mr-4">
              <IconSymbol name="chart.pie.fill" color="#22c55e" size={24} />
            </View>
            <View>
              <Text className="text-gray-900 text-lg font-semibold">
                Log Meal
              </Text>
              <Text className="text-gray-500">Track your food intake</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center shadow-sm"
          >
            <View className="bg-purple-100 p-3 rounded-xl mr-4">
              <IconSymbol name="person.fill" color="#8b5cf6" size={24} />
            </View>
            <View>
              <Text className="text-gray-900 text-lg font-semibold">
                My Profile
              </Text>
              <Text className="text-gray-500">View history & settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
