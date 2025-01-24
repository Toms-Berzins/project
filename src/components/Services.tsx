import { SprayCan as Spray, Shield, Clock, Sparkles, PaintBucket, Droplets } from 'lucide-react';
import { ReactNode } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  imageUrl: string;
}

function ServiceCard({ title, description, icon, imageUrl }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg w-fit">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-200 mb-4">{description}</p>
        <button className="mt-auto w-full bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-lg transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default function Services() {
  const services = [
    {
      title: 'Custom Powder Coating',
      description: 'Professional coating services with a wide range of colors and finishes.',
      icon: <Spray className="w-6 h-6 text-white" />,
      imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80'
    },
    {
      title: 'Protective Finishes',
      description: 'Durable protection against corrosion, wear, and environmental damage.',
      icon: <Shield className="w-6 h-6 text-white" />,
      imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80'
    },
    {
      title: 'Quick Turnaround',
      description: '24-48 hour service available for urgent coating needs.',
      icon: <Clock className="w-6 h-6 text-white" />,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
    },
    {
      title: 'Decorative Finishes',
      description: 'Premium metallic, textured, and custom effect coatings.',
      icon: <Sparkles className="w-6 h-6 text-white" />,
      imageUrl: 'https://images.unsplash.com/photo-1584277261846-c6a1672ed979?auto=format&fit=crop&q=80'
    },
    {
      title: 'Industrial Coating',
      description: 'Large-scale coating solutions for industrial equipment.',
      icon: <PaintBucket className="w-6 h-6 text-white" />,
      imageUrl: 'https://images.unsplash.com/photo-1565034946487-077786996e27?auto=format&fit=crop&q=80'
    },
    {
      title: 'Eco-Friendly Process',
      description: 'Environmentally conscious coating methods and materials.',
      icon: <Droplets className="w-6 h-6 text-white" />,
      imageUrl: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional powder coating services tailored to your needs. From custom colors to industrial applications.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}