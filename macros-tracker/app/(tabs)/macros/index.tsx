import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfDay, parseISO } from "date-fns";
import { ProgressBar } from "react-native-paper";
import { Svg, Circle, G, Text as SvgText } from "react-native-svg";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useMacroContext } from "../../context/MacroContext";
import { Ionicons } from "@expo/vector-icons";
import { DatabaseService, FoodEntry } from "../../../services/database";

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
  const {
    macroGoals,
    useGrams,
    darkMode,
    isLoading: isContextLoading,
  } = useMacroContext();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [macros, setMacros] = useState<MacroData>({
    protein: 0,
    carbs: 0,
    fats: 0,
    sugar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState<{ [date: string]: MacroData }>({});
  const [fetchedEntries, setFetchedEntries] = useState<FoodEntry[]>([]);

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

  // Use macro goals from context
  const goals = {
    protein: Number(macroGoals.protein),
    carbs: Number(macroGoals.carbs),
    fats: Number(macroGoals.fats),
    sugar: Number(macroGoals.sugar),
  };

  // Fetch data for selected date - wait for context to be loaded
  useEffect(() => {
    if (isContextLoading) return;

    const fetchDayData = async () => {
      try {
        setLoading(true);
        const db = DatabaseService.getInstance();
        await db.connect();

        const selectedDateObj = parseISO(selectedDate);
        const fetchedEntries = await db.getFoodEntriesByDate(selectedDateObj);

        // Set the fetched entries to state
        setFetchedEntries(fetchedEntries);

        // Calculate total macros for the day
        const calculatedMacros = fetchedEntries.reduce(
          (acc, entry) => {
            const { macros } = entry.foodItem.nutrition;
            return {
              protein: acc.protein + macros.protein,
              carbs: acc.carbs + macros.carbohydrates,
              fats: acc.fats + macros.fat,
              sugar: acc.sugar + 0, // Sugar not tracked in current data model
            };
          },
          { protein: 0, carbs: 0, fats: 0, sugar: 0 }
        );

        setMacros(calculatedMacros);
      } catch (error) {
        console.error("Error fetching food entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, [selectedDate, isContextLoading]);

  // Fetch data for the whole week - wait for context to be loaded
  useEffect(() => {
    if (isContextLoading) return;

    const fetchWeekData = async () => {
      try {
        const db = DatabaseService.getInstance();
        await db.connect();

        // Process each day of the week
        const weekDataObj: { [date: string]: MacroData } = {};

        for (const day of weekDays) {
          const dayDate = parseISO(day.fullDate);
          const entries = await db.getFoodEntriesByDate(dayDate);

          // Calculate macros for this day
          const dayMacros = entries.reduce(
            (acc, entry) => {
              const { macros } = entry.foodItem.nutrition;
              return {
                protein: acc.protein + macros.protein,
                carbs: acc.carbs + macros.carbohydrates,
                fats: acc.fats + macros.fat,
                sugar: acc.sugar + 0,
              };
            },
            { protein: 0, carbs: 0, fats: 0, sugar: 0 }
          );

          weekDataObj[day.fullDate] = dayMacros;
        }

        setWeekData(weekDataObj);
      } catch (error) {
        console.error("Error fetching week data:", error);
      }
    };

    fetchWeekData();
  }, [isContextLoading]);

  // Handler for clicking a day
  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  // Navigate to day detail view
  const viewDayDetails = () => {
    router.push({
      pathname: "/(tabs)/macros/day/[date]",
      params: { date: selectedDate },
    });
  };

  // Show loading screen when context is loading
  if (isContextLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkMode ? "#121212" : "#F2F2F7",
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
          Loading macros data...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#F2F2F7" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <StatusBar style={darkMode ? "light" : "dark"} />

      {/* Week Day Selector */}
      <View
        className={`flex-row justify-between mb-6 p-2 rounded-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.fullDate}
            onPress={() => handleDayPress(day.fullDate)}
            className={`items-center p-2 rounded-lg ${
              selectedDate === day.fullDate
                ? darkMode
                  ? "bg-blue-900"
                  : "bg-blue-100"
                : ""
            }`}
          >
            <Text
              className={`${
                darkMode ? "text-gray-400" : "text-gray-500"
              } text-xs font-medium`}
            >
              {day.formatted}
            </Text>
            <Text
              className={`text-base font-semibold mt-1 ${
                day.isToday
                  ? "text-blue-500"
                  : selectedDate === day.fullDate
                  ? darkMode
                    ? "text-white"
                    : "text-blue-800"
                  : darkMode
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {day.dayNumber}
            </Text>
            {day.isToday && (
              <View className="h-1 w-1 rounded-full bg-blue-500 mt-1" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Macros Ring */}
      <View
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 mb-6 shadow-sm`}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`font-semibold text-lg ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Daily Macros
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/macros/monthly")}
              className="bg-blue-100 px-3 py-1 rounded-lg mr-2"
            >
              <Text className="text-blue-800 font-medium">Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={viewDayDetails}
              className="bg-blue-100 px-3 py-1 rounded-lg"
            >
              <Text className="text-blue-800 font-medium">Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <Text
            className={`text-center py-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Loading...
          </Text>
        ) : (
          <MacroRings
            macros={macros}
            goals={goals}
            useGrams={useGrams}
            darkMode={darkMode}
          />
        )}
      </View>

      {/* Weekly Progress */}
      <View
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-4 mb-6 shadow-sm`}
      >
        <Text
          className={`font-semibold text-lg mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Weekly Progress
        </Text>

        <View className="space-y-4">
          {/* Protein Weekly */}
          <View>
            <View className="flex-row justify-between mb-1">
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Protein
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {Object.values(weekData).reduce(
                  (sum, day) => sum + day.protein,
                  0
                )}
                {useGrams ? "g" : "oz"} / {Number(macroGoals.protein) * 7}
                {useGrams ? "g" : "oz"}
              </Text>
            </View>
            <ProgressBar
              progress={Math.min(
                Object.values(weekData).reduce(
                  (sum, day) => sum + day.protein,
                  0
                ) /
                  (Number(macroGoals.protein) * 7),
                1
              )}
              color="#FF375F"
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? "#333333" : "#E5E5EA",
              }}
            />
          </View>

          {/* Carbs Weekly */}
          <View>
            <View className="flex-row justify-between mb-1">
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Carbs
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {Object.values(weekData).reduce(
                  (sum, day) => sum + day.carbs,
                  0
                )}
                {useGrams ? "g" : "oz"} / {Number(macroGoals.carbs) * 7}
                {useGrams ? "g" : "oz"}
              </Text>
            </View>
            <ProgressBar
              progress={Math.min(
                Object.values(weekData).reduce(
                  (sum, day) => sum + day.carbs,
                  0
                ) /
                  (Number(macroGoals.carbs) * 7),
                1
              )}
              color="#5E5CE6"
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? "#333333" : "#E5E5EA",
              }}
            />
          </View>

          {/* Fats Weekly */}
          <View>
            <View className="flex-row justify-between mb-1">
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Fats
              </Text>
              <Text
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {Object.values(weekData).reduce(
                  (sum, day) => sum + day.fats,
                  0
                )}
                {useGrams ? "g" : "oz"} / {Number(macroGoals.fats) * 7}
                {useGrams ? "g" : "oz"}
              </Text>
            </View>
            <ProgressBar
              progress={Math.min(
                Object.values(weekData).reduce(
                  (sum, day) => sum + day.fats,
                  0
                ) /
                  (Number(macroGoals.fats) * 7),
                1
              )}
              color="#FF9F0A"
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? "#333333" : "#E5E5EA",
              }}
            />
          </View>
        </View>
      </View>

      {/* Recent Entries Section - Skip showing dummy data */}
      <View
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-4 shadow-sm mb-6`}
      >
        <Text
          className={`font-semibold text-lg mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Recently Added
        </Text>

        {loading ? (
          <Text
            className={`text-center py-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Loading...
          </Text>
        ) : selectedDate === format(new Date(), "yyyy-MM-dd") ? (
          <>
            {fetchedEntries && fetchedEntries.length > 0 ? (
              <ScrollView
                style={{ maxHeight: 200 }}
                showsVerticalScrollIndicator={true}
                className="space-y-2"
              >
                <View className="space-y-2">
                  {fetchedEntries.map((entry) => (
                    <View
                      key={entry.id}
                      className={`flex-row justify-between items-center p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <View>
                        <Text
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {entry.foodItem?.name || "Food Item"}
                        </Text>
                        <Text
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {format(new Date(entry.timestamp), "h:mm a")}
                        </Text>
                      </View>
                      <Text
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {entry.foodItem?.nutrition?.calories || 0} cal
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text
                className={`text-center py-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No entries added today
              </Text>
            )}
          </>
        ) : (
          <Text
            className={`text-center py-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Select today's date to see recent entries
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
