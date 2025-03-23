import { Job, Stage, Application, CustomForm } from '@/types';

// Generate a random ID
export const generateId = () => Math.random().toString(36).substring(2, 10);

// Default application stages
export const defaultStages: Stage[] = [
  { id: 's1', name: 'Applied', type: 'applied', order: 0, color: '#3b82f6' },
  { id: 's2', name: 'Screening', type: 'screening', order: 1, color: '#8b5cf6' },
  { id: 's3', name: 'Interview', type: 'interview', order: 2, color: '#10b981' },
  { id: 's4', name: 'Technical', type: 'technical', order: 3, color: '#f59e0b' },
  { id: 's5', name: 'Offer', type: 'offer', order: 4, color: '#ef4444' },
  { id: 's6', name: 'Hired', type: 'hired', order: 5, color: '#22c55e' },
  { id: 's7', name: 'Rejected', type: 'rejected', order: 6, color: '#6b7280' },
];

// Mock job data
export const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a skilled Frontend Developer to join our team.',
    requirements: [
      'Experience with React',
      'Proficiency in JavaScript/TypeScript',
      'Knowledge of modern CSS techniques',
    ],
    responsibilities: [
      'Developing user interfaces',
      'Implementing responsive design',
      'Optimizing application performance',
    ],
    salary: '$80,000 - $120,000',
    department: 'Engineering',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    status: 'active',
    hasCustomForm: true,
  },
  {
    id: 'j2',
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our design team to create beautiful and functional user experiences.',
    requirements: [
      'Proficiency with design tools like Figma',
      'Portfolio of design work',
      'User research experience',
    ],
    responsibilities: [
      'Creating wireframes and prototypes',
      'Conducting user testing',
      'Collaborating with developers',
    ],
    salary: '$90,000 - $130,000',
    department: 'Design',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    status: 'active',
    hasCustomForm: false,
  },
  {
    id: 'j3',
    title: 'Backend Engineer',
    company: 'ServerStack',
    location: 'Remote',
    type: 'Contract',
    description: 'Build robust and scalable backend systems for our cloud platform.',
    requirements: [
      'Experience with Node.js',
      'Knowledge of database systems',
      'API design experience',
    ],
    responsibilities: [
      'Developing server-side logic',
      'Optimizing application performance',
      'Implementing security measures',
    ],
    salary: '$100,000 - $140,000',
    department: 'Engineering',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    status: 'draft',
    hasCustomForm: false,
  },
];

