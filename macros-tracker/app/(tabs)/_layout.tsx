import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
          },
          android: {
            backgroundColor: "#fff",
            elevation: 8,
          },
        }),
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
