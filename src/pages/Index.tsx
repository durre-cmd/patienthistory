import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Plus,
  Search,
  Download,
  Stethoscope,
  FileText,
  X,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CaseCard } from '@/components/CaseCard';
import { StudentSetup } from '@/components/StudentSetup';

import { useCases } from '@/hooks/useCases';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exportCasesToPDF } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { PatientCase } from '@/types/case';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

useEffect(() => {
  const onScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);

const headerTransition = {
  duration: 0.18,
  ease: [0.25, 0.1, 0.25, 1], // iOS-like
};


const isCollapsed = scrollY > 8; // FAST iOS-style collapse

  const navigate = useNavigate();
  const { toast } = useToast();
  
  
  const [studentName, setStudentName] = useLocalStorage('student-name', '');
 
  

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName);
  const { cases, deleteCase, searchCases } = useCases();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());

  // New: scroll state for hiding Hi Name
  const [hideName, setHideName] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHideName(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setStudentName(tempName.trim());
      setIsEditingName(false);
      toast({
        title: 'Name Updated',
        description: 'Your name has been updated successfully.',
      });
    }
  };

  

  const filteredCases = useMemo(() => {
    return searchCases(searchQuery).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [searchCases, searchQuery]);

  const handleExportSingle = (patientCase: PatientCase) => {
    exportCasesToPDF([patientCase], studentName);
    toast({
      title: 'PDF Exported',
      description: `${patientCase.id} has been exported successfully.`,
    });
  };

  const handleExportSelected = () => {
    const casesToExport = cases.filter((c) => selectedCases.has(c.id));
    if (casesToExport.length > 0) {
      exportCasesToPDF(casesToExport, studentName);
      toast({
        title: 'PDF Exported',
        description: `${casesToExport.length} case(s) exported successfully.`,
      });
      setSelectedCases(new Set());
      setIsSelecting(false);
    }
  };

  const handleExportAll = () => {
    if (cases.length > 0) {
      exportCasesToPDF(cases, studentName);
      toast({
        title: 'PDF Exported',
        description: `All ${cases.length} cases exported successfully.`,
      });
    }
  };

  const toggleSelection = (caseId: string) => {
    setSelectedCases((prev) => {
      const next = new Set(prev);
      if (next.has(caseId)) {
        next.delete(caseId);
      } else {
        next.add(caseId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCases.size === filteredCases.length) {
      setSelectedCases(new Set());
    } else {
      setSelectedCases(new Set(filteredCases.map((c) => c.id)));
    }
  };

  // Show setup if no student name (first time user)
  if (!studentName) {
    return <StudentSetup onComplete={setStudentName} />;
  }

 

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
    <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border">
  <motion.div
    animate={{
      paddingTop: isCollapsed ? 8 : 16,
      paddingBottom: isCollapsed ? 8 : 16,
    }}
    transition={{ duration: 0.12, ease: 'easeOut' }}
    className="max-w-4xl mx-auto px-4 flex flex-col gap-2"
  >
    {/* TOP ROW */}
    <div className="flex items-center justify-between gap-2">
      {/* Logo + Title */}
      <div className="flex items-center gap-2 min-w-0">
        <motion.div
          animate={{ scale: isCollapsed ? 0.9 : 1 }}
          transition={{ duration: 0.12 }}
          className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0"
           style={{
      width: 'clamp(1rem, 8vw, 2.5rem)',
      height: 'clamp(1rem, 8vw, 2.5rem)',
    }}
        >
          <Stethoscope className="w-5 h-5 text-primary-foreground" style={{
        width: 'clamp(1rem, 4vw, 1.5rem)',
        height: 'clamp(1rem, 4vw, 1.5rem)',
      }}/>
          
        </motion.div>

        <motion.h1
          animate={{ fontSize: isCollapsed ? '1rem' : '1.15rem' }}
          transition={{ duration: 0.12 }}
          className="font-bold truncate whitespace-nowrap"
            style={{ fontSize: 'clamp(1rem, 5vw, 1.5rem)' }}
        >
          Patient History
        </motion.h1>
      </div>

      {/* ACTION BUTTONS — text restored */}
      
        
  <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
  {cases.length > 0 && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          /* Usual Size: h-8. Responsive: w-9 (square) on mobile, w-auto on sm+ */
          className="h-8 w-9 sm:w-auto px-0 sm:px-3 text-xs sm:text-sm gap-1.5 border-border"
        >
          <Download className="w-4 h-4" />
          {/* Label: Hidden on mobile, shown on sm (small) screens and up */}
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setIsSelecting(true)}>
          Select cases to export
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportAll}>
          Export all ({cases.length})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}

  <Button
    size="sm"
    /* Usual Size: h-8. Responsive: w-9 (square) on mobile, w-auto on sm+ */
    className="h-8 w-9 sm:w-auto px-0 sm:px-3 text-xs sm:text-sm gap-1.5"
    onClick={() => navigate('/case/new')}
  >
    <Plus className="w-4 h-4" />
    <span className="hidden sm:inline">New Case</span>
  </Button>
</div>
    </div>

    {/* @NAME — slides up smoothly */}
    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.12 }}
          className="text-sm text-muted-foreground"
        >
          @{studentName}
        </motion.div>
      )}
    </AnimatePresence>

    {/* SEARCH — SAME MOTION AS NAME */}
   <motion.div
  animate={{   y: isCollapsed ? -1 : 0, }}   // smaller movement
  transition={{ duration: 0.3,
    ease: "easeInOut", }}
  className="relative"
