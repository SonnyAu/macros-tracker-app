import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { format, parseISO } from "date-fns";
import { Svg, Circle, G } from "react-native-svg";
import { useState, useEffect } from "react";
import { useMacroContext } from "../../../context/MacroContext";
import { DatabaseService, FoodEntry } from "../../../../services/database";

interface MacroData {
  protein: number;
  carbs: number;
  fats: number;
  sugar: number;
}

function MacroRings({
  macros,
  goals,
}: {
  macros: MacroData;
  goals: MacroData;
}) {
  const { darkMode, useGrams } = useMacroContext();

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

export default function DayMacrosScreen() {
  const { date } = useLocalSearchParams();
  const {
    macroGoals,
    isLoading: isContextLoading,
    darkMode,
  } = useMacroContext();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [macros, setMacros] = useState<MacroData>({
    protein: 0,
    carbs: 0,
    fats: 0,
    sugar: 0,
  });

  const parsedDate = date ? parseISO(date as string) : new Date();
  const formattedDate = format(parsedDate, "MMMM d, yyyy");

  // Only attempt to fetch entries after the context has loaded
  useEffect(() => {
    if (isContextLoading) return;

    const fetchEntries = async () => {
      try {
        setLoading(true);
        const db = DatabaseService.getInstance();
        await db.connect();

        const fetchedEntries = await db.getFoodEntriesByDate(parsedDate);
        setEntries(fetchedEntries);

        // Calculate total macros
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

    fetchEntries();
  }, [date, isContextLoading]);

  // Convert string values to numbers for calculations
  const goals = {
    protein: Number(macroGoals.protein),
    carbs: Number(macroGoals.carbs),
    fats: Number(macroGoals.fats),
    sugar: Number(macroGoals.sugar),
  };

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
          style={{ marginTop: 16, color: darkMode ? "#ffffff" : "#000000" }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#F2F2F7" }}
    >
      {/* Activity Rings */}
      <View
        style={{
          backgroundColor: darkMode ? "#1e1e1e" : "white",
          margin: 16,
          padding: 16,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 10,
            textAlign: "center",
            color: darkMode ? "#ffffff" : "#000000",
          }}
        >
          Macros Summary
        </Text>
        <MacroRings macros={macros} goals={goals} />
      </View>

      {/* Food Entries */}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 16,
            color: darkMode ? "#ffffff" : "#000000",
          }}
        >
          Food Entries
        </Text>

        {loading ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator
              size="small"
              color={darkMode ? "#60a5fa" : "#3b82f6"}
            />
            <Text
              style={{
                textAlign: "center",
                marginTop: 10,
                color: darkMode ? "#aaaaaa" : "#666666",
              }}
            >
              Loading entries...
            </Text>
          </View>
        ) : entries.length > 0 ? (
          entries.map((entry) => (
            <View
              key={entry.id}
              style={{
                backgroundColor: darkMode ? "#1e1e1e" : "white",
                padding: 16,
                marginVertical: 8,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: darkMode ? "#ffffff" : "#000000",
                }}
              >
                {entry.foodItem.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: darkMode ? "#aaaaaa" : "#888" }}>
                  Serving: {entry.foodItem.servingSize.amount}
                  {entry.foodItem.servingSize.unit}
                </Text>
                <Text
                  style={{
                    fontWeight: "600",
                    color: darkMode ? "#ffffff" : "#000000",
                  }}
                >
                  {entry.foodItem.nutrition.calories} cals
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: darkMode ? "#dddddd" : "#333333" }}>
                  Protein: {entry.foodItem.nutrition.macros.protein}g
                </Text>
                <Text style={{ color: darkMode ? "#dddddd" : "#333333" }}>
                  Carbs: {entry.foodItem.nutrition.macros.carbohydrates}g
                </Text>
                <Text style={{ color: darkMode ? "#dddddd" : "#333333" }}>
                  Fat: {entry.foodItem.nutrition.macros.fat}g
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View
            style={{
              backgroundColor: darkMode ? "#1e1e1e" : "white",
              padding: 20,
              marginVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: darkMode ? "#aaaaaa" : "#888",
                textAlign: "center",
              }}
            >
              No food entries for this day
            </Text>
            <Text
              style={{
                color: darkMode ? "#aaaaaa" : "#888",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Use the scanner to add food or log a meal manually
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
