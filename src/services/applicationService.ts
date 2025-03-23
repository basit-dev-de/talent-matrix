
import { Application, Stage } from '@/types';
import { getData, storeData, generateId, defaultStages } from './mockData';
import { getJobById } from './jobService';

// Get all applications
export const getApplications = (): Application[] => {
  return getData<Application[]>('applications', []);
};

// Get application by ID
export const getApplicationById = (id: string): Application | undefined => {
  const applications = getApplications();
  return applications.find(app => app.id === id);
};

// Get applications for a job
export const getApplicationsByJobId = (jobId: string): Application[] => {
  const applications = getApplications();
  return applications.filter(app => app.jobId === jobId);
};

// Create a new application
export const createApplication = (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'currentStage' | 'stageHistory'>): Application => {
  const applications = getApplications();
  const stages = getData<Stage[]>('stages', defaultStages);
  const firstStage = stages.find(s => s.order === 0) || stages[0];
  
  const newApplication: Application = {
    ...application,
    id: generateId(),
    currentStage: firstStage,
    stageHistory: [
      {
        stageId: firstStage.id,
        enteredAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  storeData('applications', [...applications, newApplication]);
  return newApplication;
};

// Update an application
export const updateApplication = (id: string, updates: Partial<Application>): Application | undefined => {
  const applications = getApplications();
  const index = applications.findIndex(app => app.id === id);
  
  if (index === -1) return undefined;
  
  const updatedApplication = {
    ...applications[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  applications[index] = updatedApplication;
  storeData('applications', applications);
  
  return updatedApplication;
};

// Delete an application
export const deleteApplication = (id: string): boolean => {
  const applications = getApplications();
  const filteredApplications = applications.filter(app => app.id !== id);
  
  if (filteredApplications.length === applications.length) return false;
  
  storeData('applications', filteredApplications);
  return true;
};

// Update application stage
export const updateApplicationStage = (
  applicationId: string, 
  stageId: string, 
  notes?: string
): Application | undefined => {
  const applications = getApplications();
  const stages = getData<Stage[]>('stages', defaultStages);
  const appIndex = applications.findIndex(app => app.id === applicationId);
  
  if (appIndex === -1) return undefined;
  
  const newStage = stages.find(s => s.id === stageId);
  if (!newStage) return undefined;
  
  const app = applications[appIndex];
  const updatedApp: Application = {
    ...app,
    currentStage: newStage,
    stageHistory: [
      ...app.stageHistory,
      {
        stageId: newStage.id,
        enteredAt: new Date().toISOString(),
        notes,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
  
  applications[appIndex] = updatedApp;
  storeData('applications', applications);
  
  return updatedApp;
};

// Get applications count by stage
export const getApplicationsCountByStage = (jobId?: string): Record<string, number> => {
  const applications = jobId 
    ? getApplicationsByJobId(jobId) 
    : getApplications();
  
  return applications.reduce((acc, app) => {
    const stageId = app.currentStage.id;
    acc[stageId] = (acc[stageId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

// Calculate application score based on criteria
export const calculateApplicationScore = (
  application: Application,
  criteria: { fieldId: string; weight: number }[]
): number => {
  // For simplicity, we'll just use the existing score in this mock implementation
  return application.score;
};

// Get recent applications
export const getRecentApplications = (limit: number = 5): Application[] => {
  const applications = getApplications();
  
  return applications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};
