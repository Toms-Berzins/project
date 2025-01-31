import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Input from './ui/Input';
import { TextArea } from './ui/Input';
import { InteractiveButton } from './ui/Button';
import Card, { CardHeader, CardContent, CardTitle } from './ui/Card';
import Select from './ui/Select';
import TiltCard from './ui/TiltCard';
import Particles from './effects/Particles';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
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
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const contactInfoVariants = {
  hover: {
    x: 8,
    transition: { type: "spring", stiffness: 300 }
  }
};

const iconContainerVariants = {
  hover: {
    scale: 1.1,
    backgroundColor: "rgba(249, 115, 22, 0.2)",
    transition: { type: "spring", stiffness: 300 }
  }
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const subjectOptions = [
    'General Inquiry',
    'Quote Request',
    'Custom Order',
    'Technical Support',
    'Other',
  ];

  // Enhanced form validation with real-time feedback
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Name is required' : '';
      case 'email':
        return !value.trim() 
          ? 'Email is required' 
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Please enter a valid email'
          : '';
      case 'subject':
        return !value ? 'Please select a subject' : '';
      case 'message':
        return !value.trim() ? 'Message is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFocus = (name: string) => {
    setFocusedField(name);
  };

  const handleBlur = (name: string) => {
    setFocusedField(null);
    // Validate on blur
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const form = e.target as HTMLFormElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 600);
      
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetDirections = () => {
    window.open(
      'https://www.google.com/maps/dir/?api=1&destination=123+Coating+Street+Industrial+District+City+State+12345',
      '_blank'
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadIframe(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (iframeContainerRef.current) {
      observer.observe(iframeContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="absolute inset-0">
        <Particles />
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent" />
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-orange-400 to-orange-600 mb-6
            [text-shadow:_0_2px_10px_rgba(251,146,60,0.3)]">
            Contact Us
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8
            [text-shadow:_0_1px_5px_rgba(255,255,255,0.1)]">
            Get in touch with us for all your powder coating needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <TiltCard>
              <Card className="glass-card bg-gray-900/50 backdrop-blur-xl border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { icon: Phone, title: 'Phone', content: '(123) 456-7890', href: 'tel:+1234567890' },
                    { icon: Mail, title: 'Email', content: 'info@powderpro.com', href: 'mailto:info@powderpro.com' },
                    { icon: MapPin, title: 'Location', content: '123 Coating Street\nIndustrial District\nCity, State 12345' },
                    { icon: Clock, title: 'Business Hours', content: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed' }
                  ].map(({ icon: Icon, title, content, href }) => (
                    <motion.div 
                      key={title}
                      className="flex items-start space-x-4 group"
                      variants={contactInfoVariants}
                      whileHover="hover"
                    >
                      <motion.div 
                        className="flex-shrink-0 p-3 bg-orange-500/10 rounded-lg"
                        variants={iconContainerVariants}
                      >
                        <Icon className="w-6 h-6 text-orange-500" />
                      </motion.div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">{title}</h4>
                        {href ? (
                          <a 
                            href={href}
                            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 whitespace-pre-line"
                          >
                            {content}
                          </a>
                        ) : (
                          <p className="text-gray-300 whitespace-pre-line">{content}</p>
                        )}
                        {title === 'Location' && (
                          <InteractiveButton
                            variant="ghost"
                            size="sm"
                            onClick={handleGetDirections}
                            icon={<ArrowRight className="w-4 h-4" />}
                            className="mt-2 text-orange-400 hover:text-orange-500"
                          >
                            Get Directions
                          </InteractiveButton>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TiltCard>

            {/* Map Section */}
            <TiltCard>
              <Card className="glass-card bg-gray-900/50 backdrop-blur-xl border border-gray-800 overflow-hidden">
                <CardContent className="p-0">
                  <div ref={iframeContainerRef} className="aspect-video relative">
                    {(shouldLoadIframe || iframeLoaded) ? (
                      <iframe
                        ref={iframeRef}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-73.9877!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcwNC44Ik4gNzPCsDU5JzE1LjciVw!5e0!3m2!1sen!2sus!4v1234567890&mode=dark"
                        className="absolute inset-0 w-full h-full rounded-lg map-dark transition-opacity duration-300"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Our Location"
                        onLoad={() => setIframeLoaded(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                        <div className="text-center">
                          <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Loading map...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div variants={itemVariants}>
            <TiltCard>
              <Card className="glass-card bg-gray-900/50 backdrop-blur-xl border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {['name', 'email', 'phone', 'subject', 'message'].map((field) => (
                        <motion.div
                          key={field}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`expanding-input ${focusedField === field ? 'focused' : ''}`}
                        >
                          {field === 'subject' ? (
                            <Select
                              label="Subject *"
                              id={field}
                              name={field}
                              value={formData[field as keyof FormData]}
                              onChange={handleChange}
                              onFocus={() => handleFocus(field)}
                              onBlur={() => handleBlur(field)}
                              error={errors[field]}
                              className="glass-input"
                              required
                            >
                              <option value="">Select a subject</option>
                              {subjectOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Select>
                          ) : field === 'message' ? (
                            <TextArea
                              label="Message *"
                              id={field}
                              name={field}
                              value={formData[field as keyof FormData]}
                              onChange={handleChange}
                              onFocus={() => handleFocus(field)}
                              onBlur={() => handleBlur(field)}
                              error={errors[field]}
                              rows={6}
                              className="glass-input"
                              required
                            />
                          ) : (
                            <Input
                              label={`${field.charAt(0).toUpperCase() + field.slice(1)}${field !== 'phone' ? ' *' : ''}`}
                              type={field === 'email' ? 'email' : 'text'}
                              id={field}
                              name={field}
                              value={formData[field as keyof FormData]}
                              onChange={handleChange}
                              onFocus={() => handleFocus(field)}
                              onBlur={() => handleBlur(field)}
                              error={errors[field]}
                              className="glass-input"
                              required={field !== 'phone'}
                            />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <motion.div 
                      className="pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <InteractiveButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={isSubmitting}
                        className="w-full glass-effect bg-gradient-to-r from-orange-500 to-orange-600
                          hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20"
                        icon={<ArrowRight className="w-5 h-5" />}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </InteractiveButton>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}