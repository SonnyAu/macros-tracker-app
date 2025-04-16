import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCallback, useState } from "react";
import { useMacroContext } from "../context/MacroContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function ProfileScreen() {
  const {
    macroGoals,
    updateMacroGoals,
    useGrams,
    toggleUseGrams,
    darkMode,
    toggleDarkMode,
  } = useMacroContext();
  const { logout } = useAuth();

  const [password, setPassword] = useState("");
  // Local state for input values
  const [formValues, setFormValues] = useState({
    protein: macroGoals.protein,
    carbs: macroGoals.carbs,
    fats: macroGoals.fats,
    sugar: macroGoals.sugar,
  });

  const handleSaveGoals = useCallback(() => {
    // Validate numeric inputs
    const numericFields = ["protein", "carbs", "fats", "sugar"];
    const isValid = numericFields.every(
      (field) => !isNaN(Number(formValues[field as keyof typeof formValues]))
    );

    if (!isValid) {
      Alert.alert(
        "Invalid Input",
        "Please enter valid numbers for all macro goals"
      );
      return;
    }

    updateMacroGoals(formValues);
    Alert.alert("Success", "Your macro goals have been updated!");
  }, [formValues, updateMacroGoals]);

  const handlePasswordUpdate = useCallback(() => {
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Password update logic would go here
    Alert.alert("Success", "Your password has been updated!");
    setPassword("");
  }, [password]);

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      // No need to navigate, the auth logic will handle it
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <BlurView
          intensity={100}
          tint={darkMode ? "dark" : "light"}
          className="absolute top-0 left-0 right-0 h-32 z-0"
        />

        <View className="z-10 w-full items-center mt-8 mb-4">
          <View
            className={`rounded-full overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            } w-20 h-20 items-center justify-center mb-2 shadow-md`}
          >
            <Ionicons
              name="person"
              size={40}
              color={darkMode ? "#60a5fa" : "#3b82f6"}
            />
          </View>
          <Text
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Your Profile
          </Text>
        </View>

        {/* Macro Goals Card */}
        <View
          className={`rounded-xl overflow-hidden shadow-lg mb-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <View className="border-b border-gray-200 p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="stats-chart"
                size={20}
                color={darkMode ? "#60a5fa" : "#3b82f6"}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Daily Macro Goals
              </Text>
            </View>
          </View>

          <View className="p-4">
            <View className="mb-4">
              <Text
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Protein ({useGrams ? "g" : "oz"})
              </Text>
              <TextInput
                className={`px-3 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                keyboardType="numeric"
                value={formValues.protein}
                onChangeText={(text) => handleInputChange("protein", text)}
                placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>

            <View className="mb-4">
              <Text
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Carbs ({useGrams ? "g" : "oz"})
              </Text>
              <TextInput
                className={`px-3 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                keyboardType="numeric"
                value={formValues.carbs}
                onChangeText={(text) => handleInputChange("carbs", text)}
                placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>

            <View className="mb-4">
              <Text
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Fats ({useGrams ? "g" : "oz"})
              </Text>
              <TextInput
                className={`px-3 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                keyboardType="numeric"
                value={formValues.fats}
                onChangeText={(text) => handleInputChange("fats", text)}
                placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>

            <View className="mb-4">
              <Text
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Sugar ({useGrams ? "g" : "oz"})
              </Text>
              <TextInput
                className={`px-3 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                keyboardType="numeric"
                value={formValues.sugar}
                onChangeText={(text) => handleInputChange("sugar", text)}
                placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>

            <TouchableOpacity
              className="bg-blue-500 rounded-lg py-3 items-center"
              onPress={handleSaveGoals}
              activeOpacity={0.8}
            >
              <Text className="text-white font-medium">Save Goals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Card */}
        <View
          className={`rounded-xl overflow-hidden shadow-lg mb-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <View className="border-b border-gray-200 p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="key"
                size={20}
                color={darkMode ? "#60a5fa" : "#3b82f6"}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Security
              </Text>
            </View>
          </View>

          <View className="p-4">
            <View className="mb-4">
              <Text
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                New Password
              </Text>
              <TextInput
                className={`px-3 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>

            <TouchableOpacity
              className="bg-blue-500 rounded-lg py-3 items-center"
              onPress={handlePasswordUpdate}
              activeOpacity={0.8}
            >
              <Text className="text-white font-medium">Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Card */}
        <View
          className={`rounded-xl overflow-hidden shadow-lg mb-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <View className="border-b border-gray-200 p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="settings-sharp"
                size={20}
                color={darkMode ? "#60a5fa" : "#3b82f6"}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Preferences
              </Text>
            </View>
          </View>

          <View className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Ionicons
                  name={useGrams ? "speedometer" : "scale"}
                  size={18}
                  color={darkMode ? "#60a5fa" : "#3b82f6"}
                />
                <Text
                  className={`ml-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Use Grams (g)
                </Text>
              </View>
              <Switch
                value={useGrams}
                onValueChange={toggleUseGrams}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={useGrams ? "#3b82f6" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name={darkMode ? "moon" : "sunny"}
                  size={18}
                  color={darkMode ? "#60a5fa" : "#3b82f6"}
                />
                <Text
                  className={`ml-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={darkMode ? "#3b82f6" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </View>
        </View>

        {/* Logout Card */}
        <View
          className={`rounded-xl overflow-hidden shadow-lg mb-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <View className="border-b border-gray-200 p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="log-out"
                size={20}
                color={darkMode ? "#f87171" : "#ef4444"}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Account
              </Text>
            </View>
          </View>

          <View className="p-4">
            <TouchableOpacity
              className="bg-red-500 rounded-lg py-3 items-center"
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text className="text-white font-medium">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
});
