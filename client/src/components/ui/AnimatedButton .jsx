import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AnimatedButton = ({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  icon = <ArrowRight size={18} />,
  iconPosition = "right",
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out";
  
  const variantStyles = {
    primary: "bg-fidel-500 hover:bg-fidel-600 text-white shadow-sm hover:shadow-md active:translate-y-0.5",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white",
    outline: "border border-slate-300 dark:border-slate-700 hover:border-fidel-400 dark:hover:border-fidel-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-900 dark:text-white",
    ghost: "text-fidel-500 hover:text-fidel-600 hover:bg-fidel-50 dark:hover:bg-fidel-900/20"
  };
  
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-base px-4 py-2 gap-2",
    lg: "text-lg px-6 py-3 gap-2"
  };
  
  const buttonContent = (
    <>
      {icon && iconPosition === "left" && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
    </>
  );
  
  const allStyles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    "group",
    className
  ].join(" ");
  
  if (to) {
    return (
      <Link to={to} className={allStyles}>
        {buttonContent}
      </Link>
    );
  }
  
  if (href) {
    return (
      <a href={href} className={allStyles}>
        {buttonContent}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={allStyles}>
      {buttonContent}
    </button>
  );
};

export default AnimatedButton;
