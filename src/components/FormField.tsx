import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, id, value, onChange, placeholder, multiline = false, rows = 3, className, required }, ref) => {
    const inputClasses = cn(
      'bg-transparent border-border focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200',
      'h-8 sm:h-9 text-xs sm:text-sm',
      className
    );

    return (
      <div className="space-y-1">
        <Label htmlFor={id} className="text-xs sm:text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {multiline ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            rows={rows}
            className={cn(inputClasses, 'h-auto min-h-[60px] text-xs sm:text-sm')}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            className={inputClasses}
          />
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';