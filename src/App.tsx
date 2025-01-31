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
import Particles from './components/effects/Particles';
import WorkshopUpdates from './components/WorkshopUpdates';

export function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <WorkshopUpdates />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-primary relative">
      <div className="absolute inset-0 overflow-hidden">
        <Particles />
      </div>
      <div className="relative flex flex-col min-h-screen">
        <Navigation />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

App.HomePage = HomePage;
export default App;