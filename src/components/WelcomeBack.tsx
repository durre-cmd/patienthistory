import { motion } from 'framer-motion';
import { Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeBackProps {
  studentName: string;
  onContinue: () => void;
}

export function WelcomeBack({ studentName, onContinue }: WelcomeBackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-notion p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Stethoscope className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold text-foreground mb-2"
          >
            Welcome back, {studentName}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            Ready to continue documenting your patient cases?
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={onContinue}
              className="w-full h-12 text-base font-medium"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            Your cases are stored locally on this device.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
