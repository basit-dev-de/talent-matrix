
// Job Types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // Full-time, Part-time, Contract, etc.
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'active' | 'closed' | 'draft';
  hasCustomForm: boolean;
}

// Application Stage Types
export type StageType = 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'technical' 
  | 'assessment' 
  | 'reference' 
  | 'offer' 
  | 'hired' 
  | 'rejected';

export interface Stage {
  id: string;
  name: string;
  type: StageType;
  order: number;
  color?: string;
}

// Application Types
export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  resume: string; // URL to resume
  coverLetter?: string;
  currentStage: Stage;
  stageHistory: {
    stageId: string;
    enteredAt: string;
    notes?: string;
  }[];
  score: number;
  scoreBreakdown: {
    criteria: string;
    score: number;
    maxScore: number;
  }[];
  answers: Record<string, any>; // Custom form answers
  createdAt: string;
  updatedAt: string;
  isEligible: boolean;
}

// Form Builder Types
export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'file' 
  | 'number';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  value?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  weight?: number; // For scoring
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface CustomForm {
  id: string;
  jobId: string;
  name: string;
  description?: string;
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
}

// Scoring Criteria
export interface ScoringCriteria {
  id: string;
  name: string;
  description?: string;
  weight: number; // percentage of total score
  minimumScore: number; // minimum score to be eligible
  fields: {
    fieldId: string;
    weight: number;
  }[];
}
