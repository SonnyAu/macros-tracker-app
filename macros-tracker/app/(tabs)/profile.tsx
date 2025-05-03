import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState, useEffect } from "react";
import { useMacroContext } from "../context/MacroContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Toast from "../../components/Toast";

export default function ProfileScreen() {
  const {
    macroGoals,
    updateMacroGoals,
    useGrams,
    toggleUseGrams,
    darkMode,
    toggleDarkMode,
    isLoading,
  } = useMacroContext();
  const { logout } = useAuth();

  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Local state for input values
  const [formValues, setFormValues] = useState({
    protein: macroGoals.protein,
    carbs: macroGoals.carbs,
    fats: macroGoals.fats,
    sugar: macroGoals.sugar,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // Update form values when macroGoals changes (e.g., on initial load)
  useEffect(() => {
    if (!isLoading) {
      setFormValues({
        protein: macroGoals.protein,
        carbs: macroGoals.carbs,
        fats: macroGoals.fats,
        sugar: macroGoals.sugar,
      });
    }
  }, [macroGoals, isLoading]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const handleSaveGoals = useCallback(async () => {
    // Validate numeric inputs
    const numericFields = ["protein", "carbs", "fats", "sugar"];
    const isValid = numericFields.every(
      (field) => !isNaN(Number(formValues[field as keyof typeof formValues]))
    );

    if (!isValid) {
      showToast("Please enter valid numbers for all macro goals", "error");
      return;
    }

    // Define reasonable upper limits for each macro (in grams)
    const MACRO_LIMITS = {
      protein: 400, // Even elite athletes rarely exceed this
      carbs: 700, // Very high carb diet upper limit
      fats: 250, // Very high fat diet upper limit
      sugar: 100, // Well above recommended limits
    };

    // Check if any value exceeds reasonable limits
    for (const [macro, value] of Object.entries(formValues)) {
      const numValue = Number(value);
      if (numValue > MACRO_LIMITS[macro as keyof typeof MACRO_LIMITS]) {
        showToast(
          `${
            macro.charAt(0).toUpperCase() + macro.slice(1)
          } value exceeds allowable limit`,
          "error"
        );
        return;
      }
    }

    try {
      setIsSaving(true);
      await updateMacroGoals(formValues);
      showToast("Your macro goals have been updated!", "success");
    } catch (error) {
      showToast("Failed to save your macro goals. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }, [formValues, updateMacroGoals]);

  const handlePasswordUpdate = useCallback(async () => {
    // Reset error state
    setIsUpdatingPassword(true);

    try {
      // Check if current password is provided
      if (!currentPassword.trim()) {
        showToast("Please enter your current password", "error");
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        showToast("Passwords do not match", "error");
        return;
      }

      // Check password complexity (at least 6 chars, 1 number, 1 special char)
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{6,})$/;
      if (!passwordRegex.test(password)) {
        showToast("Password must meet complexity requirements", "error");
        return;
      }

      // Simulate API call to verify current password
      // This is where you'd check against the actual password in a real app
      const isCurrentPasswordCorrect = await verifyCurrentPassword(
        currentPassword
      );

      if (!isCurrentPasswordCorrect) {
        showToast("Incorrect current password", "error");
        return;
      }

      // If we get here, all checks passed - update the password
      // Simulate password update API call
      await updateUserPassword(password);

      // Clear fields
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      // Show success message
      showToast("Password successfully updated", "success");
    } catch (error) {
      showToast("Failed to update password. Please try again later.", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  }, [currentPassword, password, confirmPassword]);

  // Mock functions that would be replaced with actual implementation
  const verifyCurrentPassword = async (password: string) => {
    // In a real app, this would verify the password against the server
    // For this demo, let's just check if it's not empty (always return true for now)
    return true;
  };

  const updateUserPassword = async (newPassword: string) => {
    // In a real app, this would send the new password to the server
    // We'll just simulate a delay for now
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    try {
      showToast("Success: You have been logged out", "success");

      // Wait briefly for the toast to be visible before redirecting
      setTimeout(async () => {
        await logout();
        // No need to navigate, the auth logic will handle it
      }, 1000);
    } catch (error) {
      showToast("Failed to logout. Please try again.", "error");
    }
  };

  const handleUseGramsToggle = async () => {
    try {
      await toggleUseGrams();
      showToast(
        `Units changed to ${!useGrams ? "grams" : "ounces"}`,
        "success"
      );
    } catch (error) {
      showToast("Failed to update units preference.", "error");
    }
  };

  const handleDarkModeToggle = async () => {
    try {
      await toggleDarkMode();
      showToast(`${!darkMode ? "Dark" : "Light"} mode activated`, "success");
    } catch (error) {
      showToast("Failed to update appearance preference.", "error");
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        }}
      >
        <ActivityIndicator
          size="large"
          color={darkMode ? "#60a5fa" : "#3b82f6"}
        />
        <Text
          style={{
            marginTop: 16,
            color: darkMode ? "#ffffff" : "#000000",
            fontSize: 16,
          }}
        >
          Loading your profile...
        </Text>
      </View>
    );
  }

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
        {/* Toast notification */}
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />

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
              <Text
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Max: 400g
              </Text>
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
              <Text
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Max: 700g
              </Text>
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
              <Text
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Max: 250g
              </Text>
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
              <Text
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Max: 100g
              </Text>
            </View>

            <TouchableOpacity
              className={`${
                isSaving ? "bg-blue-400" : "bg-blue-500"
              } rounded-lg py-3 items-center`}
              onPress={handleSaveGoals}
              activeOpacity={0.8}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-medium">Save Goals</Text>
              )}
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
                Current Password
              </Text>
              <TextInput
                className={`px-3 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>

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
              <Text
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Must be at least 6 characters with 1 number and 1 special
                character
              </Text>
            </View>

            <View className="mb-4">
              <Text
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Confirm New Password
              </Text>
              <TextInput
                className={`px-3 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>

            <TouchableOpacity
              className={`${
                isUpdatingPassword ? "bg-blue-400" : "bg-blue-500"
              } rounded-lg py-3 items-center`}
              onPress={handlePasswordUpdate}
              activeOpacity={0.8}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-medium">Update Password</Text>
              )}
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
            <View className="flex mb-4">
              <View className="flex-row justify-between items-center p-2">
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
                    Units: {useGrams ? "Grams (g)" : "Ounces (oz)"}
                  </Text>
                </View>
                <Switch
                  value={useGrams}
                  onValueChange={handleUseGramsToggle}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={useGrams ? "#3b82f6" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>

              <View className="flex-row justify-between items-center p-2">
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
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={darkMode ? "#3b82f6" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
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
