import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { Svg, Circle, G } from "react-native-svg";

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

export default function DayMacrosScreen() {
  const { date } = useLocalSearchParams();
  const formattedDate = date
    ? format(new Date(date as string), "MMMM d, yyyy")
    : "";

  // Mock data for the selected day
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
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      {/* Date Header */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          textAlign: "center",
          marginVertical: 16,
        }}
      >
        {formattedDate}
      </Text>

      {/* Activity Rings */}
      <View style={{ backgroundColor: "white", marginBottom: 20 }}>
        <MacroRings macros={macros} goals={goals} />
      </View>
    </ScrollView>
  );
}
