export interface PatientCase {
  id: string;
  caseName: string;
  patientName: string;
  date: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  occupation: string;
  residence: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Chief Complaint
  chiefComplaint: string;
  
  // History of Presenting Illness
  hpiOnset: string;
  hpiDuration: string;
  hpiProgression: string;
  hpiAssociatedSymptoms: string;
  hpiAggravatingFactors: string;
  hpiRelievingFactors: string;
  
  // Past Medical History
  pmhChronicIllnesses: string;
  pmhHospitalizations: string;
  pmhAllergies: string;
  pmhVaccinations: string;
  
  // Drug/Medication History
  currentMedications: string;
  pastMedications: string;
  otcHerbal: string;
  
  // Family History
  familyHistory: string;
  
  // Social History
  lifestyle: string;
  socialOccupation: string;
  livingSituation: string;
  
  // OB/GYN History (Female only)
  obgynLMP: string;
  obgynMenstrualHistory: string;
  obgynObstetricHistory: string;
  obgynContraception: string;
  obgynGynecologicalHistory: string;
  
  // Vital Signs
  vitalsBP: string;
  vitalsPulse: string;
  vitalsTemp: string;
  vitalsRR: string;
  vitalsSpO2: string;
  
  // Examination Findings
  generalVitals: string; // Keep for backwards compatibility
  systemicExam: string;
  examObservations: string;
  
  // Investigations
  investigations: string;
  
  // Diagnosis
  provisionalDiagnosis: string;
  differentialDiagnosis: string;
  
  // Management
  managementPharmacological: string;
  managementNonPharmacological: string;
  managementFollowUp: string;
  managementNotes: string; // Keep for backwards compatibility
  
  // Extra Notes
  extraNotes: string;
  
  // Learning Points
  learningPoints: string;
  
  // Attachments (stored as base64 or URLs)
  attachments: string[];
  
  createdAt: string;
  updatedAt: string;
}

export const createEmptyCase = (): PatientCase => ({
  id: generateCaseId(),
  caseName: '',
  patientName: '',
  date: new Date().toISOString().split('T')[0],
  age: '',
  gender: '',
  weight: '',
  height: '',
  occupation: '',
  residence: '',
  priority: 'low',
  chiefComplaint: '',
  hpiOnset: '',
  hpiDuration: '',
  hpiProgression: '',
  hpiAssociatedSymptoms: '',
  hpiAggravatingFactors: '',
  hpiRelievingFactors: '',
  pmhChronicIllnesses: '',
  pmhHospitalizations: '',
  pmhAllergies: '',
  pmhVaccinations: '',
  currentMedications: '',
  pastMedications: '',
  otcHerbal: '',
  familyHistory: '',
  lifestyle: '',
  socialOccupation: '',
  livingSituation: '',
  obgynLMP: '',
  obgynMenstrualHistory: '',
  obgynObstetricHistory: '',
  obgynContraception: '',
  obgynGynecologicalHistory: '',
  vitalsBP: '',
  vitalsPulse: '',
  vitalsTemp: '',
  vitalsRR: '',
  vitalsSpO2: '',
  generalVitals: '',
  systemicExam: '',
  examObservations: '',
  investigations: '',
  provisionalDiagnosis: '',
  differentialDiagnosis: '',
  managementPharmacological: '',
  managementNonPharmacological: '',
  managementFollowUp: '',
  managementNotes: '',
  extraNotes: '',
  learningPoints: '',
  attachments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function generateCaseId(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PH${year}${month}-${random}`;
}
