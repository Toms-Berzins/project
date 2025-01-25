import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      data-theme={darkMode ? 'dark' : 'light'}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-gray-800" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
}