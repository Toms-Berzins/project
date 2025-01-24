import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import './Portfolio.css';

interface Project {
  id: number;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Vintage Car Restoration',
    category: 'Automotive',
    beforeImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80',
    description: 'Complete restoration of a classic car with custom powder coating finish.'
  },
  {
    id: 2,
    title: 'Industrial Equipment',
    category: 'Industrial',
    beforeImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80',
    description: 'Heavy-duty protective coating for industrial machinery.'
  },
  {
    id: 3,
    title: 'Custom Furniture',
    category: 'Furniture',
    beforeImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80',
    description: 'Modern furniture pieces with designer powder coating finishes.'
  }
];

const categories = ['All', 'Automotive', 'Industrial', 'Furniture'];

function BeforeAfterSlider({ beforeImage, afterImage }: { beforeImage: string; afterImage: string }) {
  const [position, setPosition] = useState(50);

  return (
    <div 
      className="before-after-container"
    >
      <div className="after-image">
        <img src={afterImage} alt="After powder coating" className="slider-image" />
      </div>
      <div className="before-image">
        <img src={beforeImage} alt="Before powder coating" className="slider-image" />
      </div>
      <div className="slider-handle">
        <div className="slider-line"></div>
        <div className="slider-button">
          <ChevronLeft className="slider-chevron" aria-hidden="true" />
          <ChevronRight className="slider-chevron" aria-hidden="true" />
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="slider-input"
        aria-label="Adjust before/after image slider"
        title="Slide to compare before and after images"
      />
    </div>
  );
}

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our recent powder coating projects and transformations.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group relative">
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setSelectedProject(project)}
                  title="View Project"
                  className="p-3 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform"
                >
                  <ZoomIn className="w-6 h-6 text-gray-900" />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <BeforeAfterSlider
              beforeImage={selectedProject.beforeImage}
              afterImage={selectedProject.afterImage}
            />
            <div className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}