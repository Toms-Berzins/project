import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center space-x-6">
            <Link
              to="/privacy-policy"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
} 