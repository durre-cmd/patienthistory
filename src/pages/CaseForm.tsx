import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  User,
  Stethoscope,
  History,
  Heart,
  Pill,
  Users,
  Home,
  ClipboardList,
  TestTube,
  FileText,
  StickyNote,
  Lightbulb,
  AlertCircle,
  Activity,
  Baby,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { FormField } from '@/components/FormField';
import { VitalsGrid } from '@/components/VitalsGrid';
import { PatientCase, createEmptyCase } from '@/types/case';
import { useCases } from '@/hooks/useCases';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCaseById, addCase, updateCase } = useCases();
  
  const isEditing = Boolean(id);
  const existingCase = id ? getCaseById(id) : null;
  
  const [formData, setFormData] = useState<PatientCase>(() => {
    if (existingCase) return existingCase;
    return createEmptyCase();
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id && existingCase) {
      setFormData(existingCase);
    }
  }, [id, existingCase]);

  const updateField = <K extends keyof PatientCase>(field: K, value: PatientCase[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleVitalsChange = (field: string, value: string) => {
    const fieldMap: Record<string, keyof PatientCase> = {
      bp: 'vitalsBP',
      pulse: 'vitalsPulse',
      temp: 'vitalsTemp',
      rr: 'vitalsRR',
      spo2: 'vitalsSpO2',
    };
    updateField(fieldMap[field], value);
  };

  const handleSave = () => {
    const caseToSave = {
      ...formData,
      caseName: formData.caseName || formData.patientName || `Case ${formData.id}`,
    };

    if (isEditing) {
      updateCase(caseToSave);
      toast({
        title: 'Case Updated',
        description: `Case ${caseToSave.id} has been saved.`,
      });
    } else {
      addCase(caseToSave);
      toast({
        title: 'Case Created',
        description: `Case ${caseToSave.id} has been created.`,
      });
    }
    
    navigate('/');
  };

  const isFemale = formData.gender === 'Female';

  return (
 <div className="min-h-screen bg-background text-[103%] [&_*]:text-[97%] [&_input]:h-10.75 [&_label]:mb-2 [&_.space-y-1]:space-y-3 [&_.grid]:gap-y-6">
      {/* Header - Compact for mobile */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-foreground">
                {isEditing ? 'Edit Case' : 'New Case'}
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{formData.id}</p>
            </div>
          </div>

          <Button onClick={handleSave} size="sm" className="h-8 text-xs sm:text-sm px-3">
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
            Save
          </Button>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-notion overflow-hidden"
        >
          {/* Basic Info - Always visible */}
          <CollapsibleSection
            title="Basic Information"
            icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <FormField
                label="Case Name"
                id="caseName"
                value={formData.caseName}
                onChange={(v) => updateField('caseName', v)}
                placeholder="Optional"
              />
              <FormField
                label="Patient Name"
                id="patientName"
                value={formData.patientName}
                onChange={(v) => updateField('patientName', v)}
              />
              <FormField
                label="Date"
                id="date"
                value={formData.date}
                onChange={(v) => updateField('date', v)}
              />
              <FormField
                label="Age"
                id="age"
                value={formData.age}
                onChange={(v) => updateField('age', v)}
                placeholder="e.g., 45"
              />
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-medium">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => updateField('gender', v)}
                >
                  <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm bg-transparent border-border focus:ring-0">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-medium">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => updateField('priority', v as PatientCase['priority'])}
                >
                  <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm bg-transparent border-border focus:ring-0">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormField
                label="Weight (kg)"
                id="weight"
                value={formData.weight}
                onChange={(v) => updateField('weight', v)}
                placeholder="e.g., 70"
              />
              <FormField
                label="Height (cm)"
                id="height"
                value={formData.height}
                onChange={(v) => updateField('height', v)}
                placeholder="e.g., 170"
              />
              <FormField
                label="Occupation"
                id="occupation"
                value={formData.occupation}
                onChange={(v) => updateField('occupation', v)}
                placeholder="e.g., Teacher"
              />
              <FormField
                label="Residence"
                id="residence"
                value={formData.residence}
                onChange={(v) => updateField('residence', v)}
                placeholder="e.g., City, Country"
              />
            </div>
          </CollapsibleSection>

          {/* Chief Complaint */}
          <CollapsibleSection
            title="Chief Complaint (CC)"
            icon={<AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Chief Complaint"
              id="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={(v) => updateField('chiefComplaint', v)}
              multiline
              rows={2}
              placeholder="Patient's main concern or reason for visit..."
            />
          </CollapsibleSection>

          {/* HPI */}
          <CollapsibleSection
            title="History of Presenting Illness (HPI)"
            icon={<History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <FormField
                label="Onset"
                id="hpiOnset"
                value={formData.hpiOnset}
                onChange={(v) => updateField('hpiOnset', v)}
                placeholder="When?"
              />
              <FormField
                label="Duration"
                id="hpiDuration"
                value={formData.hpiDuration}
                onChange={(v) => updateField('hpiDuration', v)}
                placeholder="How long?"
              />
            </div>
            <FormField
              label="Progression"
              id="hpiProgression"
              value={formData.hpiProgression}
              onChange={(v) => updateField('hpiProgression', v)}
              multiline
              placeholder="How have symptoms changed?"
            />
            <FormField
              label="Associated Symptoms"
              id="hpiAssociatedSymptoms"
              value={formData.hpiAssociatedSymptoms}
              onChange={(v) => updateField('hpiAssociatedSymptoms', v)}
              multiline
              placeholder="Other symptoms..."
            />
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <FormField
                label="Aggravating"
                id="hpiAggravatingFactors"
                value={formData.hpiAggravatingFactors}
                onChange={(v) => updateField('hpiAggravatingFactors', v)}
                multiline
                rows={2}
                placeholder="Makes it worse?"
              />
              <FormField
                label="Relieving"
                id="hpiRelievingFactors"
                value={formData.hpiRelievingFactors}
                onChange={(v) => updateField('hpiRelievingFactors', v)}
                multiline
                rows={2}
                placeholder="Makes it better?"
              />
            </div>
          </CollapsibleSection>

          {/* PMH */}
          <CollapsibleSection
            title="Past Medical History (PMH)"
            icon={<Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Chronic Illnesses"
              id="pmhChronicIllnesses"
              value={formData.pmhChronicIllnesses}
              onChange={(v) => updateField('pmhChronicIllnesses', v)}
              multiline
              placeholder="Diabetes, hypertension, asthma..."
            />
            <FormField
              label="Hospitalizations/Surgeries"
              id="pmhHospitalizations"
              value={formData.pmhHospitalizations}
              onChange={(v) => updateField('pmhHospitalizations', v)}
              multiline
              placeholder="Previous admissions, surgeries..."
            />
            <FormField
              label="Allergies"
              id="pmhAllergies"
              value={formData.pmhAllergies}
              onChange={(v) => updateField('pmhAllergies', v)}
              placeholder="Drug, food, environmental..."
            />
            <FormField
              label="Vaccinations"
              id="pmhVaccinations"
              value={formData.pmhVaccinations}
              onChange={(v) => updateField('pmhVaccinations', v)}
              multiline
              placeholder="Vaccination history..."
            />
          </CollapsibleSection>

          {/* Medications */}
          <CollapsibleSection
            title="Drug / Medication History"
            icon={<Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Current Medications"
              id="currentMedications"
              value={formData.currentMedications}
              onChange={(v) => updateField('currentMedications', v)}
              multiline
              placeholder="List current medications with dosages..."
            />
            <FormField
              label="Past Medications"
              id="pastMedications"
              value={formData.pastMedications}
              onChange={(v) => updateField('pastMedications', v)}
              multiline
              placeholder="Previously prescribed medications..."
            />
            <FormField
              label="OTC / Herbal Supplements"
              id="otcHerbal"
              value={formData.otcHerbal}
              onChange={(v) => updateField('otcHerbal', v)}
              multiline
              placeholder="Over-the-counter drugs, vitamins..."
            />
          </CollapsibleSection>

          {/* Family History */}
          <CollapsibleSection
            title="Family History"
            icon={<Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Family History"
              id="familyHistory"
              value={formData.familyHistory}
              onChange={(v) => updateField('familyHistory', v)}
              multiline
              rows={3}
              placeholder="Relevant family medical history..."
            />
          </CollapsibleSection>

          {/* Social History */}
          <CollapsibleSection
            title="Social History"
            icon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Lifestyle"
              id="lifestyle"
              value={formData.lifestyle}
              onChange={(v) => updateField('lifestyle', v)}
              multiline
              placeholder="Smoking, alcohol, diet, exercise..."
            />
            <FormField
              label="Occupation / Education"
              id="socialOccupation"
              value={formData.socialOccupation}
              onChange={(v) => updateField('socialOccupation', v)}
              placeholder="Current or past occupation..."
            />
            <FormField
              label="Living Situation"
              id="livingSituation"
              value={formData.livingSituation}
              onChange={(v) => updateField('livingSituation', v)}
              placeholder="Who patient lives with..."
            />
          </CollapsibleSection>

          {/* OB/GYN History - Only shown for female patients */}
          {isFemale && (
            <CollapsibleSection
              title="OB/GYN History"
              icon={<Baby className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            >
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <FormField
                  label="LMP (Last Menstrual Period)"
                  id="obgynLMP"
                  value={formData.obgynLMP}
                  onChange={(v) => updateField('obgynLMP', v)}
                  placeholder="Date or days ago"
                />
                <FormField
                  label="Menstrual History"
                  id="obgynMenstrualHistory"
                  value={formData.obgynMenstrualHistory}
                  onChange={(v) => updateField('obgynMenstrualHistory', v)}
                  placeholder="Cycle length, regularity..."
                />
              </div>
              <FormField
                label="Obstetric History"
                id="obgynObstetricHistory"
                value={formData.obgynObstetricHistory}
                onChange={(v) => updateField('obgynObstetricHistory', v)}
                multiline
                placeholder="G_P_A_ (Gravida, Para, Abortions), deliveries..."
              />
              <FormField
                label="Contraception"
                id="obgynContraception"
                value={formData.obgynContraception}
                onChange={(v) => updateField('obgynContraception', v)}
                placeholder="Current contraceptive method..."
              />
              <FormField
                label="Gynecological History"
                id="obgynGynecologicalHistory"
                value={formData.obgynGynecologicalHistory}
                onChange={(v) => updateField('obgynGynecologicalHistory', v)}
                multiline
                placeholder="Previous conditions, procedures, Pap smears..."
              />
            </CollapsibleSection>
          )}

          {/* Vital Signs */}
          <CollapsibleSection
            title="Vital Signs"
            icon={<Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <VitalsGrid
              vitals={{
                bp: formData.vitalsBP,
                pulse: formData.vitalsPulse,
                temp: formData.vitalsTemp,
                rr: formData.vitalsRR,
                spo2: formData.vitalsSpO2,
              }}
              onChange={handleVitalsChange}
            />
          </CollapsibleSection>

          {/* Examination */}
          <CollapsibleSection
            title="Examination Findings"
            icon={<ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="General Appearance"
              id="generalVitals"
              value={formData.generalVitals}
              onChange={(v) => updateField('generalVitals', v)}
              multiline
              placeholder="General appearance, consciousness, distress..."
            />
            <FormField
              label="Systemic Examination"
              id="systemicExam"
              value={formData.systemicExam}
              onChange={(v) => updateField('systemicExam', v)}
              multiline
              rows={3}
              placeholder="CVS, RS, Abdomen, CNS findings..."
            />
            <FormField
              label="Additional Observations"
              id="examObservations"
              value={formData.examObservations}
              onChange={(v) => updateField('examObservations', v)}
              multiline
              placeholder="Any other clinical observations..."
            />
          </CollapsibleSection>

          {/* Investigations */}
          <CollapsibleSection
            title="Investigations / Lab Results"
            icon={<TestTube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Investigations & Results"
              id="investigations"
              value={formData.investigations}
              onChange={(v) => updateField('investigations', v)}
              multiline
              rows={4}
              placeholder="Blood tests, imaging, ECG, etc..."
            />
          </CollapsibleSection>

          {/* Diagnosis */}
          <CollapsibleSection
            title="Diagnosis / Impression"
            icon={<Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Provisional Diagnosis"
              id="provisionalDiagnosis"
              value={formData.provisionalDiagnosis}
              onChange={(v) => updateField('provisionalDiagnosis', v)}
              multiline
              rows={2}
              placeholder="Working diagnosis..."
            />
            <FormField
              label="Differential Diagnoses"
              id="differentialDiagnosis"
              value={formData.differentialDiagnosis}
              onChange={(v) => updateField('differentialDiagnosis', v)}
              multiline
              rows={2}
              placeholder="Other possible diagnoses..."
            />
          </CollapsibleSection>

          {/* Management */}
          <CollapsibleSection
            title="Management / Follow-up"
            icon={<FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Pharmacological"
              id="managementPharmacological"
              value={formData.managementPharmacological}
              onChange={(v) => updateField('managementPharmacological', v)}
              multiline
              rows={3}
              placeholder="Medications prescribed..."
            />
            <FormField
              label="Non-Pharmacological"
              id="managementNonPharmacological"
              value={formData.managementNonPharmacological}
              onChange={(v) => updateField('managementNonPharmacological', v)}
              multiline
              rows={2}
              placeholder="Lifestyle changes, procedures..."
            />
            <FormField
              label="Follow-up Plan"
              id="managementFollowUp"
              value={formData.managementFollowUp}
              onChange={(v) => updateField('managementFollowUp', v)}
              multiline
              rows={2}
              placeholder="Next appointment, monitoring..."
            />
          </CollapsibleSection>

          {/* Extra Notes */}
          <CollapsibleSection
            title="Extra Notes"
            icon={<StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Additional Notes"
              id="extraNotes"
              value={formData.extraNotes}
              onChange={(v) => updateField('extraNotes', v)}
              multiline
              rows={3}
              placeholder="Any additional notes..."
            />
          </CollapsibleSection>

          {/* Learning Points */}
          <CollapsibleSection
            title="Learning Points / Reflections"
            icon={<Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            <FormField
              label="Learning Points"
              id="learningPoints"
              value={formData.learningPoints}
              onChange={(v) => updateField('learningPoints', v)}
              multiline
              rows={3}
              placeholder="Key takeaways, things learned..."
            />
          </CollapsibleSection>
        </motion.div>

        {/* Bottom Save Button */}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <Button onClick={handleSave} size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
            Save Case
          </Button>
        </div>
      </main>
    </div>
  );
}
