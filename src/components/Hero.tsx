import { ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SocialFeed from './blog/SocialFeed';
import '../styles/sections.css';

export default function Hero() {
  const location = useLocation();

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = '/#portfolio';
      return;
    }
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative section-pattern">
      {/* Hero Section */}
      <div className="hero-gradient min-h-[70vh] flex items-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="max-w-xl">
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Premium Powder Coating Solutions
            </h1>
            <p className="hero-description text-xl text-gray-600 dark:text-gray-300 mb-8">
              Transform your metal surfaces with our professional powder coating services. 
              Durable, beautiful, and environmentally friendly.
            </p>
            
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <Link
                to="/quote"
                className="hover-lift inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button
                onClick={handlePortfolioClick}
                className="hover-lift inline-flex items-center justify-center px-6 py-3 border border-gray-900 dark:border-white text-base font-medium rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Social Feed Section */}
      <div className="section-pattern py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Latest From Our Workshop
            </h2>
            <p className="hero-description text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay updated with our recent projects and transformations. Follow us on social media for more inspiration.
            </p>
          </div>
          
          {/* Social Feed Grid */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 opacity-50 pointer-events-none" />
            <div className="social-feed-grid">
              <SocialFeed 
                limit={3} 
                className="relative z-10" 
              />
            </div>
          </div>

          <div className="text-center mt-12 lg:mt-16">
            <Link 
              to="/blog"
              className="hover-lift inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
            >
              View All Updates
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}