>

      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by ID, name, complaint, or diagnosis…"
        className="pl-9 h-9 bg-secondary/50 placeholder:text-sm sm:placeholder:text-sm focus:outline-none focus:ring-0 w-full"
      />
    </motion.div>
  </motion.div>
</header>



      {/* Selection Bar & Main Content (unchanged) */}
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="sticky top-[105px] z-10 bg-primary text-primary-foreground py-2 px-4"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={
                    selectedCases.size === filteredCases.length &&
                    filteredCases.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  className="border-primary-foreground/50 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                />
                <span className="text-sm">
                  {selectedCases.size} of {filteredCases.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportSelected}
                  disabled={selectedCases.size === 0}
                  className={`transition-all duration-75 border-border !opacity-100 ${
                    selectedCases.size > 0
                      ? 'bg-[#04AA6D] !text-white border-[#04AA6D] hover:bg-[#04AA6D]'
                      : 'bg-white !text-black hover:bg-white border-gray-300'
                  }`}
                >
                  <Download
                    className={`w-4 h-4 mr-2 !opacity-100 ${
                      selectedCases.size > 0 ? 'text-white' : 'text-black'
                    }`}
                  />
                  <span className="!opacity-100">Export Selected</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSelecting(false);
                    setSelectedCases(new Set());
                  }}
                  className="text-white hover:bg-red-600 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content and cases list - unchanged */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {cases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              No Cases Yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start documenting your patient encounters. Each case is saved locally
              and can be exported as a professional PDF.
            </p>
            <Button onClick={() => navigate('/case/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Case
            </Button>
          </motion.div>
        ) : filteredCases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">
              No Results Found
            </h2>
            <p className="text-muted-foreground">
              Try adjusting your search query or filters.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((patientCase, index) => (
              <div key={patientCase.id} className="flex items-start gap-3">
                {isSelecting && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="pt-4"
                  >
                    <Checkbox
                      checked={selectedCases.has(patientCase.id)}
                      onCheckedChange={() => toggleSelection(patientCase.id)}
                    />
                  </motion.div>
                )}
                <div className="flex-1">
                  <CaseCard
                    patientCase={patientCase}
                    onView={() => navigate(`/case/${patientCase.id}`)}
                    onEdit={() => navigate(`/case/edit/${patientCase.id}`)}
                    onDelete={() => {
                      deleteCase(patientCase.id);
                      toast({
                        title: 'Case Deleted',
                        description: `${patientCase.id} has been deleted.`,
                      });
                    }}
                    onExport={() => handleExportSingle(patientCase)}
                    index={index}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {cases.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground"
          >
            {cases.length} case{cases.length !== 1 ? 's' : ''} saved locally
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
