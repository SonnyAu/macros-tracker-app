import { NutritionData } from "../types/nutrition";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Macro goals interface
export interface MacroGoals {
  protein: string;
  carbs: string;
  fats: string;
  sugar: string;
}

// Default macro goals
export const DEFAULT_MACRO_GOALS: MacroGoals = {
  protein: "150",
  carbs: "300",
  fats: "100",
  sugar: "50",
};

// Database keys
const KEYS = {
  USERS: "@macros-tracker:users",
  CURRENT_USER: "@macros-tracker:current-user",
  getUserFoodEntries: (userId: string) =>
    `@macros-tracker:${userId}:food-entries`,
  getUserFoodEntriesByDate: (userId: string, date: string) =>
    `@macros-tracker:${userId}:food-entries:${date}`,
  getUserMacroGoals: (userId: string) =>
    `@macros-tracker:${userId}:macro-goals`,
  getUserPreferences: (userId: string) =>
    `@macros-tracker:${userId}:preferences`,
};

// Food entry with timestamp
export interface FoodEntry extends NutritionData {
  id: string;
  timestamp: string;
  date: string; // YYYY-MM-DD format for easy querying
}

// User preferences interface
export interface UserPreferences {
  useGrams: boolean;
  darkMode: boolean;
}

// Default user preferences
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  useGrams: true,
  darkMode: false,
};

