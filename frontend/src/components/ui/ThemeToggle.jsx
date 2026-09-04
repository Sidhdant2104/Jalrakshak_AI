import { Icon } from "./Icons";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle({ compact = false }) {
  const [theme, setTheme, toggleTheme] = useTheme();

  if (compact) {
    const next = theme === "light" ? "dark" : "light";
    return (
      <button
        type="button"
        className="icon-action theme-action"
        aria-label={`Switch to ${next} mode`}
        title={`Switch to ${next} mode`}
        onClick={toggleTheme}
      >
        <Icon name={theme === "light" ? "moon" : "sun"} size={16} />
      </button>
    );
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        className={theme === "light" ? "on" : ""}
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <Icon name="sun" size={13} />
        Light
      </button>
      <button
        type="button"
        className={theme === "dark" ? "on" : ""}
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <Icon name="moon" size={13} />
        Dark
      </button>
    </div>
  );
}
