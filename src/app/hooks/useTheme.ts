import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme-dark";

// Shared across pages via localStorage so the dark/light choice persists
// when navigating between the main portfolio and other routes.
export function useTheme(defaultDark = true) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? defaultDark : stored === "true";
    } catch {
      return defaultDark;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist.
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
