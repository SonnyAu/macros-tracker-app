import { createContext, useContext, useState, ReactNode } from "react";

interface MacroGoals {
  protein: string;
  carbs: string;
  fats: string;
  sugar: string;
}

interface MacroContextType {
  macroGoals: MacroGoals;
  updateMacroGoals: (goals: Partial<MacroGoals>) => void;
  useGrams: boolean;
  toggleUseGrams: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const defaultValues: MacroContextType = {
  macroGoals: {
    protein: "150",
    carbs: "300",
    fats: "100",
    sugar: "50",
  },
  updateMacroGoals: () => {},
  useGrams: true,
  toggleUseGrams: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
};

const MacroContext = createContext<MacroContextType>(defaultValues);

export function MacroProvider({ children }: { children: ReactNode }) {
  const [macroGoals, setMacroGoals] = useState<MacroGoals>(
    defaultValues.macroGoals
  );
  const [useGrams, setUseGrams] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const updateMacroGoals = (goals: Partial<MacroGoals>) => {
    setMacroGoals((prev) => ({ ...prev, ...goals }));
  };

  const toggleUseGrams = () => setUseGrams((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <MacroContext.Provider
      value={{
        macroGoals,
        updateMacroGoals,
        useGrams,
        toggleUseGrams,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </MacroContext.Provider>
  );
}

export const useMacroContext = () => useContext(MacroContext);
