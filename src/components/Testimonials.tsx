import { Star, Youtube, Play } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  projectType: string;
  videoUrl?: string;
}

interface ReviewFormData {
  name: string;
  rating: number;
  content: string;
  projectType: string;
  image?: File;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Custom Car Enthusiast',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    content: 'The quality of powder coating on my vintage car restoration project exceeded all expectations. The finish is flawless and has held up perfectly.',
    rating: 5,
    projectType: 'Automotive',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    content: 'I regularly use PowderPro for my custom furniture projects. Their attention to detail and color matching is outstanding.',
    rating: 5,
    projectType: 'Custom',
    videoUrl: 'https://www.youtube.com/embed/example1',
  },
  {
    id: 3,
    name: 'Mike Anderson',
    role: 'Industrial Equipment Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    content: 'Their industrial coating services have significantly extended the life of our equipment. Great service and professional team.',
    rating: 5,
    projectType: 'Industrial',
  },
];

const projectTypes = ['All', 'Automotive', 'Industrial', 'Custom'];

export default function Testimonials() {
  const [selectedType, setSelectedType] = useState('All');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    rating: 5,
    content: '',
    projectType: 'Custom',
  });

  const filteredTestimonials = testimonials.filter(
    (t) => selectedType === 'All' || t.projectType === selectedType
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the formData to your backend
    console.log('Review submitted:', formData);
    setShowReviewForm(false);
    // Reset form
    setFormData({
      name: '',
      rating: 5,
      content: '',
      projectType: 'Custom',
    });
  };

  return (
    <section className="py-24 section-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 hero-title">
            Client Testimonials
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 hero-description">
            Don't just take our word for it. Here's what our clients have to say
            about our powder coating services.
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedType === type
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
                }`}
                title={`Filter by ${type} projects`}
                aria-label={`Filter testimonials by ${type} projects`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect dark:glass-effect-dark rounded-2xl p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs mt-1">
                    {testimonial.projectType}
                  </span>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                "{testimonial.content}"
              </p>
              {testimonial.videoUrl && (
                <button 
                  className="mt-4 flex items-center text-accent"
                  title="Watch video testimonial"
                  aria-label={`Watch video testimonial from ${testimonial.name}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video Review
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-accent text-white px-6 py-3 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
            title="Share your experience"
            aria-label="Open review submission form"
          >
            Share Your Experience
          </button>
        </div>

        {/* Trust Badges Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Verified Business</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">100% Satisfaction</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Eco-Friendly</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Youtube className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Video Reviews</h3>
          </div>
        </div>

        {/* Review Submission Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    title="Your name"
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        title={`Rate ${rating} stars`}
                        aria-label={`Rate ${rating} stars`}
                        onClick={() =>
                          setFormData({ ...formData, rating: rating })
                        }
                        className={`p-2 ${
                          formData.rating >= rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({ ...formData, projectType: e.target.value })
                    }
                    title="Select project type"
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
                  >
                    {projectTypes.slice(1).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="review" className="block text-sm font-medium mb-2">Review</label>
                  <textarea
                    id="review"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Share your experience with our service"
                    title="Your review"
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 h-32"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium mb-2">
                    Upload Photo (Optional)
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files?.[0],
                      })
                    }
                    title="Upload a photo"
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                    title="Cancel review submission"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-accent text-white"
                    title="Submit your review"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}