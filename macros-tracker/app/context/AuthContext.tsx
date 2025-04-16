import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const defaultValues: AuthContextType = {
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>(defaultValues);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app startup
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("@user_token");
        if (value !== null) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
    // This is a placeholder for the actual login logic
    // The backend team will implement the actual authentication here
    try {
      setIsLoading(true);

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just store a dummy token
      await AsyncStorage.setItem("@user_token", "dummy-token");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("@user_token");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
