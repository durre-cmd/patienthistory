import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientCase } from '@/types/case';

const DISCLAIMER = 'For educational purposes only';
function addPageHeader(doc: jsPDF, studentName: string, patientCase: PatientCase) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title (Left Aligned for a cleaner look)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('PATIENT HISTORY REPORT', 14, 20);
  
  // Aesthetic Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, 24, pageWidth - 14, 24);
  
  // Case Info Row (Meta data)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('CASE INFORMATION', 14, 32);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`ID: ${patientCase.id}`, 14, 38);
  doc.text(`Date: ${patientCase.date}`, pageWidth / 2, 38, { align: 'center' });
  doc.text(`Student: ${studentName}`, pageWidth - 14, 38, { align: 'right' });

  // Subtle Note (Smaller and less intrusive)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text('This document is generated for educational purposes only.', 14, 45);
  
  // Return the new yPos to start the tables
  return 52;
}
function addPageFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(DISCLAIMER, pageWidth / 2, pageHeight - 10, { align: 'center' });
}

function checkPageBreak(doc: jsPDF, yPos: number): number {
  if (yPos > 250) {
    doc.addPage();
    return 20; // Simple top margin for continuation pages
  }
  return yPos;
}

function addSectionTable(
  doc: jsPDF, 
  yPos: number, 
  title: string, 
  data: (string | string[])[][]
): number {
  yPos = checkPageBreak(doc, yPos);
  
  autoTable(doc, {
    startY: yPos,
    head: [[title, '']],
    body: data,
    theme: 'plain',
    headStyles: { 
      fillColor: [220, 220, 220], 
      textColor: [30, 30, 30],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
  });
  
  return (doc as any).lastAutoTable.finalY + 8;
}

function addSingleColumnSection(
  doc: jsPDF, 
  yPos: number, 
  title: string, 
  content: string
): number {
  if (!content) return yPos;
  
  yPos = checkPageBreak(doc, yPos);
  
  autoTable(doc, {
    startY: yPos,
    head: [[title]],
    body: [[content]],
    theme: 'plain',
    headStyles: { 
      fillColor: [220, 220, 220], 
      textColor: [30, 30, 30],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
    },
    margin: { left: 14, right: 14 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
  });
  
  return (doc as any).lastAutoTable.finalY + 8;
}

export function exportCasesToPDF(cases: PatientCase[], studentName: string) {
  const doc = new jsPDF();
  
  cases.forEach((patientCase, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    let yPos = addPageHeader(doc, studentName, patientCase);
    
    // Patient Information Table with boxes
    const patientInfoData = [
      ['Patient Name', patientCase.patientName || 'N/A'],
      ['Age', patientCase.age || 'N/A'],
      ['Gender', patientCase.gender || 'N/A'],
      ['Weight', patientCase.weight ? `${patientCase.weight} kg` : 'N/A'],
      ['Height', patientCase.height ? `${patientCase.height} cm` : 'N/A'],
      ['Occupation', patientCase.occupation || 'N/A'],
      ['Residence', patientCase.residence || 'N/A'],
      ['Priority', patientCase.priority.toUpperCase()],
    ];
    yPos = addSectionTable(doc, yPos, 'PATIENT INFORMATION', patientInfoData);
    
    // Chief Complaint
    if (patientCase.chiefComplaint) {
      yPos = addSingleColumnSection(doc, yPos, 'CHIEF COMPLAINT', patientCase.chiefComplaint);
    }
    
    // HPI
    const hpiData = [
      ['Onset', patientCase.hpiOnset || ''],
      ['Duration', patientCase.hpiDuration || ''],
      ['Progression', patientCase.hpiProgression || ''],
      ['Associated Symptoms', patientCase.hpiAssociatedSymptoms || ''],
      ['Aggravating Factors', patientCase.hpiAggravatingFactors || ''],
      ['Relieving Factors', patientCase.hpiRelievingFactors || ''],
    ].filter(([_, value]) => value);
    
    if (hpiData.length > 0) {
      yPos = addSectionTable(doc, yPos, 'HISTORY OF PRESENTING ILLNESS', hpiData);
    }
    
    // Past Medical History
    const pmhData = [
      ['Medical History', patientCase.pmhChronicIllnesses || ''],
      ['Surgical History', patientCase.pmhHospitalizations || ''],
      ['Drug Allergies', patientCase.pmhAllergies || ''],
      ['Vaccinations', patientCase.pmhVaccinations || ''],
    ].filter(([_, value]) => value);
    
    if (pmhData.length > 0) {
      yPos = addSectionTable(doc, yPos, 'PAST HISTORY', pmhData);
    }
    
    // Medications
    const medData = [
      ['Current Medications', patientCase.currentMedications || ''],
      ['Past Medications', patientCase.pastMedications || ''],
      ['OTC/Herbal', patientCase.otcHerbal || ''],
    ].filter(([_, value]) => value);
    
    if (medData.length > 0) {
      yPos = addSectionTable(doc, yPos, 'MEDICATION HISTORY', medData);
    }
    
    // Family History
    if (patientCase.familyHistory) {
      yPos = addSingleColumnSection(doc, yPos, 'FAMILY HISTORY', patientCase.familyHistory);
    }
    
    // Social History
    const socialData = [
      ['Lifestyle', patientCase.lifestyle || ''],
      ['Occupation/Education', patientCase.socialOccupation || patientCase.occupation || ''],
      ['Living Situation', patientCase.livingSituation || ''],
    ].filter(([_, value]) => value);
    
    if (socialData.length > 0) {
      yPos = addSectionTable(doc, yPos, 'SOCIAL HISTORY', socialData);
    }
    
    // OB/GYN History (only for female patients)
    if (patientCase.gender === 'Female') {
      const obgynData = [
        ['LMP', patientCase.obgynLMP || ''],
        ['Menstrual History', patientCase.obgynMenstrualHistory || ''],
        ['Obstetric History', patientCase.obgynObstetricHistory || ''],
        ['Contraception', patientCase.obgynContraception || ''],
        ['Gynecological History', patientCase.obgynGynecologicalHistory || ''],
      ].filter(([_, value]) => value);
      
      if (obgynData.length > 0) {
        yPos = addSectionTable(doc, yPos, 'OB/GYN HISTORY', obgynData);
      }
    }
    
    // Vital Signs - in boxes
    yPos = checkPageBreak(doc, yPos);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(30, 30, 30);
    doc.rect(14, yPos, doc.internal.pageSize.getWidth() - 28, 7, 'F');
    doc.text('VITAL SIGNS', 18, yPos + 5);
    doc.setTextColor(0, 0, 0);
    yPos += 10;
    
    // Create vital sign boxes
    const vitals = [
      { label: 'BP', value: patientCase.vitalsBP || '___/___', unit: 'mmHg' },
      { label: 'Pulse', value: patientCase.vitalsPulse || '___', unit: 'bpm' },
      { label: 'Temp', value: patientCase.vitalsTemp || '___', unit: '°C' },
      { label: 'RR', value: patientCase.vitalsRR || '___', unit: '/min' },
      { label: 'SpO2', value: patientCase.vitalsSpO2 || '___', unit: '%' },
    ];
    
    const boxWidth = (doc.internal.pageSize.getWidth() - 28 - 16) / 5;
    const boxHeight = 18;
    
    vitals.forEach((vital, i) => {
      const xPos = 14 + (i * (boxWidth + 4));
      
      // Box outline
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(xPos, yPos, boxWidth, boxHeight);
      
      // Label
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(vital.label, xPos + boxWidth / 2, yPos + 5, { align: 'center' });
      
      // Value
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(vital.value, xPos + boxWidth / 2, yPos + 11, { align: 'center' });
      
      // Unit
      doc.setFontSize(6);
      doc.setFont('helvetica', 'italic');
      doc.text(vital.unit, xPos + boxWidth / 2, yPos + 16, { align: 'center' });
    });
    
    yPos += boxHeight + 10;
    
    // Examination
    const examData = [
      ['General', patientCase.generalVitals || ''],
      ['Systemic', patientCase.systemicExam || ''],
      ['Observations', patientCase.examObservations || ''],
    ].filter(([_, value]) => value);
    
    if (examData.length > 0) {
      yPos = addSectionTable(doc, yPos, 'EXAMINATION FINDINGS', examData);
    }
    
    // Investigations
    if (patientCase.investigations) {
      yPos = addSingleColumnSection(doc, yPos, 'INVESTIGATIONS / LAB RESULTS', patientCase.investigations);
    }
    
    // Diagnosis
    const diagnosisData = [
      ['Provisional Diagnosis', patientCase.provisionalDiagnosis || ''],
      ['Differential Diagnoses', patientCase.differentialDiagnosis || ''],
    ].filter(([_, value]) => value);
    
    if (diagnosisData.length > 0) {
      yPos = addSectionTable(doc, yPos, 'DIAGNOSIS / IMPRESSION', diagnosisData);
    }
    
    // Management
    const managementData = [
      ['Pharmacological', patientCase.managementPharmacological || ''],
      ['Non-Pharmacological', patientCase.managementNonPharmacological || ''],
      ['Follow-up Plan', patientCase.managementFollowUp || ''],
      ['Notes', patientCase.managementNotes || ''],
    ].filter(([_, value]) => value);
    
    if (managementData.length > 0) {
      yPos = addSectionTable(doc, yPos, 'MANAGEMENT / FOLLOW-UP', managementData);
    }
    
    // Extra Notes
    if (patientCase.extraNotes) {
      yPos = addSingleColumnSection(doc, yPos, 'ADDITIONAL NOTES', patientCase.extraNotes);
    }
    
    // Learning Points
    if (patientCase.learningPoints) {
      yPos = addSingleColumnSection(doc, yPos, 'LEARNING POINTS / REFLECTIONS', patientCase.learningPoints);
    }
  });
  
  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageFooter(doc);
  }
  
  const fileName = cases.length === 1 
    ? `${cases[0].id}_patient_history.pdf`
    : `patient_histories_${new Date().toISOString().split('T')[0]}.pdf`;
  
  doc.save(fileName);
}
