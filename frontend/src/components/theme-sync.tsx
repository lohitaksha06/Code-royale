"use client";

import { useEffect, useCallback } from "react";

const THEME_KEY = "cr_settings_theme";

function applyTheme(themeId: string | null) {
  const theme = themeId && themeId.trim().length ? themeId : "neon-blue";
  document.documentElement.dataset.theme = theme;
  // Force a style recalculation
  document.documentElement.style.setProperty('--theme-updated', Date.now().toString());
}

export function ThemeSync() {
  const syncTheme = useCallback(() => {
    applyTheme(localStorage.getItem(THEME_KEY));
  }, []);

  useEffect(() => {
    // Apply theme immediately on mount
    syncTheme();

    // Listen for storage changes from other tabs
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) return;
      applyTheme(event.newValue);
    };

    // Listen for custom theme change events within the same tab
    const onThemeChange = () => {
      syncTheme();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("themechange", onThemeChange);
    
    // Also check periodically in case localStorage was updated
    const interval = setInterval(syncTheme, 500);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("themechange", onThemeChange);
      clearInterval(interval);
    };
  }, [syncTheme]);

  return null;
}

// Helper to change theme and notify
export function setTheme(themeId: string) {
  localStorage.setItem(THEME_KEY, themeId);
  document.documentElement.dataset.theme = themeId;
  window.dispatchEvent(new Event("themechange"));
}