// Database service for managing food data
export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected: boolean = false;
  private currentUser: User | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      // Check if we have a current user
      const currentUserJson = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      if (currentUserJson) {
        this.currentUser = JSON.parse(currentUserJson);
      } else {
        // Create a default user if none exists
        const defaultUser: User = {
          id: "default-user",
          name: "Default User",
          email: "user@example.com",
          createdAt: new Date().toISOString(),
        };

        // Save the default user
        await this.saveUser(defaultUser);

        // Set as current user
        await this.setCurrentUser(defaultUser.id);

        // Initialize default macro goals for the new user
        await this.saveMacroGoals(DEFAULT_MACRO_GOALS);

        // Initialize default preferences for the new user
        await this.saveUserPreferences(DEFAULT_USER_PREFERENCES);
      }

      this.isConnected = true;
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    this.currentUser = null;
  }

  private async saveUser(user: User): Promise<void> {
    try {
      // Get existing users
      const usersJson = await AsyncStorage.getItem(KEYS.USERS);
      let users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if user already exists
      const existingUserIndex = users.findIndex((u) => u.id === user.id);

      if (existingUserIndex >= 0) {
        // Update existing user
        users[existingUserIndex] = user;
      } else {
        // Add new user
        users.push(user);
      }

      // Save updated users list
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  public async setCurrentUser(userId: string): Promise<void> {
    try {
      // Get all users
      const usersJson = await AsyncStorage.getItem(KEYS.USERS);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Find the user with the given ID
      const user = users.find((u) => u.id === userId);

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Set as current user
      this.currentUser = user;
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting current user:", error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  public async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  // Save macro goals for the current user
  public async saveMacroGoals(goals: MacroGoals): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    if (!this.currentUser) {
      throw new Error("No current user");
    }

    try {
      const key = KEYS.getUserMacroGoals(this.currentUser.id);
      await AsyncStorage.setItem(key, JSON.stringify(goals));
    } catch (error) {
      console.error("Error saving macro goals:", error);
      throw error;
    }
  }

  // Get macro goals for the current user
  public async getMacroGoals(): Promise<MacroGoals> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    if (!this.currentUser) {
      throw new Error("No current user");
    }

    try {
      const key = KEYS.getUserMacroGoals(this.currentUser.id);
      const goalsJson = await AsyncStorage.getItem(key);

      if (!goalsJson) {
        // If no goals exist yet, save and return defaults
        await this.saveMacroGoals(DEFAULT_MACRO_GOALS);
        return DEFAULT_MACRO_GOALS;
      }

      return JSON.parse(goalsJson);
    } catch (error) {
      console.error("Error getting macro goals:", error);
      // Return defaults on error
      return DEFAULT_MACRO_GOALS;
    }
  }

  // Save user preferences (useGrams, darkMode, etc.)
  public async saveUserPreferences(
    preferences: UserPreferences
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    if (!this.currentUser) {
      throw new Error("No current user");
    }

    try {
      const key = KEYS.getUserPreferences(this.currentUser.id);
      await AsyncStorage.setItem(key, JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving user preferences:", error);
      throw error;
    }
  }

  // Get user preferences
  public async getUserPreferences(): Promise<UserPreferences> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    if (!this.currentUser) {
      throw new Error("No current user");
    }

    try {
      const key = KEYS.getUserPreferences(this.currentUser.id);
      const preferencesJson = await AsyncStorage.getItem(key);

      if (!preferencesJson) {
        // If no preferences exist yet, save and return defaults
        await this.saveUserPreferences(DEFAULT_USER_PREFERENCES);
        return DEFAULT_USER_PREFERENCES;
      }

      return JSON.parse(preferencesJson);
    } catch (error) {
      console.error("Error getting user preferences:", error);
      // Return defaults on error
      return DEFAULT_USER_PREFERENCES;
    }
  }

  // Save a food entry for the current user on a specific date
  public async saveFoodEntry(
    nutritionData: NutritionData,
    date?: Date
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    if (!this.currentUser) {
      throw new Error("No current user");
    }

    try {
      const entryDate = date || new Date();
      const dateString = format(entryDate, "yyyy-MM-dd");

      // Create a food entry with timestamp and ID
      const foodEntry: FoodEntry = {
        ...nutritionData,
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: entryDate.toISOString(),
        date: dateString,
      };

      // Get existing entries for this date
      const key = KEYS.getUserFoodEntriesByDate(
        this.currentUser.id,
        dateString
      );
      const entriesJson = await AsyncStorage.getItem(key);
      const entries: FoodEntry[] = entriesJson ? JSON.parse(entriesJson) : [];

      // Add new entry
      entries.push(foodEntry);

      // Save updated entries
      await AsyncStorage.setItem(key, JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving food entry:", error);
      throw error;
    }
  }

  // Get food entries for a specific date
  public async getFoodEntriesByDate(date: Date): Promise<FoodEntry[]> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    if (!this.currentUser) {
      throw new Error("No current user");
    }

    try {
      const dateString = format(date, "yyyy-MM-dd");
      const key = KEYS.getUserFoodEntriesByDate(
        this.currentUser.id,
        dateString
      );

      const entriesJson = await AsyncStorage.getItem(key);

      if (!entriesJson) {
        return []; // No entries for this date
      }

      return JSON.parse(entriesJson);
    } catch (error) {
      console.error("Error getting food entries:", error);
      throw error;
    }
  }

  // Get food history within a date range
  public async getFoodHistory(
    startDate: Date,
    endDate: Date
  ): Promise<FoodEntry[]> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    if (!this.currentUser) {
      throw new Error("No current user");
    }

    try {
      // Get all keys
      const allKeys = await AsyncStorage.getAllKeys();

      // Filter keys for the current user's food entries
      const userPrefix = `@macros-tracker:${this.currentUser.id}:food-entries:`;
      const relevantKeys = allKeys.filter(
        (key) =>
          key.startsWith(userPrefix) &&
          key.substring(userPrefix.length) >= format(startDate, "yyyy-MM-dd") &&
          key.substring(userPrefix.length) <= format(endDate, "yyyy-MM-dd")
      );

      if (relevantKeys.length === 0) {
        return [];
      }

      // Get all entries
      const allEntriesJson = await AsyncStorage.multiGet(relevantKeys);

      // Combine all entries
      let allEntries: FoodEntry[] = [];

      allEntriesJson.forEach(([, entriesJson]) => {
        if (entriesJson) {
          const entries: FoodEntry[] = JSON.parse(entriesJson);
          allEntries = [...allEntries, ...entries];
        }
      });

      // Sort by timestamp (newest first)
      return allEntries.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error("Error getting food history:", error);
      throw error;
    }
  }

  // Clear all data for testing
  public async clearAll(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter((key) =>
        key.startsWith("@macros-tracker:")
      );

      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
      }

      this.currentUser = null;
      this.isConnected = false;
    } catch (error) {
      console.error("Error clearing database:", error);
      throw error;
    }
  }
}
