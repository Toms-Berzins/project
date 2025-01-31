import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    // Always apply dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Return null since we don't need the toggle button anymore
  return null;
}