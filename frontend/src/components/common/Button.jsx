const variants = {
  primary: 'bg-[#58549C] text-white hover:bg-[#58549C]/80',
  outline: 'border border-[#58549C] text-[#58549C] hover:bg-[#58549C]/10',
  ghost: 'text-white/70 hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
  >
    {children}
  </button>
);

export default Button;
