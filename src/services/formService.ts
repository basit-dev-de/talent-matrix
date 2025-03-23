
import { CustomForm, FormSection, FormField } from '@/types';
import { getData, storeData, generateId } from './mockData';
import { updateJob } from './jobService';

// Get all custom forms
export const getCustomForms = (): CustomForm[] => {
  return getData<CustomForm[]>('customForms', []);
};

// Get form by ID
export const getFormById = (id: string): CustomForm | undefined => {
  const forms = getCustomForms();
  return forms.find(form => form.id === id);
};

// Get form by job ID
export const getFormByJobId = (jobId: string): CustomForm | undefined => {
  const forms = getCustomForms();
  return forms.find(form => form.jobId === jobId);
};

// Create a new form
export const createForm = (form: Omit<CustomForm, 'id' | 'createdAt' | 'updatedAt'>): CustomForm => {
  const forms = getCustomForms();
  
  // Check if a form already exists for this job
  const existingForm = forms.find(f => f.jobId === form.jobId);
  if (existingForm) {
    // Update the existing form instead of creating a new one
    return updateForm(existingForm.id, form) as CustomForm;
  }
  
  const newForm: CustomForm = {
    ...form,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  storeData('customForms', [...forms, newForm]);
  
  // Update the job to indicate it has a custom form
  updateJob(form.jobId, { hasCustomForm: true });
  
  return newForm;
};

// Update a form
export const updateForm = (id: string, updates: Partial<CustomForm>): CustomForm | undefined => {
  const forms = getCustomForms();
  const index = forms.findIndex(form => form.id === id);
  
  if (index === -1) return undefined;
  
  const updatedForm = {
    ...forms[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  forms[index] = updatedForm;
  storeData('customForms', forms);
  
  return updatedForm;
};

// Delete a form
export const deleteForm = (id: string): boolean => {
  const forms = getCustomForms();
  const formToDelete = forms.find(form => form.id === id);
  if (!formToDelete) return false;
  
  const filteredForms = forms.filter(form => form.id !== id);
  
  if (filteredForms.length === forms.length) return false;
  
  storeData('customForms', filteredForms);
  
  // Update the job to indicate it no longer has a custom form
  updateJob(formToDelete.jobId, { hasCustomForm: false });
  
  return true;
};

// Add a section to a form
export const addFormSection = (formId: string, section: Omit<FormSection, 'id'>): FormSection | undefined => {
  const forms = getCustomForms();
  const formIndex = forms.findIndex(form => form.id === formId);
  
  if (formIndex === -1) return undefined;
  
  const newSection: FormSection = {
    ...section,
    id: generateId(),
  };
  
  const updatedForm = {
    ...forms[formIndex],
    sections: [...forms[formIndex].sections, newSection],
    updatedAt: new Date().toISOString(),
  };
  
  forms[formIndex] = updatedForm;
  storeData('customForms', forms);
  
  return newSection;
};

// Add a field to a section
export const addFormField = (
  formId: string, 
  sectionId: string, 
  field: Omit<FormField, 'id'>
): FormField | undefined => {
  const forms = getCustomForms();
  const formIndex = forms.findIndex(form => form.id === formId);
  
  if (formIndex === -1) return undefined;
  
  const form = forms[formIndex];
  const sectionIndex = form.sections.findIndex(section => section.id === sectionId);
  
  if (sectionIndex === -1) return undefined;
  
  const newField: FormField = {
    ...field,
    id: generateId(),
  };
  
  const updatedSections = [...form.sections];
  updatedSections[sectionIndex] = {
    ...updatedSections[sectionIndex],
    fields: [...updatedSections[sectionIndex].fields, newField],
  };
  
  const updatedForm = {
    ...form,
    sections: updatedSections,
    updatedAt: new Date().toISOString(),
  };
  
  forms[formIndex] = updatedForm;
  storeData('customForms', forms);
  
  return newField;
};
