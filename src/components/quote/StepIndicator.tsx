import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => (
  <div className="flex items-center justify-center mb-8 relative z-10 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
    {[1, 2, 3, 4].map((step) => (
      <div key={step} className="flex items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: step === currentStep ? 1 : 0.8 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === currentStep
              ? 'bg-accent text-white'
              : step < currentStep
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          {step < currentStep ? '✓' : step}
        </motion.div>
        {step < 4 && (
          <div
            className={`w-16 h-1 ${
              step < currentStep
                ? 'bg-green-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        )}
      </div>
    ))}
  </div>
); 