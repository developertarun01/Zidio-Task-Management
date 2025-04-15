import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md transition-all"
    >
      {dark ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
    </button>
  );
};

export default ThemeToggle;
