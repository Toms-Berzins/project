import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle, AlertCircle, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, memo, Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import Card, { CardHeader, CardContent, CardTitle } from './ui/Card';
import { 
  containerVariants, 
  itemVariants, 
  contactInfoVariants, 
  iconContainerVariants, 
  iconVariants, 
  buttonVariants, 
  formFieldVariants 
} from './Contact/animations';
import type { FormData, FormErrors } from './Contact/types';

// Components
const SocialButtons = memo(() => {
  const phoneNumber = '1234567890';
  const messengerUsername = 'yourbusinesspage';

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <motion.a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="button-primary flex items-center gap-2 px-4 py-2.5"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <motion.svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          variants={iconVariants}
          whileHover="hover"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.9 2.5 15.7 3.4 17.2L2 22L6.9 20.6C8.4 21.5 10.2 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.4 20 8.9 19.5 7.6 18.7L7.2 18.5L4.3 19.3L5.1 16.5L4.9 16.1C4 14.7 3.5 13.2 3.5 11.7C3.5 7.3 7.3 3.5 11.7 3.5C16.1 3.5 19.9 7.3 19.9 11.7C20 16.1 16.2 20 12 20ZM16.7 14.7C16.4 14.5 15.1 13.9 14.8 13.7C14.5 13.6 14.3 13.5 14.1 13.8C13.9 14.1 13.4 14.7 13.2 14.9C13.1 15.1 12.9 15.1 12.6 14.9C11.3 14.3 10.5 13.7 9.6 12.3C9.4 11.9 9.9 12 10.3 11.2C10.4 11 10.3 10.8 10.2 10.6C10.1 10.4 9.6 9.1 9.3 8.5C9 7.8 8.7 7.9 8.5 7.9C8.3 7.9 8.1 7.9 7.9 7.9C7.7 7.9 7.3 8 7 8.3C6.7 8.6 6 9.2 6 10.5C6 11.8 6.9 13 7 13.2C7.1 13.4 9.5 17 13.1 18.5C15.7 19.5 16.3 19.2 16.9 19.1C17.5 19 18.6 18.4 18.9 17.7C19.2 17 19.2 16.4 19.1 16.3C19 16.1 18.8 16.1 16.7 14.7Z" fill="currentColor"/>
        </motion.svg>
        WhatsApp
      </motion.a>
      
      <motion.a
        href={`https://m.me/${messengerUsername}`}
        target="_blank"
        rel="noopener noreferrer"
        className="button-secondary flex items-center gap-2 px-4 py-2.5"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <motion.svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          variants={iconVariants}
          whileHover="hover"
        >
          <path d="M12 2C6.36 2 2 6.13 2 11.7C2 14.61 3.19 17.14 5.14 18.87C5.3 19.02 5.4 19.21 5.41 19.42L5.48 21.39C5.5 21.86 6 22.19 6.45 22.03L8.56 21.22C8.73 21.16 8.91 21.15 9.08 21.2C10 21.47 10.97 21.62 12 21.62C17.64 21.62 22 17.49 22 11.92C22 6.35 17.64 2 12 2ZM18.5 9.13L15.55 13.64C15.25 14.09 14.67 14.24 14.22 13.97L11.96 12.47C11.7 12.3 11.38 12.3 11.12 12.47L8.08 14.53C7.59 14.87 7 14.36 7.21 13.81L10.16 9.3C10.46 8.85 11.04 8.7 11.49 8.97L13.75 10.47C14.01 10.64 14.33 10.64 14.59 10.47L17.63 8.41C18.12 8.07 18.71 8.58 18.5 9.13Z" fill="currentColor"/>
        </motion.svg>
        Messenger
      </motion.a>
    </div>
  );
});

