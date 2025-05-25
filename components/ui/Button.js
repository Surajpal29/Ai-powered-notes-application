import { motion } from 'framer-motion';

/**
 * Reusable animated button component with different variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant (primary, secondary, outline)
 * @param {boolean} props.isLoading - Loading state of the button
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler function
 * @param {string} props.type - Button type (button, submit)
 * @param {boolean} props.fullWidth - Whether button should take full width
 */
const Button = ({ 
  variant = 'primary',
  isLoading = false,
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  // Button style variants
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  // Framer Motion animation variants
  const buttonAnimation = {
    tap: { scale: 0.98 },
    hover: { scale: 1.02 },
  };

  return (
    <motion.button
      whileTap="tap"
      whileHover="hover"
      variants={buttonAnimation}
      onClick={onClick}
      type={type}
      disabled={isLoading}
      className={`
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        px-4 py-2 rounded-lg font-medium
        transition-colors duration-200
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button; 