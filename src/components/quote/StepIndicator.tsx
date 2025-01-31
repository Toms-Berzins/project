import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { 
    number: 1, 
    title: 'Material & Dimensions',
    description: 'Select material type and specify dimensions'
  },
  { 
    number: 2, 
    title: 'Coating & Finish',
    description: 'Choose coating type and surface finish'
  },
  { 
    number: 3, 
    title: 'Color & Quantity',
    description: 'Pick colors and set quantities'
  },
  { 
    number: 4, 
    title: 'Contact Details',
    description: 'Provide your contact information'
  },
];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => (
  <div className="flex items-center justify-center mb-12 relative z-10">
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-4xl">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative group">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: step.number === currentStep ? 1.1 : 0.9,
                  opacity: 1 
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center relative
                  ${step.number === currentStep
                    ? 'bg-accent ring-4 ring-accent/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]'
                    : step.number < currentStep
                    ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                    : 'bg-gray-200 dark:bg-gray-700'
                  } transition-all duration-300`}
              >
                <span className={`text-lg font-semibold
                  ${step.number <= currentStep ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {step.number < currentStep ? '✓' : step.number}
                </span>
                {step.number === currentStep && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                  </>
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="relative w-28 mx-3">
                  <div className={`h-1.5 rounded-full transition-all duration-500
                    ${step.number < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'}`}
                  />
                  <motion.div
                    className="absolute top-0 left-0 h-1.5 bg-accent rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: step.number === currentStep ? "100%" : "0%"
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: step.number === currentStep ? 1 : 0,
                y: step.number === currentStep ? 0 : 10
              }}
              transition={{ duration: 0.3 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-max"
            >
              <div className="flex flex-col items-center">
                <div className="font-medium text-accent">{step.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.description}</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  </div>
); 