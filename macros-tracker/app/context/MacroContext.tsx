import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  DatabaseService,
  MacroGoals,
  DEFAULT_MACRO_GOALS,
  UserPreferences,
  DEFAULT_USER_PREFERENCES,
} from "../../services/database";

interface MacroContextType {
  macroGoals: MacroGoals;
  updateMacroGoals: (goals: Partial<MacroGoals>) => void;
  useGrams: boolean;
  toggleUseGrams: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const defaultValues: MacroContextType = {
  macroGoals: DEFAULT_MACRO_GOALS,
  updateMacroGoals: () => {},
  useGrams: true,
  toggleUseGrams: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
  isLoading: true,
};

const MacroContext = createContext<MacroContextType>(defaultValues);

export function MacroProvider({ children }: { children: ReactNode }) {
  const [macroGoals, setMacroGoals] = useState<MacroGoals>(DEFAULT_MACRO_GOALS);
  const [useGrams, setUseGrams] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const db = DatabaseService.getInstance();
        await db.connect();

        // Load macro goals
        const savedGoals = await db.getMacroGoals();
        setMacroGoals(savedGoals);

        // Load preferences
        const savedPreferences = await db.getUserPreferences();
        setUseGrams(savedPreferences.useGrams);
        setDarkMode(savedPreferences.darkMode);
      } catch (error) {
        console.error("Failed to load data from database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update macro goals in state and database
  const updateMacroGoals = async (goals: Partial<MacroGoals>) => {
    const updatedGoals = { ...macroGoals, ...goals };
    setMacroGoals(updatedGoals);

    try {
      const db = DatabaseService.getInstance();
      await db.saveMacroGoals(updatedGoals);
    } catch (error) {
      console.error("Failed to save macro goals to database:", error);
    }
  };

  // Toggle useGrams and save to database
  const toggleUseGrams = async () => {
    const newValue = !useGrams;
    setUseGrams(newValue);

    try {
      const db = DatabaseService.getInstance();
      await db.saveUserPreferences({
        useGrams: newValue,
        darkMode,
      });
    } catch (error) {
      console.error("Failed to save useGrams preference:", error);
    }
  };

  // Toggle darkMode and save to database
  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);

    try {
      const db = DatabaseService.getInstance();
      await db.saveUserPreferences({
        useGrams,
        darkMode: newValue,
      });
    } catch (error) {
      console.error("Failed to save darkMode preference:", error);
    }
  };

  return (
    <MacroContext.Provider
      value={{
        macroGoals,
        updateMacroGoals,
        useGrams,
        toggleUseGrams,
        darkMode,
        toggleDarkMode,
        isLoading,
      }}
    >
      {children}
    </MacroContext.Provider>
  );
}

export const useMacroContext = () => useContext(MacroContext);
