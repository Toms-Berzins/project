import { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendQuoteEmail } from '../services/emailService';
import { saveQuote, API_URL } from '../services/databaseService';
import { FormData, PriceBreakdown, FormDataValue } from './quote/types';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [quoteReference, setQuoteReference] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    const quantity = parseInt(formData.quantity);

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
        if (!formData.quantity || parseInt(formData.quantity) < 1) {
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
        return {
          ...prev,
          [field]: value
        };
      }

      let current: Record<string, unknown> = newData;
      for (let i = 0; i < fieldParts.length - 1; i++) {
        const part = fieldParts[i];
        current = current[part] as Record<string, unknown>;
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
      setErrorMessage(null);
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
      setErrorMessage(null);
      return data;
    } catch (error) {
      setErrorMessage(createErrorMessage(error));
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!userId) {
        setShowLoginModal(true);
        return;
      }

      const savedQuote = await saveQuote(userId, formData, priceBreakdown!);
      setQuoteReference(savedQuote.quoteReference);

      await sendQuoteEmail({
        formData,
        priceBreakdown: priceBreakdown!,
        quoteReference: savedQuote.quoteReference
      });

      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(createErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
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
              errors={errors}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 2 && (
            <CoatingStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 3 && (
            <ColorStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 4 && (
            <ContactStep
              formData={formData}
              errors={errors}
              priceBreakdown={priceBreakdown}
              updateFormData={updateFormData}
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
          onClose={() => setShowLoginModal(false)}
          error={errorMessage}
        />
      )}
      
      {showSuccess ? (
        <SuccessView
          quoteReference={quoteReference!}
          formData={formData}
          priceBreakdown={priceBreakdown!}
          onStartNewQuote={handleStartNewQuote}
        />
      ) : (
        <>
          <StepIndicator currentStep={currentStep} />
          <form onSubmit={handleSubmit} className="mt-8">
            {renderStep()}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="mr-2" />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={currentStep < 4 ? handleNext : handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center ${
                  currentStep === 4
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-6 py-2 rounded-lg ml-auto transition-colors`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    {currentStep === 4 ? 'Submit Quote' : 'Next'}
                    <ArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}