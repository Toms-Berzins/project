import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendQuoteEmail } from '../services/emailService';
import { saveQuote, API_URL } from '../services/databaseService';
import { FormData, PriceBreakdown, FormDataValue, NestedFormData } from './quote/types';
import { initialFormData, materials, coatingTypes, finishTypes, colors, addons } from './quote/constants';
import { StepIndicator } from './quote/StepIndicator';
import { MaterialStep } from './quote/steps/MaterialStep';
import { CoatingStep } from './quote/steps/CoatingStep';
import { ColorStep } from './quote/steps/ColorStep';
import { ContactStep } from './quote/steps/ContactStep';
import { SuccessView } from './quote/SuccessView';
import { LoginModal } from './quote/LoginModal';
import { createErrorMessage } from '../utils/errorHandling';

export default function QuoteCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [quoteReference, setQuoteReference] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const calculateEstimate = () => {
    const material = materials.find(m => m.id === formData.material);
    const coating = coatingTypes.find(c => c.id === formData.coating.type);
    const finish = finishTypes.find(f => f.id === formData.coating.finish);
    const color = colors.find(c => c.id === formData.color.type);
    
    if (!material || !coating || !finish || !color || !formData.dimensions.length || !formData.quantity) {
      return null;
    }

    const dimensionMultiplier = formData.dimensions.unit === 'cm' ? 0.393701 : 1; // Convert cm to inches
    const volume = 
      parseFloat(formData.dimensions.length) * dimensionMultiplier *
      parseFloat(formData.dimensions.width) * dimensionMultiplier *
      parseFloat(formData.dimensions.height) * dimensionMultiplier;
    
    const basePrice = material.basePrice;
    const coatingPrice = basePrice * coating.priceMultiplier;
    const finishPrice = finish.priceAdd;
    const colorMultiplier = color.priceMultiplier;
    const quantity = formData.quantity;

    const addonsTotal = formData.addons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);

    const subtotal = (coatingPrice + finishPrice + (volume * 0.1)) * quantity * colorMultiplier;
    const total = subtotal + addonsTotal;

    setPriceBreakdown({
      base: basePrice * quantity,
      coating: (coatingPrice - basePrice) * quantity,
      finish: finishPrice * quantity,
      volume: (volume * 0.1) * quantity,
      addons: addonsTotal,
      total: total
    });

    return Math.round(total * 100) / 100;
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.material) newErrors.material = 'Please select a material';
        if (!formData.dimensions.length) newErrors.length = 'Length is required';
        if (!formData.dimensions.width) newErrors.width = 'Width is required';
        if (!formData.dimensions.height) newErrors.height = 'Height is required';
        break;
      case 2:
        if (!formData.coating.type) newErrors.coatingType = 'Please select a coating type';
        if (!formData.coating.finish) newErrors.finish = 'Please select a finish';
        break;
      case 3:
        if (!formData.color.type) newErrors.colorType = 'Please select a color type';
        if (formData.color.type === 'custom' && !formData.color.custom) {
          newErrors.customColor = 'Please specify custom color';
        }
        if (!formData.quantity || formData.quantity < 1) {
          newErrors.quantity = 'Please enter a valid quantity';
        }
        break;
      case 4:
        if (!formData.contact.name) newErrors.name = 'Name is required';
        if (!formData.contact.email) newErrors.email = 'Email is required';
        if (!formData.contact.phone) newErrors.phone = 'Phone is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (field: string, value: FormDataValue) => {
    setFormData(prev => {
      const newData = { ...prev };
      const fieldParts = field.split('.');
      
      if (fieldParts.length === 1) {
        // Handle quantity field specially
        if (field === 'quantity') {
          const numValue = typeof value === 'string' ? parseInt(value) || 1 : 
                          typeof value === 'number' ? value : 1;
          return {
            ...prev,
            quantity: numValue
          };
        }
        return {
          ...prev,
          [field]: value
        };
      }

      let current: NestedFormData = newData;
      for (let i = 0; i < fieldParts.length - 1; i++) {
        const part = fieldParts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part] as NestedFormData;
      }
      
      const lastPart = fieldParts[fieldParts.length - 1];
      current[lastPart] = value;
      
      return newData;
    });
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
        if (currentStep === 3) {
          const estimate = calculateEstimate();
          if (estimate !== null) {
            setPriceBreakdown({
              base: estimate,
              coating: 0,
              finish: 0,
              volume: 0,
              addons: 0,
              total: estimate
            });
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(undefined);

    try {
      if (!userId) {
        // Show login modal with guest option
        setShowLoginModal(true);
        return;
      }

      await submitQuote(true);
    } catch (error) {
      setErrorMessage(createErrorMessage(error));
    }
  };

  const submitQuote = async (isRegistered: boolean) => {
    let quoteRef;
    
    if (isRegistered && userId) {
      // Save quote for registered user
      const savedQuote = await saveQuote(userId, formData, priceBreakdown!);
      quoteRef = savedQuote.quoteReference;
    } else {
      // Generate a temporary reference for guest users
      quoteRef = `GUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Send email regardless of user type
    await sendQuoteEmail({
      formData,
      priceBreakdown: priceBreakdown!,
      quoteReference: quoteRef,
      isGuest: !isRegistered
    });

    setQuoteReference(quoteRef);
    setShowSuccess(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    // Show guest quote confirmation dialog
    if (confirm('Would you like to continue as a guest? You can still receive your quote via email.')) {
      submitQuote(false).catch(error => {
        setErrorMessage(createErrorMessage(error));
      });
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
      }

      const data = await response.json();
      setUserId(data.user._id);
      setShowLoginModal(false);
      setErrorMessage(undefined);
      
      // Submit quote after successful login
      await submitQuote(true);
      
      return data;
    } catch (error) {
      setErrorMessage(createErrorMessage(error));
      throw error;
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      const data = await response.json();
      setUserId(data.user._id);
      setShowLoginModal(false);
      setErrorMessage(undefined);
      return data;
    } catch (error) {
      setErrorMessage(createErrorMessage(error));
      throw error;
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // Open the OAuth provider's login page in a new window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      `${API_URL}/api/auth/${provider}`,
      `${provider}Login`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      setErrorMessage('Failed to open login window. Please ensure pop-ups are allowed.');
      return;
    }

    // Listen for the OAuth callback message
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== API_URL) return;
      
      if (event.data.type === 'social-login-success') {
        window.removeEventListener('message', handleMessage);
        setUserId(event.data.user._id);
        setShowLoginModal(false);
        setErrorMessage(undefined);
        
        // Submit quote after successful social login
        try {
          await submitQuote(true);
        } catch (error) {
          setErrorMessage(createErrorMessage(error));
        }
      }
    };

    window.addEventListener('message', handleMessage);
  };

  const renderStep = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <MaterialStep
              formData={formData}
              onNext={handleNext}
              onChange={(data) => {
                Object.entries(data).forEach(([key, value]) => {
                  updateFormData(key, value);
                });
              }}
            />
          )}

          {currentStep === 2 && (
            <CoatingStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}

          {currentStep === 3 && (
            <ColorStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}

          {currentStep === 4 && (
            <ContactStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              onNext={handleSubmit}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  const handleStartNewQuote = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowSuccess(false);
    setPriceBreakdown(null);
    setQuoteReference(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onSignup={handleSignup}
          onSocialLogin={handleSocialLogin}
          onClose={handleLoginModalClose}
          error={errorMessage}
          prefillName={formData.contact.name}
          prefillEmail={formData.contact.email}
        />
      )}
      
      {showSuccess ? (
        <SuccessView
          quoteReference={quoteReference!}
          formData={formData}
          priceBreakdown={priceBreakdown!}
          onStartNewQuote={handleStartNewQuote}
          isGuest={!userId}
        />
      ) : (
        <>
          <StepIndicator currentStep={currentStep} />
          <form onSubmit={handleSubmit} className="mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors mb-8"
              >
                <ArrowLeft className="mr-2" />
                Back
              </button>
            )}
            {renderStep()}
          </form>
        </>
      )}
    </div>
  );
}