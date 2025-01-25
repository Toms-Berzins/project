import { Phone, Mail, MapPin, Clock, MessageSquare, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import '../styles/sections.css';
import '../styles/contact.css';

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

  const subjectOptions = [
    'General Inquiry',
    'Quote Request',
    'Custom Order',
    'Technical Support',
    'Other',
  ];

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      console.log('Contact form submitted:', formData);
      
      toast.success('Message sent successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }, 2000);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleGetDirections = () => {
    window.open(
      'https://www.google.com/maps/dir/?api=1&destination=123+Coating+Street+Industrial+District+City+State+12345',
      '_blank'
    );
  };

  return (
    <section id="contact" className="section-pattern py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-title text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="hero-description text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get in touch with our team for any questions about our powder coating
            services or to discuss your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="contact-info-card">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <Phone className="contact-icon" />
                  </div>
                  <div>
                    <h4 className="contact-text-primary">Phone</h4>
                    <a href="tel:+1234567890" className="contact-text-secondary">
                      (123) 456-7890
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <Mail className="contact-icon" />
                  </div>
                  <div>
                    <h4 className="contact-text-primary">Email</h4>
                    <a
                      href="mailto:info@powderpro.com"
                      className="contact-text-secondary"
                    >
                      info@powderpro.com
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <MapPin className="contact-icon" />
                  </div>
                  <div>
                    <h4 className="contact-text-primary">Location</h4>
                    <p className="contact-text-secondary">
                      123 Coating Street
                      <br />
                      Industrial District
                      <br />
                      City, State 12345
                    </p>
                    <button
                      onClick={handleGetDirections}
                      className="mt-2 text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Get Directions →
                    </button>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <Clock className="contact-icon" />
                  </div>
                  <div>
                    <h4 className="contact-text-primary">Business Hours</h4>
                    <p className="contact-text-secondary">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 2:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="contact-info-card">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Contact
              </h3>
              <div className="quick-contact-grid">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-contact-button whatsapp"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Chat
                </a>
                <a
                  href="https://m.me/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-contact-button messenger"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Messenger
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="contact-info-card">
              <iframe
                title="Business Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1644262070010!5m2!1sen!2sus"
                className="map-container"
                allowFullScreen
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-container">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="form-group">
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.name ? 'error' : 'valid'
                  }`}
                />
                {errors.name && (
                  <p className="error-message">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.email ? 'error' : 'valid'
                  }`}
                />
                {errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select a subject</option>
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="error-message">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="form-input"
                />
                {errors.message && (
                  <p className="error-message">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}