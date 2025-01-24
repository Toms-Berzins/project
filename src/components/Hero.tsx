import { ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
    <div className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1562204839-c229422bbe88?auto=format&fit=crop&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Premium Powder Coating Solutions
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Transform your metal surfaces with our professional powder coating services. 
            Durable, beautiful, and environmentally friendly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#ED8936] hover:bg-[#DD7926] transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button
              onClick={handlePortfolioClick}
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}