import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/portfolio/Portfolio';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import { useEffect } from 'react';

export function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

function App() {
  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

App.HomePage = HomePage;
export default App;