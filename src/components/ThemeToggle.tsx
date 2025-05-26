import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeProvider";

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="p-2 rounded-full hover:bg-primary/10 transition relative cursor-pointer"
    >
      {isDarkMode ? <Icon icon="mdi:weather-sunny" className="h-6 w-6 text-yellow-400" /> : <Icon icon="mdi:moon-waning-crescent" className="h-6 w-6 text-indigo-600" />}

    </button>
  );
};
