"use client";

import { useEffect } from "react";

const THEME_KEY = "cr_settings_theme";

function applyTheme(themeId: string | null) {
  const theme = themeId && themeId.trim().length ? themeId : "neon-blue";
  document.documentElement.dataset.theme = theme;
}

export function ThemeSync() {
  useEffect(() => {
    applyTheme(localStorage.getItem(THEME_KEY));

    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) return;
      applyTheme(event.newValue);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
