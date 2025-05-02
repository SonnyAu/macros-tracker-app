import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import { Platform, View, ActivityIndicator } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMacroContext } from "../context/MacroContext";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const { darkMode, isLoading } = useMacroContext();

  // Handle loading state by using local state until context loads
  const [effectiveColorScheme, setEffectiveColorScheme] = useState(
    colorScheme ?? "light"
  );

  useEffect(() => {
    if (!isLoading) {
      setEffectiveColorScheme(darkMode ? "dark" : colorScheme ?? "light");
    }
  }, [darkMode, colorScheme, isLoading]);

  // If context is still loading, use system color scheme
  if (isLoading) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            ...(Platform.OS === "android" && { elevation: 8 }),
          },
        }}
      >
        {/* Basic tab structure while loading */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="house.fill" color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="macros"
          options={{
            title: "Macros",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="chart.pie.fill" color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: "Scanner",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="camera.fill" color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="person.fill" color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[effectiveColorScheme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...(effectiveColorScheme === "dark"
            ? {
                backgroundColor: "#1F2937", // Dark gray for dark mode
                borderTopColor: "#374151",
              }
            : {
                backgroundColor: "#fff",
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb",
              }),
          ...(Platform.OS === "android" && {
            elevation: 8,
          }),
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" color={color} size={24} />
          ),
        }}
      />

      {/* Macros Tab */}
      <Tabs.Screen
        name="macros"
        options={{
          title: "Macros",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="chart.pie.fill" color={color} size={24} />
          ),
        }}
      />

      {/* Scanner */}
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="camera.fill" color={color} size={24} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