// Mock application data
export const mockApplications: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    candidateName: 'John Smith',
    candidateEmail: 'john@example.com',
    candidatePhone: '555-123-4567',
    resume: 'https://example.com/john-resume.pdf',
    coverLetter: 'I am excited to apply for this position...',
    currentStage: defaultStages[1],
    stageHistory: [
      {
        stageId: 's1',
        enteredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        stageId: 's2',
        enteredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Good initial screening call',
      },
    ],
    score: 85,
    scoreBreakdown: [
      { criteria: 'Technical Skills', score: 4, maxScore: 5 },
      { criteria: 'Experience', score: 4, maxScore: 5 },
      { criteria: 'Communication', score: 5, maxScore: 5 },
    ],
    answers: {
      yearsExperience: '5',
      programmingLanguages: ['JavaScript', 'TypeScript', 'Python'],
      availability: 'Immediately',
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isEligible: true,
  },
  {
    id: 'a2',
    jobId: 'j1',
    candidateName: 'Emily Johnson',
    candidateEmail: 'emily@example.com',
    candidatePhone: '555-987-6543',
    resume: 'https://example.com/emily-resume.pdf',
    currentStage: defaultStages[2],
    stageHistory: [
      {
        stageId: 's1',
        enteredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        stageId: 's2',
        enteredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        stageId: 's3',
        enteredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Great interview. Strong React knowledge.',
      },
    ],
    score: 92,
    scoreBreakdown: [
      { criteria: 'Technical Skills', score: 5, maxScore: 5 },
      { criteria: 'Experience', score: 4, maxScore: 5 },
      { criteria: 'Communication', score: 5, maxScore: 5 },
    ],
    answers: {
      yearsExperience: '7',
      programmingLanguages: ['JavaScript', 'TypeScript', 'Go'],
      availability: 'Two weeks notice',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isEligible: true,
  },
  {
    id: 'a3',
    jobId: 'j2',
    candidateName: 'Michael Brown',
    candidateEmail: 'michael@example.com',
    resume: 'https://example.com/michael-resume.pdf',
    currentStage: defaultStages[0],
    stageHistory: [
      {
        stageId: 's1',
        enteredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    score: 65,
    scoreBreakdown: [
      { criteria: 'Design Skills', score: 3, maxScore: 5 },
      { criteria: 'Experience', score: 3, maxScore: 5 },
      { criteria: 'Portfolio', score: 4, maxScore: 5 },
    ],
    answers: {
      portfolioUrl: 'https://michaelbrown.design',
      designTools: ['Figma', 'Sketch', 'Adobe XD'],
      yearsExperience: '3',
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isEligible: true,
  },
];

// Mock custom form
export const mockCustomForms: CustomForm[] = [
  {
    id: 'f1',
    jobId: 'j1',
    name: 'Frontend Developer Application',
    description: 'Please fill out this application for our Frontend Developer position.',
    sections: [
      {
        id: 'sec1',
        title: 'Personal Information',
        description: 'Tell us about yourself',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
          },
          {
            id: 'phone',
            type: 'text',
            label: 'Phone Number',
            placeholder: 'Enter your phone number',
            required: false,
          },
        ],
      },
      {
        id: 'sec2',
        title: 'Professional Experience',
        fields: [
          {
            id: 'resume',
            type: 'file',
            label: 'Resume/CV',
            required: true,
          },
          {
            id: 'yearsExperience',
            type: 'number',
            label: 'Years of Experience',
            required: true,
            validation: {
              min: 0,
              max: 50,
            },
            weight: 3,
          },
          {
            id: 'programmingLanguages',
            type: 'checkbox',
            label: 'Programming Languages',
            options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Ruby', 'PHP'],
            required: true,
            weight: 3,
          },
        ],
      },
      {
        id: 'sec3',
        title: 'Additional Information',
        fields: [
          {
            id: 'availability',
            type: 'select',
            label: 'Availability',
            options: ['Immediately', 'Two weeks notice', 'One month notice', 'More than one month'],
            required: true,
          },
          {
            id: 'coverLetter',
            type: 'textarea',
            label: 'Cover Letter',
            placeholder: 'Tell us why you are interested in this position',
            required: false,
          },
        ],
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Local storage service for mock data
export const storeData = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getData = <T>(key: string, defaultData: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultData;
};

// Initialize mock data in local storage if it doesn't exist
export const initializeMockData = () => {
  if (!localStorage.getItem('jobs')) {
    storeData('jobs', mockJobs);
  }
  
  if (!localStorage.getItem('applications')) {
    storeData('applications', mockApplications);
  }
  
  if (!localStorage.getItem('stages')) {
    storeData('stages', defaultStages);
  }
  
  if (!localStorage.getItem('customForms')) {
    storeData('customForms', mockCustomForms);
  }
};

// Job-related functions
export const getJobById = (id: string): Job | null => {
  const jobs = getData<Job[]>('jobs', mockJobs);
  return jobs.find(job => job.id === id) || null;
};

export const getJobs = (): Job[] => {
  return getData<Job[]>('jobs', mockJobs);
};

export const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
  const jobs = getJobs();
  const newJob: Job = {
    ...jobData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  storeData('jobs', [...jobs, newJob]);
  return newJob;
};

export const updateJob = (id: string, updates: Partial<Job>): Job | null => {
  const jobs = getJobs();
  const index = jobs.findIndex(job => job.id === id);
  
  if (index === -1) return null;
  
  const updatedJob = {
    ...jobs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  jobs[index] = updatedJob;
  storeData('jobs', jobs);
  return updatedJob;
};

export const deleteJob = (id: string): boolean => {
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.id !== id);
  
  if (filteredJobs.length === jobs.length) return false;
  
  storeData('jobs', filteredJobs);
  return true;
};

export const searchJobs = (term: string): Job[] => {
  const jobs = getJobs();
  const searchTerm = term.toLowerCase();
  
  return jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm) ||
    job.company.toLowerCase().includes(searchTerm) ||
    job.description.toLowerCase().includes(searchTerm)
  );
};

export const filterJobs = (filters: Partial<Job>): Job[] => {
  const jobs = getJobs();
  
  return jobs.filter(job => {
    return Object.entries(filters).every(([key, value]) => 
      job[key as keyof Job] === value
    );
  });
};

export const sortJobs = (jobs: Job[], key: keyof Job, ascending: boolean = true): Job[] => {
  return [...jobs].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending ? 
        valueA.localeCompare(valueB) : 
        valueB.localeCompare(valueA);
    }
    
    return ascending ? 
      Number(valueA) - Number(valueB) : 
      Number(valueB) - Number(valueA);
  });
};
