import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useMacroContext } from "../context/MacroContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function LoginScreen() {
  const { login, isLoading, isLoggedIn } = useAuth();
  const { darkMode } = useMacroContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Redirect to main app if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    setErrorMsg("");

    try {
      await login(email, password);
      // The navigation will be handled by the useEffect above
    } catch (error) {
      setErrorMsg("Login failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className={darkMode ? "bg-gray-900" : "bg-gray-50"}
    >
      <StatusBar style={darkMode ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 p-8 justify-center">
          {/* App Logo and Name */}
          <View className="items-center mb-12">
            <View className="w-24 h-24 rounded-full mb-4 items-center justify-center bg-blue-500">
              <IconSymbol name="fork.knife" color="#ffffff" size={50} />
            </View>
            <Text
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              MacroTracker
            </Text>
            <Text
              className={`text-base mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Track your nutrition goals
            </Text>
          </View>

          {/* Error Message */}
          {errorMsg ? (
            <View className="bg-red-100 border-l-4 border-red-500 p-3 rounded mb-6">
              <Text className="text-red-700">{errorMsg}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View className="mb-6">
            <Text
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </Text>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <IconSymbol
                name="envelope.fill"
                color={darkMode ? "#9ca3af" : "#6b7280"}
                size={20}
              />
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                className={`ml-3 flex-1 text-base ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </Text>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <IconSymbol
                name="lock.fill"
                color={darkMode ? "#9ca3af" : "#6b7280"}
                size={20}
              />
              <TextInput
                placeholder="Your password"
                placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                className={`ml-3 flex-1 text-base ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="ml-2"
              >
                <IconSymbol
                  name={isPasswordVisible ? "eye.slash.fill" : "eye.fill"}
                  color={darkMode ? "#9ca3af" : "#6b7280"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`bg-blue-500 rounded-xl py-4 items-center ${
              isLoading ? "opacity-70" : ""
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Demo Note */}
          <View className="mt-8 items-center">
            <Text
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Demo version: Enter any email/password
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
