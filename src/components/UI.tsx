import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full p-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-orange-400 hover:bg-orange-500 text-white shadow-md shadow-orange-50",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-50",
    outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-50",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-bold text-slate-600 ml-1">{label}</label>}
      <input 
        className={`w-full p-4 bg-white border ${error ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 ml-1 font-medium">{error}</p>}
    </div>
  );
};
