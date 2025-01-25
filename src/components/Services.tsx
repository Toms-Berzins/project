import { SprayCan as Spray, Shield, Clock } from 'lucide-react';
import { ReactNode } from 'react';
import '../styles/sections.css';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  imageUrl: string;
}

function ServiceCard({ title, description, icon, imageUrl }: ServiceCardProps) {
  return (
    <div className="service-card group relative overflow-hidden rounded-2xl glass-effect dark:glass-effect-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent z-10 dark:from-black/90 dark:via-black/50"></div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
      </div>
      <div className="relative z-10 p-8 h-full flex flex-col min-h-[400px]">
        <div className="service-icon mb-6 p-4 bg-orange-500/10 backdrop-blur-md rounded-xl w-fit 
          ring-1 ring-orange-500/20 transform transition-all duration-300 
          group-hover:bg-orange-500/20 group-hover:ring-orange-500/30 dark:bg-orange-500/20">
          {icon}
        </div>
        <div className="mt-auto">
          <h3 className="text-2xl font-bold text-white mb-3 transform transition-all duration-300 
            group-hover:translate-x-2">{title}</h3>
          <p className="text-gray-300 mb-6 transform transition-all duration-300 
            group-hover:translate-x-2">{description}</p>
          <button className="hover-lift w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 px-6 rounded-xl 
            transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 dark:shadow-orange-500/10">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const services = [
    {
      title: 'Custom Powder Coating',
      description: 'Transform your metal surfaces with our professional powder coating services. Choose from a wide spectrum of colors and finishes.',
      icon: <Spray className="w-7 h-7 text-orange-500" />,
      imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80'
    },
    {
      title: 'Protective Finishes',
      description: 'Shield your valuable metal assets with our durable protective coatings, designed to withstand harsh environmental conditions.',
      icon: <Shield className="w-7 h-7 text-orange-500" />,
      imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80'
    },
    {
      title: 'Quick Turnaround',
      description: 'Experience efficient service with our quick turnaround times, without compromising on quality or attention to detail.',
      icon: <Clock className="w-7 h-7 text-orange-500" />,
      imageUrl: 'https://images.unsplash.com/photo-1597846261332-b972f5736ecf?auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="section-pattern py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Services
          </h2>
          <p className="hero-description text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our comprehensive range of powder coating services, designed to deliver exceptional results for your projects.
          </p>
        </div>
        
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
}