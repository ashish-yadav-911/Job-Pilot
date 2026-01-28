export enum JobType {
  FULL_TIME = 'Full Time',
  PART_TIME = 'Part Time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship'
}

export interface CustomQuestion {
  id: string;
  question: string;
  required: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  salaryRange: string;
  description: string;
  requirements: string[]; // These are text requirements
  tags: string[]; // These are for filtering (e.g., "Python", "React")
  postedAt: string;
  
  // Standardized fields
  experienceRequired: number; // In Years
  noticePeriod: number | 'Immediate'; // Days or Immediate
  
  customQuestions: CustomQuestion[];
}

export interface UserProfile {
  name: string;
  email: string;
  resumeText: string;
  resumeFileName?: string; // UI simulation for file upload
  skills: string[]; // These match against Job Tags
  experienceYears: number;
}

export enum ApplicationStatus {
  PENDING = 'Pending',
  APPLIED = 'Applied',
  REJECTED = 'Rejected',
  INTERVIEW = 'Interview',
  NEEDS_INPUT = 'Needs Input' // New status for missing custom questions
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  aiMatchScore: number;
  aiReasoning: string;
  coverLetter: string;
  appliedAt: string;
  missingInfo?: CustomQuestion[]; // If status is NEEDS_INPUT
}

export interface AgentLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'action' | 'error' | 'warning';
}

export type ViewState = 'landing' | 'login' | 'candidate' | 'employer';
