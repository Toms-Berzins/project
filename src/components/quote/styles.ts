export const commonInputClasses = `
  w-full 
  p-3 
  border 
  rounded-lg 
  bg-white dark:bg-gray-800 
  text-gray-900 dark:text-white 
  transition-all duration-200
  focus:ring-2 focus:ring-accent/20 focus:border-accent
  hover:border-accent/50
  placeholder-transparent
  peer
`;

export const floatingLabelClasses = `
  absolute 
  left-3 
  -top-2.5
  px-1
  text-sm 
  font-medium 
  transition-all
  duration-200
  bg-white dark:bg-gray-800
  text-gray-500 dark:text-gray-400
  peer-placeholder-shown:text-gray-400
  peer-placeholder-shown:top-3.5
  peer-placeholder-shown:text-base
  peer-focus:-top-2.5
  peer-focus:text-sm
  peer-focus:text-accent
`;

export const inputContainerClasses = "relative mt-4";

export const errorInputClasses = "border-red-500 dark:border-red-400 focus:ring-red-200 dark:focus:ring-red-900";

export const errorMessageClasses = "mt-1 text-sm text-red-500 dark:text-red-400";

export const selectClasses = `
  ${commonInputClasses}
  appearance-none 
  bg-no-repeat 
  bg-[right_1rem_center] 
  pr-10
  bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")]
`;

export const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"; 