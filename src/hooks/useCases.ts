import { useLocalStorage } from './useLocalStorage';
import { PatientCase, createEmptyCase } from '@/types/case';
import { useCallback } from 'react';

export function useCases() {
  const [cases, setCases] = useLocalStorage<PatientCase[]>('patient-cases', []);

  const addCase = useCallback((newCase: PatientCase) => {
    setCases((prev) => [...prev, { ...newCase, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
  }, [setCases]);

  const updateCase = useCallback((updatedCase: PatientCase) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === updatedCase.id
          ? { ...updatedCase, updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, [setCases]);

  const deleteCase = useCallback((caseId: string) => {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
  }, [setCases]);

  const getCaseById = useCallback((caseId: string) => {
    return cases.find((c) => c.id === caseId);
  }, [cases]);

  const searchCases = useCallback((query: string) => {
    if (!query.trim()) return cases;
    const lowerQuery = query.toLowerCase();
    return cases.filter(
      (c) =>
        c.id.toLowerCase().includes(lowerQuery) ||
        c.caseName.toLowerCase().includes(lowerQuery) ||
        c.patientName.toLowerCase().includes(lowerQuery) ||
        c.chiefComplaint.toLowerCase().includes(lowerQuery) ||
        c.provisionalDiagnosis.toLowerCase().includes(lowerQuery)
    );
  }, [cases]);

  return {
    cases,
    addCase,
    updateCase,
    deleteCase,
    getCaseById,
    searchCases,
    createEmptyCase,
  };
}
