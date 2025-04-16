import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ProgressBar } from "react-native-paper";
import { Svg, Circle, G, Text as SvgText } from "react-native-svg";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useMacroContext } from "../../context/MacroContext";
import { Ionicons } from "@expo/vector-icons";

interface MacroData {
  protein: number;
  carbs: number;
  fats: number;
  sugar: number;
}

interface MacroRingsProps {
  macros: MacroData;
  goals: MacroData;
  useGrams: boolean;
  darkMode: boolean;
}

function MacroRings({ macros, goals, useGrams, darkMode }: MacroRingsProps) {
  // Calculate the circumference of each ring
  const calculateCircumference = (radius: number) => 2 * Math.PI * radius;

  // Define the rings configuration
  const rings = [
    { macro: "protein", color: "#FF375F", radius: 100, label: "Protein" },
    { macro: "carbs", color: "#5E5CE6", radius: 85, label: "Carbs" },
    { macro: "fats", color: "#FF9F0A", radius: 70, label: "Fats" },
    { macro: "sugar", color: "#30D158", radius: 55, label: "Sugar" },
  ] as const;

  // Calculate total calories
  const caloriesConsumed =
    macros.protein * 4 + macros.carbs * 4 + macros.fats * 9;

  const caloriesGoal = goals.protein * 4 + goals.carbs * 4 + goals.fats * 9;

  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <View style={{ width: 240, height: 240, position: "relative" }}>
        <Svg width={240} height={240} viewBox="-120 -120 240 240">
          {rings.map(({ macro, color, radius }, index) => {
            const circumference = calculateCircumference(radius);
            const progress =
              macros[macro as keyof MacroData] /
              goals[macro as keyof MacroData];
            const strokeDashoffset =
              circumference * (1 - Math.min(progress, 1));

            return (
              <G key={macro}>
                <Circle
                  r={radius}
                  fill="none"
                  stroke={darkMode ? "#333333" : "#E5E5EA"}
                  strokeWidth={12}
                  opacity={0.3}
                />
                <Circle
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={12}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90)"
                  strokeLinecap="round"
                />
              </G>
            );
          })}
        </Svg>

        {/* Centered calories display */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: darkMode ? "#FFFFFF" : "#000000",
            }}
          >
            {caloriesConsumed}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: darkMode ? "#AAAAAA" : "#8A8A8E",
              marginTop: 4,
            }}
          >
            / {caloriesGoal} cal
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", marginTop: 20 }}>
        {rings.map(({ macro, color, label }) => {
          const value = macros[macro as keyof MacroData];
          const goal = goals[macro as keyof MacroData];
          const percentage = Math.round((value / goal) * 100);
          const unit = useGrams ? "g" : "oz";

          return (
            <View
              key={macro}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: color,
                    borderRadius: 6,
                    marginRight: 12,
                  }}
                />
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "500",
                    color: darkMode ? "#FFFFFF" : "#000000",
                  }}
                >
                  {label}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 17,
                  color: darkMode ? "#AAAAAA" : "#8A8A8E",
                }}
              >
                {value}
                {unit} / {goal}
                {unit} • {percentage}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function WeeklyMacrosScreen() {
  const { macroGoals, useGrams, darkMode } = useMacroContext();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      formatted: format(date, "E"),
      dayNumber: format(date, "d"),
      fullDate: format(date, "yyyy-MM-dd"),
      isToday: format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
    };
  });

  // Mock data for consumed macros
  const macros = {
    protein: 120,
    carbs: 250,
    fats: 70,
    sugar: 30,
  };

  // Use macro goals from context
  const goals = {
    protein: Number(macroGoals.protein),
    carbs: Number(macroGoals.carbs),
    fats: Number(macroGoals.fats),
    sugar: Number(macroGoals.sugar),
  };

  return (
    <View className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-[#F2F2F7]"}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <ScrollView className="flex-1">
        {/* Header with Monthly View Button */}
        <View className="px-6 pt-12 pb-4 flex-row justify-between items-center">
          <View>
            <Text
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Macros
            </Text>
            <Text
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } mt-1`}
            >
              {format(new Date(selectedDate), "MMMM d, yyyy")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/macros/monthly")}
            className={`${
              darkMode ? "bg-gray-800" : "bg-blue-100"
            } p-2 rounded-full`}
          >
            <Ionicons
              name="calendar"
              size={24}
              color={darkMode ? "#60a5fa" : "#3b82f6"}
            />
          </TouchableOpacity>
        </View>

        {/* Week View */}
        <View className="px-6 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {weekDays.map(({ formatted, dayNumber, fullDate, isToday }) => (
              <Link
                key={fullDate}
                href={{
                  pathname: "/(tabs)/macros/[date]",
                  params: { date: fullDate },
                }}
                asChild
              >
                <TouchableOpacity
                  className={`mr-3 py-3 px-1.5 rounded-2xl w-14 h-22 items-center justify-center 
                    ${
                      selectedDate === fullDate
                        ? darkMode
                          ? "bg-blue-900 border-blue-700"
                          : "bg-blue-100 border-blue-200"
                        : darkMode
                        ? "bg-gray-800"
                        : "bg-white"
                    } ${
                    isToday
                      ? darkMode
                        ? "border border-blue-500"
                        : "border border-blue-400"
                      : ""
                  }`}
                  onPress={() => setSelectedDate(fullDate)}
                >
                  <Text
                    className={`text-xs ${
                      selectedDate === fullDate
                        ? darkMode
                          ? "text-blue-300"
                          : "text-blue-600"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {formatted}
                  </Text>
                  <Text
                    className={`text-xl font-semibold mt-1 ${
                      selectedDate === fullDate
                        ? darkMode
                          ? "text-blue-300"
                          : "text-blue-600"
                        : darkMode
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {dayNumber}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Macro Rings */}
        <View
          className={`mx-6 rounded-3xl p-5 mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          <MacroRings
            macros={macros}
            goals={goals}
            useGrams={useGrams}
            darkMode={darkMode}
          />
        </View>

        {/* Meals Card */}
        <View className="px-6 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Today's Meals
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">Add Meal</Text>
            </TouchableOpacity>
          </View>

          {/* Breakfast */}
          <View
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-4 mb-4 shadow-sm`}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text
                className={`font-semibold text-lg ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                🍳 Breakfast
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                440 cals
              </Text>
            </View>
            <View className="flex-row">
              <View className="flex-1 pr-2">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Protein
                </Text>
                <ProgressBar
                  progress={0.7}
                  color="#FF375F"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  35{useGrams ? "g" : "oz"}
                </Text>
              </View>
              <View className="flex-1 px-1">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Carbs
                </Text>
                <ProgressBar
                  progress={0.5}
                  color="#5E5CE6"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  45{useGrams ? "g" : "oz"}
                </Text>
              </View>
              <View className="flex-1 pl-2">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Fat
                </Text>
                <ProgressBar
                  progress={0.3}
                  color="#FF9F0A"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  12{useGrams ? "g" : "oz"}
                </Text>
              </View>
            </View>
          </View>

          {/* Lunch */}
          <View
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-4 mb-4 shadow-sm`}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text
                className={`font-semibold text-lg ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                🥗 Lunch
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                680 cals
              </Text>
            </View>
            <View className="flex-row">
              <View className="flex-1 pr-2">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Protein
                </Text>
                <ProgressBar
                  progress={0.6}
                  color="#FF375F"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  40{useGrams ? "g" : "oz"}
                </Text>
              </View>
              <View className="flex-1 px-1">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Carbs
                </Text>
                <ProgressBar
                  progress={0.8}
                  color="#5E5CE6"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  75{useGrams ? "g" : "oz"}
                </Text>
              </View>
              <View className="flex-1 pl-2">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Fat
                </Text>
                <ProgressBar
                  progress={0.4}
                  color="#FF9F0A"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  18{useGrams ? "g" : "oz"}
                </Text>
              </View>
            </View>
          </View>

          {/* Dinner */}
          <View
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-4 mb-4 shadow-sm`}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text
                className={`font-semibold text-lg ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                🍽️ Dinner
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                720 cals
              </Text>
            </View>
            <View className="flex-row">
              <View className="flex-1 pr-2">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Protein
                </Text>
                <ProgressBar
                  progress={0.9}
                  color="#FF375F"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  45{useGrams ? "g" : "oz"}
                </Text>
              </View>
              <View className="flex-1 px-1">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Carbs
                </Text>
                <ProgressBar
                  progress={0.7}
                  color="#5E5CE6"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  60{useGrams ? "g" : "oz"}
                </Text>
              </View>
              <View className="flex-1 pl-2">
                <Text
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  Fat
                </Text>
                <ProgressBar
                  progress={0.8}
                  color="#FF9F0A"
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? "#333333" : "#E5E5EA",
                  }}
                />
                <Text
                  className={`text-right text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  30{useGrams ? "g" : "oz"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Month View Button at the bottom */}
        <View className="px-6 pb-8 pt-2">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/macros/monthly")}
            className={`${
              darkMode ? "bg-blue-900" : "bg-blue-500"
            } rounded-xl py-4 px-6 flex-row justify-center items-center shadow-md mb-4`}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-base">
              View Monthly Calendar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
