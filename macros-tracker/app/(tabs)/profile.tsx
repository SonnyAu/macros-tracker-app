import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { useState } from "react";

export default function ProfileScreen() {
  const [proteinGoal, setProteinGoal] = useState("150");
  const [carbsGoal, setCarbsGoal] = useState("300");
  const [fatsGoal, setFatsGoal] = useState("100");
  const [sugarGoal, setSugarGoal] = useState("50");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [useGrams, setUseGrams] = useState(true);

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 20, paddingBottom: 50 }} // Ensures scrolling is smooth
    >
      <Text className="text-2xl font-bold text-center mb-4">👤 Profile</Text>

      {/* Change Password */}
      <View className="bg-white rounded-xl p-4 shadow-md mb-4">
        <Text className="text-lg font-semibold mb-2">🔑 Change Password</Text>
        <TextInput
          className="bg-gray-200 rounded-lg p-3"
          placeholder="Enter new password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity className="bg-blue-500 mt-3 p-3 rounded-lg items-center">
          <Text className="text-white font-semibold">Update Password</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Macro Goals */}
      <View className="bg-white rounded-xl p-4 shadow-md mb-4">
        <Text className="text-lg font-semibold mb-2">🎯 Macro Goals</Text>

        <View className="mb-2">
          <Text className="text-gray-600">🥩 Protein Goal (g)</Text>
          <TextInput
            className="bg-gray-200 rounded-lg p-3"
            keyboardType="numeric"
            value={proteinGoal}
            onChangeText={setProteinGoal}
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-600">🍞 Carbs Goal (g)</Text>
          <TextInput
            className="bg-gray-200 rounded-lg p-3"
            keyboardType="numeric"
            value={carbsGoal}
            onChangeText={setCarbsGoal}
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-600">🧈 Fats Goal (g)</Text>
          <TextInput
            className="bg-gray-200 rounded-lg p-3"
            keyboardType="numeric"
            value={fatsGoal}
            onChangeText={setFatsGoal}
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-600">🍭 Sugar Goal (g)</Text>
          <TextInput
            className="bg-gray-200 rounded-lg p-3"
            keyboardType="numeric"
            value={sugarGoal}
            onChangeText={setSugarGoal}
          />
        </View>

        <TouchableOpacity className="bg-green-500 mt-3 p-3 rounded-lg items-center">
          <Text className="text-white font-semibold">Save Goals</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View className="bg-white rounded-xl p-4 shadow-md mb-4">
        <Text className="text-lg font-semibold mb-2">⚙️ Settings</Text>

        {/* Unit Selection */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-600">🔢 Units (Grams/Ounces)</Text>
          <Switch
            value={useGrams}
            onValueChange={() => setUseGrams(!useGrams)}
          />
        </View>

        {/* Dark Mode Toggle */}
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">🌙 Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={() => setDarkMode(!darkMode)}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity className="bg-red-500 p-4 rounded-lg items-center mb-5">
        <Text className="text-white font-semibold">🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
