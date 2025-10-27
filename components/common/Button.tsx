
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-6 py-3 font-bold rounded-xl text-white transition-all duration-300 transform hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-cyan-500/80 border border-cyan-400 hover:bg-cyan-500 hover:shadow-[0_0_20px_theme(colors.cyan.400)]',
    secondary: 'bg-fuchsia-500/80 border border-fuchsia-400 hover:bg-fuchsia-500 hover:shadow-[0_0_20px_theme(colors.fuchsia.400)]'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
