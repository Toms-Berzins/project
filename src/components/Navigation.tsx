import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavigation = (to: string) => {
    setIsOpen(false);
    if (to.startsWith('/#')) {
      // If we're not on the homepage, navigate there first
      if (location.pathname !== '/') {
        window.location.href = to;
        return;
      }
      // Handle section scrolling
      const element = document.getElementById(to.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Services', to: '/#services' },
    { name: 'Portfolio', to: '/#portfolio' },
    { name: 'Blog', to: '/blog' },
    { name: 'Contact', to: '/#contact' },
  ];

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2D3748] to-[#4A5568] rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">PowderPro</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.to.startsWith('/#') ? (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.to)}
                  className="text-gray-700 dark:text-gray-300 hover:text-[#ED8936] dark:hover:text-[#ED8936] transition-colors"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-gray-700 dark:text-gray-300 hover:text-[#ED8936] dark:hover:text-[#ED8936] transition-colors"
                >
                  {item.name}
                </Link>
              )
            ))}
            <ThemeToggle />
            <Link
              to="/quote"
              className="bg-[#ED8936] text-white px-4 py-2 rounded-lg hover:bg-[#DD7926] transition-colors"
            >
              Get Quote
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
            {navItems.map((item) => (
              item.to.startsWith('/#') ? (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.to)}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#ED8936] dark:hover:text-[#ED8936] transition-colors"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.to}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#ED8936] dark:hover:text-[#ED8936] transition-colors"
                >
                  {item.name}
                </Link>
              )
            ))}
            <Link
              to="/quote"
              className="block px-3 py-2 bg-[#ED8936] text-white rounded-lg hover:bg-[#DD7926] transition-colors mt-2"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}