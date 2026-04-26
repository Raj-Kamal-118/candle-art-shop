"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("artisan-theme") as Theme | null;
    const preferred: Theme = stored === "dark" ? "dark" : "light";
    setTheme(preferred);
    document.documentElement.classList.toggle("dark", preferred === "dark");
  }, []);

  const toggle = () => {
    // Add a global class to force slow transitions simulating a sunset/sunrise
    document.documentElement.classList.add("theme-transition-active");

    // Clear any existing timeout if clicked rapidly
    if ((window as any).themeTransitionTimeout) {
      clearTimeout((window as any).themeTransitionTimeout);
    }

    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("artisan-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });

    // Remove the transition class after the animation completes (with a tiny 50ms buffer to prevent snapping)
    (window as any).themeTransitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("theme-transition-active");
    }, 750);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
        .theme-transition-active,
        .theme-transition-active *,
        .theme-transition-active *::before,
        .theme-transition-active *::after {
          transition-property: background, background-color, background-image, border-color, outline-color, text-decoration-color, color, fill, stroke, opacity, box-shadow, text-shadow !important;
          transition-duration: 0.7s !important;
          transition-timing-function: ease-in-out !important;
        }
      `,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