const DirectionsButtons = memo(() => {
  const address = encodeURIComponent('123 Coating Street Industrial District City State 12345');
  
  const handleGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`,
      '_blank'
    );
  };

  const handleWaze = () => {
    window.open(
      `https://waze.com/ul?q=${address}&navigate=yes`,
      '_blank'
    );
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <motion.button
        onClick={handleGoogleMaps}
        className="button-primary flex items-center gap-2 px-4 py-2.5"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Get directions via Google Maps"
      >
        <motion.svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          variants={iconVariants}
          whileHover="hover"
        >
          <path d="M19.527 4.473c-4.63-4.63-12.424-4.63-17.054 0-4.63 4.63-4.63 12.424 0 17.054 4.63 4.63 12.424 4.63 17.054 0 4.63-4.63 4.63-12.424 0-17.054zM12 23.25c-6.234 0-11.25-5.016-11.25-11.25S5.766.75 12 .75 23.25 5.766 23.25 12 18.234 23.25 12 23.25z" fill="currentColor"/>
          <path d="M12 4.5c-2.916 0-5.25 2.334-5.25 5.25 0 3.937 5.25 9.75 5.25 9.75s5.25-5.813 5.25-9.75c0-2.916-2.334-5.25-5.25-5.25zm0 7.5c-1.242 0-2.25-1.008-2.25-2.25S10.758 7.5 12 7.5s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25z" fill="currentColor"/>
        </motion.svg>
        Google Maps
      </motion.button>
      
      <motion.button
        onClick={handleWaze}
        className="button-secondary flex items-center gap-2 px-4 py-2.5"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Get directions via Waze"
      >
        <motion.svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          variants={iconVariants}
          whileHover="hover"
        >
          <path d="M12.0001 1.99951C6.48508 1.99951 2.00008 6.13 2.00008 11.7C2.00008 17.5145 6.48508 21.9995 12.0001 21.9995C17.5151 21.9995 22.0001 17.5145 22.0001 11.9995C22.0001 6.48451 17.5151 1.99951 12.0001 1.99951Z" fill="currentColor"/>
          <path d="M12.0001 7.99951C10.8956 7.99951 10.0001 8.89494 10.0001 9.99951C10.0001 11.1041 10.8956 11.9995 12.0001 11.9995C13.1047 11.9995 14.0001 11.1041 14.0001 9.99951C14.0001 8.89494 13.1047 7.99951 12.0001 7.99951Z" fill="white"/>
          <path d="M16.0001 13.9995C14.8956 13.9995 14.0001 14.8949 14.0001 15.9995C14.0001 17.1041 14.8956 17.9995 16.0001 17.9995C17.1047 17.9995 18.0001 17.1041 18.0001 15.9995C18.0001 14.8949 17.1047 13.9995 16.0001 13.9995Z" fill="white"/>
          <path d="M8.00008 13.9995C6.89551 13.9995 6.00008 14.8949 6.00008 15.9995C6.00008 17.1041 6.89551 17.9995 8.00008 17.9995C9.10465 17.9995 10.0001 17.1041 10.0001 15.9995C10.0001 14.8949 9.10465 13.9995 8.00008 13.9995Z" fill="white"/>
        </motion.svg>
        Waze
      </motion.button>
    </div>
  );
});

// Memoized contact info component
const ContactInfo = memo(({ info }: { 
  info: { icon: React.ElementType; title: string; content: string; href?: string; }[]; 
}) => (
  <div className="space-y-6">
    {info.map(({ icon: Icon, title, content, href }) => (
      <motion.div 
        key={title}
        className="contact-info-item flex items-start space-x-4 p-4 group
          bg-gray-800/20 rounded-lg backdrop-blur-sm border border-gray-700/50
          hover:bg-gray-800/30 transition-colors duration-300"
        variants={contactInfoVariants}
        whileHover="hover"
      >
        <motion.div 
          className="flex-shrink-0 p-3 bg-orange-500/10 rounded-lg"
          variants={iconContainerVariants}
        >
          <motion.div variants={iconVariants} whileHover="hover">
            <Icon className="w-6 h-6 text-orange-500" />
          </motion.div>
        </motion.div>
        <div className="flex-1">
          <h4 className="title-secondary mb-1">{title}</h4>
          {href ? (
            <motion.a 
              href={href}
              className="inline-block text-gray-300 hover:text-orange-400 transition-all duration-300
                decoration-orange-400/30 hover:decoration-orange-400 underline-offset-4 hover:underline"
              aria-label={`Contact us via ${title.toLowerCase()}: ${content}`}
              whileHover={{ scale: 1.02 }}
            >
              {content}
            </motion.a>
          ) : (
            <p className="subtitle-card whitespace-pre-line">{content}</p>
          )}
          {title === 'Location' && <DirectionsButtons />}
          {title === 'Phone' && <SocialButtons />}
        </div>
      </motion.div>
    ))}
  </div>
));

ContactInfo.displayName = 'ContactInfo';

// JSON-LD Schema
const ContactSchema = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "contactType": "customer support",
          "email": "info@powderpro.com",
          "telephone": "+1234567890",
          "url": typeof window !== 'undefined' ? window.location.href : '',
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Coating Street",
            "addressLocality": "Industrial District",
            "addressRegion": "State",
            "postalCode": "12345",
            "addressCountry": "US"
          },
          "openingHours": [
            "Mo-Fr 08:00-18:00",
            "Sa 09:00-14:00"
          ]
        })
      }}
    />
  );
};

