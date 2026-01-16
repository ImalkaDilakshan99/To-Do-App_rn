import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// AsyncStorage is React Native’s simple, promise-based API for persisting small bits of data on a user’s device. Think of it as the mobile-app equivalent of the browser’s localStorage, but asynchronous and cross-platform.

export interface ColorScheme {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  gradients: {
    background: [string, string];
    surface: [string, string];
    primary: [string, string];
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
  };
  backgrounds: {
    input: string;
    editInput: string;
  };
  statusBarStyle: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#e8f4f8",
  surface: "#ffffff",
  text: "#0a2540",
  textMuted: "#5e7a91",
  border: "#c7e0ea",
  primary: "#0891b2",
  success: "#14b8a6",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: "#000000",
  gradients: {
    background: ["#e0f2fe", "#bae6fd"],
    surface: ["#ffffff", "#f0f9ff"],
    primary: ["#06b6d4", "#0891b2"],
    success: ["#14b8a6", "#0d9488"],
    warning: ["#fbbf24", "#f59e0b"],
    danger: ["#f87171", "#ef4444"],
    muted: ["#94a3b8", "#64748b"],
    empty: ["#e0f2fe", "#bae6fd"],
  },
  backgrounds: {
    input: "#f0f9ff",
    editInput: "#ffffff",
  },
  statusBarStyle: "dark-content" as const,
};

const darkColors: ColorScheme = {
  bg: "#0a1929",
  surface: "#132f4c",
  text: "#e3f2fd",
  textMuted: "#81a4cd",
  border: "#1e3a5f",
  primary: "#22d3ee",
  success: "#2dd4bf",
  warning: "#fbbf24",
  danger: "#f87171",
  shadow: "#000000",
  gradients: {
    background: ["#0a1929", "#132f4c"],
    surface: ["#132f4c", "#1e3a5f"],
    primary: ["#06b6d4", "#0891b2"],
    success: ["#14b8a6", "#0d9488"],
    warning: ["#fbbf24", "#f59e0b"],
    danger: ["#f87171", "#ef4444"],
    muted: ["#1e3a5f", "#2d4f72"],
    empty: ["#164e63", "#155e75"],
  },
  backgrounds: {
    input: "#1a3149",
    editInput: "#0f2438",
  },
  statusBarStyle: "light-content" as const,
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorScheme;
}

const ThemeContext = createContext<undefined | ThemeContextType>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // get the user's choice
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value) setIsDarkMode(JSON.parse(value));
    });
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default useTheme;