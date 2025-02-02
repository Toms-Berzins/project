import { Star, Youtube, Play, X, Upload } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button, { InteractiveButton } from './ui/Button';
import Card, { CardHeader, CardContent, CardFooter, CardTitle } from './ui/Card';
import Input from './ui/Input';
import { TextArea } from './ui/Input';
import Select from './ui/Select';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3
    }
  }
};

export default function Testimonials() {
  const [selectedType, setSelectedType] = useState('All');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
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
    <section className="relative py-24 bg-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent" />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="title-primary mb-6">
            Client Testimonials
          </h2>
          <p className="subtitle-primary max-w-2xl mx-auto mb-8">
            Don't just take our word for it. Here's what our clients have to say
            about our powder coating services.
          </p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {projectTypes.map((type) => (
              <InteractiveButton
                key={type}
                onClick={() => setSelectedType(type)}
                variant={selectedType === type ? 'primary' : 'ghost'}
                size="sm"
                className={`glass-panel px-6 py-2 rounded-xl transition-all duration-300
                  ${selectedType === type 
                    ? 'button-primary' 
                    : 'button-secondary'}`}
              >
                {type}
              </InteractiveButton>
            ))}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                className="h-full"
              >
                <Card 
                  variant="hover" 
                  className="h-full glass-panel bg-gray-900/50 backdrop-blur-xl
                    border border-gray-800 hover:border-orange-500/30 transition-all duration-500
                    hover:shadow-xl hover:shadow-orange-500/10"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="relative group">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/30
                            transition-all duration-300 group-hover:ring-orange-500"
                        />
                        <motion.div
                          className="absolute inset-0 bg-orange-500/10 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-gray-100">{testimonial.name}</CardTitle>
                        <p className="text-sm text-gray-400">
                          {testimonial.role}
                        </p>
                        <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-400
                          rounded-full text-xs mt-1 border border-orange-500/20">
                          {testimonial.projectType}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm italic">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                  {testimonial.videoUrl && (
                    <CardFooter>
                      <Button 
                        variant="ghost"
                        size="sm"
                        icon={<Play className="w-4 h-4" />}
                        onClick={() => testimonial.videoUrl && setSelectedVideo(testimonial.videoUrl)}
                        className="hover:bg-orange-500/10 hover:text-orange-400
                          transition-all duration-300"
                        title="Watch video testimonial"
                        aria-label={`Watch video testimonial from ${testimonial.name}`}
                      >
                        Watch Video Review
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div variants={itemVariants} className="mt-16 text-center">
          <InteractiveButton
            onClick={() => setShowReviewForm(true)}
            variant="primary"
            size="lg"
            className="glass-panel bg-orange-500/20 hover:bg-orange-500/30
              backdrop-blur-lg shadow-lg shadow-orange-500/10"
          >
            Share Your Experience
          </InteractiveButton>
        </motion.div>

        {/* Enhanced Trust Badges Section */}
        <motion.div 
          variants={containerVariants}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: Star, title: 'Verified Business', color: 'blue' },
            { icon: Star, title: '100% Satisfaction', color: 'green' },
            { icon: Star, title: 'Eco-Friendly', color: 'purple' },
            { icon: Youtube, title: 'Video Reviews', color: 'orange' }
          ].map((badge) => (
            <motion.div
              key={badge.title}
              variants={itemVariants}
              className="flex flex-col items-center group"
            >
              <div className={`w-16 h-16 bg-${badge.color}-500/10 rounded-full flex items-center 
                justify-center mb-4 transition-all duration-300 group-hover:scale-110
                group-hover:bg-${badge.color}-500/20`}>
                <badge.icon className={`w-8 h-8 text-${badge.color}-500`} />
              </div>
              <h3 className="font-bold text-gray-100 group-hover:text-orange-400
                transition-colors duration-300">{badge.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Review Modal */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center 
                justify-center z-50 p-4"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-lg w-full"
              >
                <Card className="glass-panel bg-gray-900/90 border border-gray-800">
                  <CardHeader className="relative">
                    <CardTitle className="text-gray-100">Share Your Experience</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReviewForm(false)}
                      className="absolute right-4 top-4 hover:bg-orange-500/10
                        hover:text-orange-400 transition-all duration-300"
                      aria-label="Close review form"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <Input
                        label="Name"
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your name"
                        title="Your name"
                        fullWidth
                        required
                        className="glass-input"
                      />

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-200">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              type="button"
                              variant={formData.rating >= rating ? 'primary' : 'ghost'}
                              size="sm"
                              onClick={() =>
                                setFormData({ ...formData, rating: rating })
                              }
                              className={`transition-all duration-300 ${
                                formData.rating >= rating 
                                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                  : 'hover:bg-gray-800/50'
                              }`}
                            >
                              <Star className={`w-5 h-5 ${
                                formData.rating >= rating ? 'fill-current' : ''
                              }`} />
                            </Button>
                          ))}
                        </div>
                      </div>

                      <TextArea
                        label="Your Review"
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Share your experience with our services..."
                        rows={4}
                        required
                        className="glass-input"
                      />

                      <Select
                        label="Project Type"
                        id="projectType"
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({ ...formData, projectType: e.target.value })
                        }
                        required
                        className="glass-input"
                      >
                        {projectTypes.filter(type => type !== 'All').map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Select>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">
                          Add Photos (optional)
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="w-full flex flex-col items-center justify-center px-4 py-6 
                            bg-gray-800/50 text-gray-400 rounded-lg border-2 border-dashed
                            border-gray-700 cursor-pointer hover:bg-gray-800/70 transition-all duration-300">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">Click to upload photos</span>
                            <input type="file" className="hidden" accept="image/*" multiple />
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowReviewForm(false)}
                          className="hover:bg-gray-800/50"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          className="bg-orange-500/20 hover:bg-orange-500/30
                            text-orange-400 shadow-lg shadow-orange-500/10"
                        >
                          Submit Review
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center 
                justify-center z-50 p-4"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-4xl w-full aspect-video relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-12 right-0 hover:bg-orange-500/10
                    hover:text-orange-400 transition-all duration-300"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5" />
                </Button>
                <iframe
                  src={selectedVideo}
                  className="w-full h-full rounded-xl"
                  title="Customer testimonial video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}