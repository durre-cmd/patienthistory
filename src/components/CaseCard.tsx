import { motion } from 'framer-motion';
import { PatientCase } from '@/types/case';
import { Calendar, FileText, Stethoscope, MoreHorizontal, Eye, Edit2, Trash2, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CaseCardProps {
  patientCase: PatientCase;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
  index: number;
}

export function CaseCard({
  patientCase,
  onView,
  onEdit,
  onDelete,
  onExport,
  index,
}: CaseCardProps) {
  const priorityClasses = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    urgent: 'priority-urgent',
  };

  const displayName = patientCase.caseName || patientCase.patientName || 'Unnamed Case';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-notion p-4 cursor-pointer group"
      onClick={onView}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">
              {patientCase.id}
            </span>
            <span className={`priority-badge ${priorityClasses[patientCase.priority]}`}>
              {patientCase.priority}
            </span>
          </div>

          <h3 className="font-medium text-foreground truncate mb-1">
            {displayName}
          </h3>

          {patientCase.provisionalDiagnosis && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="truncate">{patientCase.provisionalDiagnosis}</span>
            </div>
          )}

          {patientCase.chiefComplaint && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              <span className="font-medium">CC:</span> {patientCase.chiefComplaint}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(patientCase.date).toLocaleDateString()}
            </span>
            {patientCase.age && (
              <span>{patientCase.age} y/o</span>
            )}
            {patientCase.gender && (
              <span>{patientCase.gender}</span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport(); }}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
