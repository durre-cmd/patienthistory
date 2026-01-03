import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit2,
  Download,
  Trash2,
  Calendar,
  User,
  Stethoscope,
  AlertCircle,
  Activity,
  Baby,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCases } from '@/hooks/useCases';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exportCasesToPDF } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCaseById, deleteCase } = useCases();
  const [studentName] = useLocalStorage('student-name', '');
  
  const patientCase = id ? getCaseById(id) : null;

  if (!patientCase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Case Not Found</h1>
          <p className="text-muted-foreground mb-4">The case you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    exportCasesToPDF([patientCase], studentName);
    toast({
      title: 'PDF Exported',
      description: `${patientCase.id} has been exported successfully.`,
    });
  };

  const handleDelete = () => {
    deleteCase(patientCase.id);
    toast({
      title: 'Case Deleted',
      description: `${patientCase.id} has been deleted.`,
    });
    navigate('/');
  };

  const priorityClasses = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    urgent: 'priority-urgent',
  };

  const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) => {
    if (!children || (typeof children === 'string' && !children.trim())) return null;
    
    return (
      <div className="border-b border-border pb-3 sm:pb-4 mb-3 sm:mb-4 last:border-0 last:pb-0 last:mb-0">
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h3 className="font-medium text-foreground text-sm sm:text-base">{title}</h3>
        </div>
        <div className="text-foreground/80 whitespace-pre-wrap text-xs sm:text-sm">{children}</div>
      </div>
    );
  };

  const Field = ({ label, value }: { label: string; value: string }) => {
    if (!value) return null;
    return (
      <div className="mb-1.5 sm:mb-2">
        <span className="text-xs sm:text-sm text-muted-foreground">{label}: </span>
        <span className="text-foreground text-xs sm:text-sm">{value}</span>
      </div>
    );
  };

  const VitalBox = ({ label, value, unit }: { label: string; value: string; unit: string }) => {
    if (!value) return null;
    return (
      <div className="bg-secondary/30 border border-border rounded-lg p-2 sm:p-3 text-center">
        <div className="text-[9px] sm:text-xs text-muted-foreground font-medium">{label}</div>
        <div className="text-sm sm:text-base font-semibold text-foreground">{value}</div>
        <div className="text-[8px] sm:text-[10px] text-muted-foreground">{unit}</div>
      </div>
    );
  };

  const hasVitals = patientCase.vitalsBP || patientCase.vitalsPulse || patientCase.vitalsTemp || 
                   patientCase.vitalsRR || patientCase.vitalsSpO2;

  const hasOBGYN = patientCase.gender === 'Female' && (
    patientCase.obgynLMP || patientCase.obgynMenstrualHistory || patientCase.obgynObstetricHistory ||
    patientCase.obgynContraception || patientCase.obgynGynecologicalHistory
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
<header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
  <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
    {/* Back button + Case Name */}
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <div className="flex flex-col min-w-0">
        <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">
          {patientCase.caseName || patientCase.patientName || 'Case Details'}
        </h1>
        <p className="text-[10px] sm:text-xs text-muted-foreground truncate opacity-70">
          {patientCase.id}
        </p>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-1.5 shrink-0">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 w-9 sm:w-auto px-0 sm:px-3 text-xs gap-1.5" 
        onClick={handleExport}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PDF</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 w-9 sm:w-auto px-0 sm:px-3 text-xs gap-1.5"
        onClick={() => navigate(`/case/edit/${patientCase.id}`)}
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Edit</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-9 px-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-border"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Case?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete case {patientCase.id}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Overview Card */}
          <div className="card-notion p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <span className={`priority-badge ${priorityClasses[patientCase.priority]} mb-2 inline-block text-[10px] sm:text-xs`}>
                  {patientCase.priority.toUpperCase()}
                </span>
                <h2 className="text-base sm:text-xl font-semibold text-foreground">
                  {patientCase.caseName || patientCase.patientName || 'Unnamed Case'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span>{new Date(patientCase.date).toLocaleDateString()}</span>
              </div>
              {patientCase.patientName && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="truncate">{patientCase.patientName}</span>
                </div>
              )}
              {patientCase.age && <span>{patientCase.age} years old</span>}
              {patientCase.gender && <span>{patientCase.gender}</span>}
              {patientCase.weight && <span>{patientCase.weight} kg</span>}
              {patientCase.height && <span>{patientCase.height} cm</span>}
              {patientCase.occupation && <span className="truncate">{patientCase.occupation}</span>}
              {patientCase.residence && <span className="truncate">{patientCase.residence}</span>}
            </div>

            {patientCase.provisionalDiagnosis && (
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-foreground mb-1">
                  <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4" />
                  Diagnosis
                </div>
                <p className="text-foreground/80 text-xs sm:text-sm">{patientCase.provisionalDiagnosis}</p>
                {patientCase.differentialDiagnosis && (
                  <p className="text-foreground/60 text-xs mt-1">
                    <span className="font-medium">Differentials: </span>{patientCase.differentialDiagnosis}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Chief Complaint */}
          {patientCase.chiefComplaint && (
            <div className="card-notion p-4 sm:p-6">
              <Section title="Chief Complaint" icon={<AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />}>
                {patientCase.chiefComplaint}
              </Section>
            </div>
          )}

          {/* Vital Signs - Boxes */}
          {hasVitals && (
            <div className="card-notion p-4 sm:p-6">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground text-sm sm:text-base">Vital Signs</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <VitalBox label="BP" value={patientCase.vitalsBP} unit="mmHg" />
                <VitalBox label="Pulse" value={patientCase.vitalsPulse} unit="bpm" />
                <VitalBox label="Temp" value={patientCase.vitalsTemp} unit="°C" />
                <VitalBox label="RR" value={patientCase.vitalsRR} unit="/min" />
                <VitalBox label="SpO2" value={patientCase.vitalsSpO2} unit="%" />
              </div>
            </div>
          )}

          {/* HPI */}
          {(patientCase.hpiOnset || patientCase.hpiDuration || patientCase.hpiProgression || 
            patientCase.hpiAssociatedSymptoms || patientCase.hpiAggravatingFactors || patientCase.hpiRelievingFactors) && (
            <div className="card-notion p-4 sm:p-6">
              <h3 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">History of Presenting Illness</h3>
              <Field label="Onset" value={patientCase.hpiOnset} />
              <Field label="Duration" value={patientCase.hpiDuration} />
              <Field label="Progression" value={patientCase.hpiProgression} />
              <Field label="Associated Symptoms" value={patientCase.hpiAssociatedSymptoms} />
              <Field label="Aggravating Factors" value={patientCase.hpiAggravatingFactors} />
              <Field label="Relieving Factors" value={patientCase.hpiRelievingFactors} />
            </div>
          )}

          {/* PMH */}
          {(patientCase.pmhChronicIllnesses || patientCase.pmhHospitalizations || 
            patientCase.pmhAllergies || patientCase.pmhVaccinations) && (
            <div className="card-notion p-4 sm:p-6">
              <h3 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Past Medical History</h3>
              <Field label="Chronic Illnesses" value={patientCase.pmhChronicIllnesses} />
              <Field label="Hospitalizations/Surgeries" value={patientCase.pmhHospitalizations} />
              <Field label="Allergies" value={patientCase.pmhAllergies} />
              <Field label="Vaccinations" value={patientCase.pmhVaccinations} />
            </div>
          )}

          {/* Medications */}
          {(patientCase.currentMedications || patientCase.pastMedications || patientCase.otcHerbal) && (
            <div className="card-notion p-4 sm:p-6">
              <h3 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Medication History</h3>
              <Field label="Current Medications" value={patientCase.currentMedications} />
              <Field label="Past Medications" value={patientCase.pastMedications} />
              <Field label="OTC/Herbal" value={patientCase.otcHerbal} />
            </div>
          )}

          {/* Family History */}
          {patientCase.familyHistory && (
            <div className="card-notion p-4 sm:p-6">
              <Section title="Family History">{patientCase.familyHistory}</Section>
            </div>
          )}

          {/* Social History */}
          {(patientCase.lifestyle || patientCase.socialOccupation || patientCase.livingSituation) && (
            <div className="card-notion p-4 sm:p-6">
              <h3 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Social History</h3>
              <Field label="Lifestyle" value={patientCase.lifestyle} />
              <Field label="Occupation" value={patientCase.socialOccupation} />
              <Field label="Living Situation" value={patientCase.livingSituation} />
            </div>
          )}

          {/* OB/GYN History - Female only */}
          {hasOBGYN && (
            <div className="card-notion p-4 sm:p-6">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <Baby className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground text-sm sm:text-base">OB/GYN History</h3>
              </div>
              <Field label="LMP" value={patientCase.obgynLMP} />
              <Field label="Menstrual History" value={patientCase.obgynMenstrualHistory} />
              <Field label="Obstetric History" value={patientCase.obgynObstetricHistory} />
              <Field label="Contraception" value={patientCase.obgynContraception} />
              <Field label="Gynecological History" value={patientCase.obgynGynecologicalHistory} />
            </div>
          )}

          {/* Examination */}
          {(patientCase.generalVitals || patientCase.systemicExam || patientCase.examObservations) && (
            <div className="card-notion p-4 sm:p-6">
              <h3 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Examination Findings</h3>
              <Field label="General" value={patientCase.generalVitals} />
              <Field label="Systemic Exam" value={patientCase.systemicExam} />
              <Field label="Observations" value={patientCase.examObservations} />
            </div>
          )}

          {/* Investigations */}
          {patientCase.investigations && (
            <div className="card-notion p-4 sm:p-6">
              <Section title="Investigations / Lab Results">{patientCase.investigations}</Section>
            </div>
          )}

          {/* Management */}
          {(patientCase.managementPharmacological || patientCase.managementNonPharmacological || 
            patientCase.managementFollowUp || patientCase.managementNotes) && (
            <div className="card-notion p-4 sm:p-6">
              <h3 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Management / Follow-up</h3>
              <Field label="Pharmacological" value={patientCase.managementPharmacological} />
              <Field label="Non-Pharmacological" value={patientCase.managementNonPharmacological} />
              <Field label="Follow-up Plan" value={patientCase.managementFollowUp} />
              {patientCase.managementNotes && <Field label="Notes" value={patientCase.managementNotes} />}
            </div>
          )}

          {/* Extra Notes */}
          {patientCase.extraNotes && (
            <div className="card-notion p-4 sm:p-6">
              <Section title="Additional Notes">{patientCase.extraNotes}</Section>
            </div>
          )}

          {/* Learning Points */}
          {patientCase.learningPoints && (
            <div className="card-notion p-4 sm:p-6 bg-accent/30">
              <Section title="Learning Points / Reflections">{patientCase.learningPoints}</Section>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
