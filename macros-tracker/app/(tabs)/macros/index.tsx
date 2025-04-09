import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ProgressBar } from "react-native-paper";
import { Svg, Circle, G } from "react-native-svg";

interface MacroData {
  protein: number;
  carbs: number;
  fats: number;
  sugar: number;
}

interface MacroRingsProps {
  macros: MacroData;
  goals: MacroData;
}

function MacroRings({ macros, goals }: MacroRingsProps) {
  // Calculate the circumference of each ring
  const calculateCircumference = (radius: number) => 2 * Math.PI * radius;

  // Define the rings configuration
  const rings = [
    { macro: "protein", color: "#FF3B30", radius: 100 },
    { macro: "carbs", color: "#5856D6", radius: 85 },
    { macro: "fats", color: "#FF9500", radius: 70 },
    { macro: "sugar", color: "#34C759", radius: 55 },
  ] as const;

  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <Svg width={220} height={220} viewBox="-110 -110 220 220">
        {rings.map(({ macro, color, radius }) => {
          const circumference = calculateCircumference(radius);
          const progress =
            macros[macro as keyof MacroData] / goals[macro as keyof MacroData];
          const strokeDashoffset = circumference * (1 - Math.min(progress, 1));

          return (
            <G key={macro}>
              <Circle
                r={radius}
                fill="none"
                stroke="#E5E5EA"
                strokeWidth={10}
              />
              <Circle
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={10}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90)"
                strokeLinecap="round"
              />
            </G>
          );
        })}
      </Svg>
      <View style={{ marginTop: 20 }}>
        {rings.map(({ macro, color }) => (
          <View
            key={macro}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: color,
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontSize: 16 }}>
              {macro.charAt(0).toUpperCase() + macro.slice(1)}:{" "}
              {macros[macro as keyof MacroData]}g /{" "}
              {goals[macro as keyof MacroData]}g
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function WeeklyMacrosScreen() {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      formatted: format(date, "EEE"),
      dayNumber: format(date, "d"),
      fullDate: format(date, "yyyy-MM-dd"),
    };
  });

  // Mock data
  const macros = {
    protein: 120,
    carbs: 250,
    fats: 70,
    sugar: 30,
  };

  const goals = {
    protein: 150,
    carbs: 300,
    fats: 100,
    sugar: 50,
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Week View */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {weekDays.map(({ formatted, dayNumber, fullDate }) => (
          <Link
            key={fullDate}
            href={{
              pathname: "/(tabs)/macros/[date]",
              params: { date: fullDate },
            }}
            asChild
          >
            <TouchableOpacity
              className={`mx-2 p-4 rounded-xl w-16 h-20 items-center justify-center ${
                selectedDate === fullDate ? "bg-blue-500" : "bg-white"
              }`}
              onPress={() => setSelectedDate(fullDate)}
            >
              <Text
                className={`text-sm font-bold ${
                  selectedDate === fullDate ? "text-white" : "text-gray-600"
                }`}
              >
                {formatted}
              </Text>
              <Text
                className={`text-lg font-bold ${
                  selectedDate === fullDate ? "text-white" : "text-gray-800"
                }`}
              >
                {dayNumber}
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      {/* Macro Rings */}
      <View className="bg-white rounded-xl p-4 mb-6">
        <Text className="text-xl font-bold mb-2 text-center">
          Daily Progress
        </Text>
        <MacroRings macros={macros} goals={goals} />
      </View>

      {/* Detailed Progress */}
      <View className="bg-white rounded-xl p-6 mb-6">
        <Text className="text-xl font-bold mb-4">Detailed Progress</Text>
        {Object.entries(macros).map(([key, value]) => (
          <View key={key} className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 capitalize">{key}</Text>
              <Text className="text-gray-600">
                {value}g / {goals[key as keyof typeof goals]}g
              </Text>
            </View>
            <ProgressBar
              progress={value / goals[key as keyof typeof goals]}
              color={
                key === "protein"
                  ? "#FF3B30"
                  : key === "carbs"
                  ? "#FF9500"
                  : key === "fats"
                  ? "#4CD964"
                  : "#007AFF"
              }
              style={{ height: 8, borderRadius: 4 }}
            />
          </View>
        ))}
      </View>

      {/* Monthly View Link */}
      <Link href="/(tabs)/macros/monthly" asChild>
        <TouchableOpacity className="bg-blue-500 p-4 rounded-xl">
          <Text className="text-white text-center font-bold text-lg">
            View Monthly Overview
          </Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}
