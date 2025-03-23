
import { Job } from '@/types';
import { getData, storeData, generateId } from './mockData';

// Get all jobs
export const getJobs = (): Job[] => {
  return getData<Job[]>('jobs', []);
};

// Get job by ID
export const getJobById = (id: string): Job | undefined => {
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
};

// Create a new job
export const createJob = (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
  const jobs = getJobs();
  const newJob: Job = {
    ...job,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  storeData('jobs', [...jobs, newJob]);
  return newJob;
};

// Update a job
export const updateJob = (id: string, updates: Partial<Job>): Job | undefined => {
  const jobs = getJobs();
  const index = jobs.findIndex(job => job.id === id);
  
  if (index === -1) return undefined;
  
  const updatedJob = {
    ...jobs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  jobs[index] = updatedJob;
  storeData('jobs', jobs);
  
  return updatedJob;
};

// Delete a job
export const deleteJob = (id: string): boolean => {
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.id !== id);
  
  if (filteredJobs.length === jobs.length) return false;
  
  storeData('jobs', filteredJobs);
  return true;
};

// Get active jobs count
export const getActiveJobsCount = (): number => {
  const jobs = getJobs();
  return jobs.filter(job => job.status === 'active').length;
};

// Get jobs by status
export const getJobsByStatus = (status: 'active' | 'closed' | 'draft'): Job[] => {
  const jobs = getJobs();
  return jobs.filter(job => job.status === status);
};

// Search jobs by keyword
export const searchJobs = (keyword: string): Job[] => {
  if (!keyword.trim()) return getJobs();
  
  const jobs = getJobs();
  const lowerKeyword = keyword.toLowerCase();
  
  return jobs.filter(job => 
    job.title.toLowerCase().includes(lowerKeyword) ||
    job.company.toLowerCase().includes(lowerKeyword) ||
    job.description.toLowerCase().includes(lowerKeyword) ||
    job.location.toLowerCase().includes(lowerKeyword) ||
    job.department.toLowerCase().includes(lowerKeyword)
  );
};

// Filter jobs by multiple criteria
export const filterJobs = (filters: {
  status?: 'active' | 'closed' | 'draft';
  department?: string;
  location?: string;
  type?: string;
  hasCustomForm?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}): Job[] => {
  let jobs = getJobs();
  
  if (filters.status) {
    jobs = jobs.filter(job => job.status === filters.status);
  }
  
  if (filters.department) {
    jobs = jobs.filter(job => job.department.toLowerCase() === filters.department.toLowerCase());
  }
  
  if (filters.location) {
    jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
  }
  
  if (filters.type) {
    jobs = jobs.filter(job => job.type.toLowerCase() === filters.type.toLowerCase());
  }
  
  if (filters.hasCustomForm !== undefined) {
    jobs = jobs.filter(job => job.hasCustomForm === filters.hasCustomForm);
  }
  
  if (filters.createdAfter) {
    jobs = jobs.filter(job => new Date(job.createdAt) >= filters.createdAfter);
  }
  
  if (filters.createdBefore) {
    jobs = jobs.filter(job => new Date(job.createdAt) <= filters.createdBefore);
  }
  
  return jobs;
};

// Sort jobs by various fields
export const sortJobs = (jobs: Job[], sortBy: keyof Job, ascending: boolean = true): Job[] => {
  return [...jobs].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Handle dates
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      return ascending 
        ? new Date(valueA as string).getTime() - new Date(valueB as string).getTime()
        : new Date(valueB as string).getTime() - new Date(valueA as string).getTime();
    }
    
    return 0;
  });
};

// Get recently updated jobs
export const getRecentJobs = (limit: number = 5): Job[] => {
  const jobs = getJobs();
  
  return jobs
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};
