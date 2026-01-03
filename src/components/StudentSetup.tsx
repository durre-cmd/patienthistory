import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudentSetupProps {
  onComplete: (name: string) => void;
}

export function StudentSetup({ onComplete }: StudentSetupProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onComplete(name.trim());
      }, 300);
    }
  };

  const isInputEmpty = !name.trim();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[90%] sm:max-w-md"
      >
        <div className="card-notion p-6 sm:p-10 flex flex-col items-center overflow-hidden">
          {/* Responsive Icon: Smaller on mobile */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 flex-shrink-0"
          >
            <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </motion.div>

          {/* Responsive Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-2xl font-semibold text-foreground mb-2 whitespace-nowrap text-center w-full"
          >
            Welcome to Patient History
          </motion.h1>
          
          {/* Responsive Paragraph */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 text-center max-w-[240px] sm:max-w-[280px]"
          >
            A professional tool for medical students to document and organize patient cases.
          </motion.p>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 w-full flex flex-col items-center"
          >
            <div className="relative w-full">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base bg-secondary/50 border-border focus:border-primary w-full"
                autoFocus
              />
            </div>

            {/* Button: Black to Green with Snap Transition */}
            <Button
              type="submit"
              disabled={isInputEmpty || isSubmitting}
              className={`w-full h-10 sm:h-12 text-sm sm:text-base font-medium transition-all duration-75 flex items-center justify-center border-0 ${
                isInputEmpty 
                  ? "bg-black text-white opacity-100 disabled:opacity-100 disabled:bg-black" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              }`}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              )}
            </Button>
          </motion.form>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-[9px] sm:text-xs text-muted-foreground text-center leading-tight"
          >
            For educational purpose only.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            Your data is stored locally on your device.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}