const ModernDropdown = ({ 
  value, 
  onChange, 
  options, 
  label, 
  error,
  required 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: string[];
  label: string;
  error?: string;
  required?: boolean;
}) => {
  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="absolute left-4 -top-6 text-sm text-gray-400 transition-all duration-300">
              {label} {required && '*'}
            </Listbox.Label>
            <div className="relative w-full">
              <Listbox.Button className="peer w-full min-h-[50px] px-4 py-3 text-white bg-gray-800/30 
                border border-gray-700 rounded-lg transition-all duration-300 backdrop-blur-sm
                hover:bg-gray-800/40 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40
                text-base sm:text-lg flex items-center justify-between group">
                <span className={`truncate ${value ? 'text-white' : 'text-gray-500'}`}>
                  {value || 'Select a subject'}
                </span>
                <ChevronUpDownIcon 
                  className={`w-5 h-5 flex-shrink-0 text-gray-400 transform transition-all duration-300 ease-in-out delay-75
                    group-hover:text-orange-500 ${open ? "rotate-180" : "rotate-0"}`}
                  aria-hidden="true" 
                />
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <Listbox.Options className="absolute z-[100] w-full mt-2 bg-gray-800/95 backdrop-blur-lg
                  border border-gray-700 rounded-lg py-1
                  focus:outline-none text-base sm:text-lg
                  transform-gpu shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20
                  transition-all duration-300 overflow-auto max-h-60">
                  {options.map((option, index) => (
                    <Listbox.Option
                      key={index}
                      value={option}
                      className={({ active, selected }) =>
                        `relative cursor-pointer select-none py-2.5 px-4 transition-all duration-200
                        ${active ? 'bg-orange-500/20 text-orange-500' : 'text-gray-300'}
                        ${selected ? 'bg-orange-500/10' : ''}
                        hover:bg-orange-500/15 group`
                      }
                    >
                      {({ selected, active }) => (
                        <div className="flex items-center justify-between">
                          <span className={`block truncate transition-all duration-200
                            ${selected ? 'font-semibold text-orange-500' : ''}
                            group-hover:text-orange-500`}>
                            {option}
                          </span>
                          {selected && (
                            <CheckIcon className={`w-5 h-5 ml-4 flex-shrink-0 transition-all duration-200
                              ${active ? 'text-orange-500' : 'text-orange-500'}
                              opacity-90 group-hover:opacity-100`} />
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

// Add FloatingBackground component
const FloatingBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const elements = Array.from({ length: 3 }, (_, i) => i);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
    >
      {elements.map((i) => (
        <motion.div
          key={i}
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,0.03) 0%, transparent 70%)',
            top: `${20 + i * 30}%`,
            left: `${20 + i * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </motion.div>
  );
};

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
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const subjectOptions = [
    'General Inquiry',
    'Quote Request',
    'Custom Order',
    'Technical Support',
    'Other',
  ];

  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Memoized handlers
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

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
      
      toast.error('Please fill in all required fields correctly', {
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully!', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 4000,
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      toast.error('Failed to send message. Please try again.', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatOpen) {
        setIsChatOpen(false);
      }
      if (e.key === 'c' && e.altKey) {
        chatButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen]);

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChatOpen]);

  // Lazy load map
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadIframe(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (iframeContainerRef.current) {
      observer.observe(iframeContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <ContactSchema />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-gray-800/80 pointer-events-none" />
      <FloatingBackground />
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div 
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="title-primary mb-4">
            Get in Touch
          </h2>
          <p className="subtitle-primary">
            Have a question or ready to transform your project? We're here to help!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Contact Info Section */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4 sm:space-y-6">
            <Card className="glass-card dark">
              <CardHeader>
                <CardTitle className="title-card">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <ContactInfo
                  info={[
                    { icon: Phone, title: 'Phone', content: '(123) 456-7890', href: 'tel:+1234567890' },
                    { icon: Mail, title: 'Email', content: 'info@powderpro.com', href: 'mailto:info@powderpro.com' },
                    { icon: MapPin, title: 'Location', content: '123 Coating Street\nIndustrial District\nCity, State 12345' },
                    { icon: Clock, title: 'Business Hours', content: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed' }
                  ]}
                />
              </CardContent>
            </Card>

            {/* Map Section */}
            <Card className="glass-card dark overflow-hidden">
              <CardContent className="p-0">
                <div ref={iframeContainerRef} className="aspect-video relative">
                  {(shouldLoadIframe || iframeLoaded) ? (
                    <>
                      <iframe
                        ref={iframeRef}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-73.9877!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcwNC44Ik4gNzPCsDU5JzE1LjciVw!5e0!3m2!1sen!2sus!4v1234567890&mode=dark"
                        className="absolute inset-0 w-full h-full rounded-lg map-dark transition-opacity duration-300"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Our Location"
                        onLoad={() => setIframeLoaded(true)}
                      />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                          className="relative map-marker"
                        >
                          <div className="absolute -inset-4 bg-orange-500/20 rounded-full animate-ping" />
                          <div className="relative">
                            <MapPin className="w-8 h-8 text-orange-500 drop-shadow-lg" />
                          </div>
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 map-skeleton loading-skeleton rounded-lg" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-card dark">
              <CardHeader>
                <CardTitle className="title-card">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <AnimatePresence mode="wait">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Form fields with improved mobile sizing and animations */}
                      <motion.div
                        variants={formFieldVariants}
                        className="relative group expanding-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                      >
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="peer w-full min-h-[50px] px-4 py-3 text-white bg-gray-800/30 border border-gray-700 rounded-lg 
                            focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all duration-300 
                            backdrop-blur-sm placeholder-transparent text-base sm:text-lg hover:bg-gray-800/40"
                          placeholder="Name"
                          required
                        />
                        <label
                          htmlFor="name"
                          className="absolute left-4 -top-6 text-sm text-gray-400 peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5
                            peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500
                            transition-all duration-300"
                        >
                          Name *
                        </label>
                        {errors.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.name}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Email field with animation */}
                      <motion.div
                        variants={formFieldVariants}
                        className="relative group expanding-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                      >
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="peer w-full min-h-[50px] px-4 py-3 text-white bg-gray-800/30 border border-gray-700 rounded-lg 
                            focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all duration-300 
                            backdrop-blur-sm placeholder-transparent text-base sm:text-lg hover:bg-gray-800/40"
                          placeholder="Email"
                          required
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-4 -top-6 text-sm text-gray-400 peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5
                            peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500
                            transition-all duration-300"
                        >
                          Email *
                        </label>
                        {errors.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Phone field with animation */}
                      <motion.div
                        variants={formFieldVariants}
                        className="relative group expanding-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                      >
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="peer w-full min-h-[50px] px-4 py-3 text-white bg-gray-800/30 border border-gray-700 rounded-lg 
                            focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all duration-300 
                            backdrop-blur-sm placeholder-transparent text-base sm:text-lg hover:bg-gray-800/40"
                          placeholder="Phone"
                        />
                        <label
                          htmlFor="phone"
                          className="absolute left-4 -top-6 text-sm text-gray-400 peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5
                            peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500
                            transition-all duration-300"
                        >
                          Phone (Optional)
                        </label>
                      </motion.div>

                      {/* Subject field with animation */}
                      <motion.div
                        variants={formFieldVariants}
                        className="relative group expanding-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
                      >
                        <ModernDropdown
                          value={formData.subject}
                          onChange={(value) => {
                            handleChange({
                              target: { name: 'subject', value }
                            } as React.ChangeEvent<HTMLSelectElement>);
                          }}
                          options={subjectOptions}
                          label="Subject"
                          error={errors.subject}
                          required
                        />
                      </motion.div>

                      {/* Message field with animation */}
                      <motion.div
                        variants={formFieldVariants}
                        className="relative group expanding-input sm:col-span-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
                      >
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="peer w-full px-4 py-3 text-white bg-gray-800/30 border border-gray-700 rounded-lg 
                            focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all duration-300 
                            backdrop-blur-sm placeholder-transparent resize-none text-base sm:text-lg hover:bg-gray-800/40"
                          placeholder="Message"
                          required
                        />
                        <label
                          htmlFor="message"
                          className="absolute left-4 -top-6 text-sm text-gray-400 peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5
                            peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500
                            transition-all duration-300"
                        >
                          Message *
                        </label>
                        {errors.message && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.message}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Submit button with enhanced hover effect */}
                      <motion.div 
                        className="pt-6 sm:col-span-2"
                        variants={formFieldVariants}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
                      >
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="button-primary relative w-full min-h-[50px] py-3 px-6
                            disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden
                            text-base sm:text-lg send-button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0
                              translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
                          />
                          <span className="relative flex items-center justify-center gap-2">
                            {isSubmitting ? (
                              <>
                                <motion.div
                                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Message
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                              </>
                            )}
                          </span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </AnimatePresence>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Live Chat Button with improved mobile positioning */}
      <motion.button
        ref={chatButtonRef}
        className="button-secondary live-chat-button group fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50
          min-h-[50px] min-w-[50px] flex items-center justify-center"
        onClick={() => setIsChatOpen(!isChatOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open live chat"
        aria-expanded={isChatOpen}
        aria-controls="chat-modal"
        title="Open live chat (Alt + C)"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="sr-only">Press Alt + C to focus</span>
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Alt + C
        </div>
      </motion.button>

      {/* Live Chat Modal with improved mobile layout */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            ref={modalRef}
            id="chat-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-80 
              bg-gray-900 rounded-lg shadow-xl border border-gray-800 z-50"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 id="chat-title" className="text-lg font-semibold text-white">Live Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-300 text-sm">
                Our team is here to help! Please leave a message and we'll get back to you shortly.
              </p>
              {/* Add your chat widget implementation here */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}