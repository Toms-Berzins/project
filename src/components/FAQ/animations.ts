export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: window.innerWidth < 768 ? 0.05 : 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10, transform: "translateZ(0)" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: window.innerWidth < 768 ? 0.3 : 0.6,
      ease: "easeOut"
    }
  }
}; 