import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Automotive' | 'Industrial' | 'Furniture' | 'Custom Projects';
  finishType: 'Glossy' | 'Matte' | 'Metallic' | 'Textured' | 'Custom';
  color: string;
  imageBefore: string;
  imageAfter: string;
  clientType: string;
  material: string;
  duration: string;
  specialTechniques: string[];
  testimonial?: {
    author: string;
    text: string;
    rating: number;
  };
  videoUrl?: string;
}

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={project.imageBefore} alt="Before" />}
            itemTwo={<ReactCompareSliderImage src={project.imageAfter} alt="After" />}
            className="w-full h-[400px] rounded-lg overflow-hidden"
          />
          {project.videoUrl && (
            <div className="aspect-w-16 aspect-h-9">
              <video
                src={project.videoUrl}
                controls
                className="rounded-lg w-full"
                poster={project.imageAfter}
              >
                <track kind="captions" />
              </video>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
            <p className="mt-2 text-gray-600">{project.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Project Details</h4>
              <p><span className="text-gray-600">Category:</span> {project.category}</p>
              <p><span className="text-gray-600">Client Type:</span> {project.clientType}</p>
              <p><span className="text-gray-600">Duration:</span> {project.duration}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Technical Specs</h4>
              <p><span className="text-gray-600">Material:</span> {project.material}</p>
              <p><span className="text-gray-600">Finish:</span> {project.finishType}</p>
              <p><span className="text-gray-600">Color:</span> {project.color}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Special Techniques Used</h4>
            <ul className="list-disc list-inside space-y-1">
              {project.specialTechniques.map((technique, index) => (
                <li key={index} className="text-gray-600">{technique}</li>
              ))}
            </ul>
          </div>

          {project.testimonial && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                {[...Array(project.testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-gray-600">"{project.testimonial.text}"</p>
              <p className="mt-2 font-semibold">- {project.testimonial.author}</p>
            </div>
          )}

          <button
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/quote?project=' + project.id}
          >
            Request Similar Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 