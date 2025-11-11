import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { Input } from '../atoms/input';
import { Label } from '../atoms/label';

interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: LucideIcon;
  iconColor?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({
    id,
    label,
    placeholder,
    type = 'text',
    icon: Icon,
    iconColor = 'text-gray-400',
    error,
    disabled,
    required,
    className,
    ...props
  }, ref) => {
    return (
      <div className={`space-y-3 ${className}`}>
        <Label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
        >
          {Icon && <Icon className={`h-4 w-4 ${iconColor}`} />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            {Icon && (
              <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${iconColor} group-focus-within:text-blue-500 transition-colors`} />
            )}
            <Input
              ref={ref}
              id={id}
              type={type}
              placeholder={placeholder}
              className={`h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                Icon ? 'pl-12' : 'pl-4'
              } pr-4 py-3`}
              disabled={disabled}
              {...props}
            />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 animate-in slide-in-from-left-2 duration-200">
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
