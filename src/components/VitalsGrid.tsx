import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VitalField {
  id: string;
  label: string;
  unit: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface VitalsGridProps {
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    rr: string;
    spo2: string;
  };
  onChange: (field: string, value: string) => void;
}

export function VitalsGrid({ vitals, onChange }: VitalsGridProps) {
  const vitalFields: Omit<VitalField, 'value' | 'onChange'>[] = [
    { id: 'bp', label: 'Blood Pressure', unit: 'mmHg', placeholder: '120/80' },
    { id: 'pulse', label: 'Pulse', unit: 'bpm', placeholder: '72' },
    { id: 'temp', label: 'Temperature', unit: '°C', placeholder: '36.5' },
    { id: 'rr', label: 'Respiratory Rate', unit: '/min', placeholder: '16' },
    { id: 'spo2', label: 'O₂ Saturation', unit: '%', placeholder: '98' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      {vitalFields.map((field) => (
        <div
          key={field.id}
          className="bg-secondary/30 border border-border rounded-lg p-2 sm:p-3 text-center"
        >
          <Label className="text-[10px] sm:text-xs text-muted-foreground font-medium block mb-1">
            {field.label}
          </Label>
          <Input
            value={vitals[field.id as keyof typeof vitals]}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="h-7 sm:h-8 text-center text-xs sm:text-sm font-medium bg-background border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 block">
            {field.unit}
          </span>
        </div>
      ))}
    </div>
  );
}
