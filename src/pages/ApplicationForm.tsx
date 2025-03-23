import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { getJobById } from '@/services/mockData';
import { getFormByJobId } from '@/services/formService';
import { createApplication } from '@/services/applicationService';
import { Job, CustomForm, FormField } from '@/types';
import { initializeMockData } from '@/services/mockData';

const ApplicationForm = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [form, setForm] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    if (!jobId) return;
    
    // Load job data
    const jobData = getJobById(jobId);
    if (jobData) {
      setJob(jobData);
      
      // Check if there's a custom form for this job
      const jobForm = getFormByJobId(jobId);
      if (jobForm) {
        setForm(jobForm);
        
        // Initialize form values
        const initialValues: Record<string, any> = {};
        jobForm.sections.forEach(section => {
          section.fields.forEach(field => {
            initialValues[field.id] = field.type === 'checkbox' ? [] : '';
          });
        });
        setFormValues(initialValues);
      }
    }
    
    setLoading(false);
  }, [jobId]);

  const handleFieldChange = (fieldId: string, value: any, type: string) => {
    if (type === 'checkbox') {
      // Handle checkbox values as arrays
      setFormValues(prev => {
        const currentValues = [...(prev[fieldId] || [])];
        const valueIndex = currentValues.indexOf(value);
        
        if (valueIndex === -1) {
          currentValues.push(value);
        } else {
          currentValues.splice(valueIndex, 1);
        }
        
        return { ...prev, [fieldId]: currentValues };
      });
    } else {
      setFormValues(prev => ({ ...prev, [fieldId]: value }));
    }
    
    // Clear error when field is updated
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldId];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!form) return false;
    
    form.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          const value = formValues[field.id];
          
          if (value === undefined || value === null || value === '') {
            errors[field.id] = 'This field is required';
          } else if (Array.isArray(value) && value.length === 0) {
            errors[field.id] = 'Please select at least one option';
          }
        }
        
        // Validate number fields
        if (field.type === 'number' && field.validation) {
          const numValue = Number(formValues[field.id]);
          
          if (!isNaN(numValue)) {
            if (field.validation.min !== undefined && numValue < field.validation.min) {
              errors[field.id] = `Value must be at least ${field.validation.min}`;
            }
            
            if (field.validation.max !== undefined && numValue > field.validation.max) {
              errors[field.id] = `Value must be at most ${field.validation.max}`;
            }
          }
        }
      });
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!job || !form || !jobId) return;
    
    setSubmitting(true);
    
    // Extract candidate info from form values
    let candidateName = '';
    let candidateEmail = '';
    let resume = '';
    let coverLetter = '';
    
    // Find fields by common labels to extract candidate information
    form.sections.forEach(section => {
      section.fields.forEach(field => {
        const labelLower = field.label.toLowerCase();
        
        if (labelLower.includes('name')) {
          candidateName = formValues[field.id] || '';
        } else if (labelLower.includes('email')) {
          candidateEmail = formValues[field.id] || '';
        } else if (labelLower.includes('resume') || labelLower.includes('cv')) {
          resume = 'https://example.com/resume.pdf'; // Mock file URL
        } else if (labelLower.includes('cover letter')) {
          coverLetter = formValues[field.id] || '';
        }
      });
    });
    
    // If name or email wasn't found, try to infer from field types
    if (!candidateName || !candidateEmail) {
      form.sections.forEach(section => {
        section.fields.forEach(field => {
          if (!candidateName && field.type === 'text' && formValues[field.id]) {
            candidateName = formValues[field.id];
          } else if (!candidateEmail && field.type === 'text' && formValues[field.id]?.includes('@')) {
            candidateEmail = formValues[field.id];
          }
        });
      });
    }
    
    try {
      // Calculate a mock score based on field weights
      let totalScore = 0;
      let maxPossibleScore = 0;
      
      form.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.weight && field.weight > 0) {
            maxPossibleScore += field.weight * 5; // Assuming max score per field is 5
            
            // Calculate score based on field type and value
            let fieldScore = 0;
            const value = formValues[field.id];
            
            if (field.type === 'checkbox' && Array.isArray(value)) {
              // More options selected = higher score (simplified)
              fieldScore = Math.min(5, value.length);
            } else if (field.type === 'number') {
              // Higher number = higher score (simplified)
              fieldScore = Math.min(5, Math.max(1, Math.ceil(Number(value) / 10)));
            } else if (value) {
              // String length as a simple heuristic (in a real app, this would use NLP)
              const strValue = String(value);
              fieldScore = Math.min(5, Math.max(1, Math.ceil(strValue.length / 20)));
            }
            
            totalScore += fieldScore * field.weight;
          }
        });
      });
      
      // Calculate percentage score
      const percentageScore = maxPossibleScore > 0 
        ? Math.round((totalScore / maxPossibleScore) * 100)
        : 85; // Default score if no weights
      
      // Create application
      createApplication({
        jobId,
        candidateName: candidateName || 'Anonymous Candidate',
        candidateEmail: candidateEmail || 'anonymous@example.com',
        resume: resume || 'https://example.com/default-resume.pdf',
        coverLetter,
        score: percentageScore,
        scoreBreakdown: [
          { criteria: 'Overall', score: percentageScore, maxScore: 100 }
        ],
        answers: formValues,
        isEligible: percentageScore >= 60,
      });
      
      // Show success state
      setSubmitted(true);
      toast.success('Application submitted successfully');
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const { id, type, label, placeholder, required, options } = field;
    
    switch (type) {
      case 'text':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              placeholder={placeholder}
              value={formValues[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value, type)}
              className={formErrors[id] ? 'border-red-500' : ''}
            />
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      case 'textarea':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={id}
              placeholder={placeholder}
              value={formValues[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value, type)}
              className={formErrors[id] ? 'border-red-500' : ''}
            />
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formValues[id] || ''}
              onValueChange={(value) => handleFieldChange(id, value, type)}
            >
              <SelectTrigger className={formErrors[id] ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option, index) => (
                  <SelectItem key={`${id}-option-${index}`} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={id} className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor={id}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <div className="space-y-2">
              {options?.map((option, index) => (
                <div key={`${id}-option-${index}`} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${id}-${index}`}
                    checked={formValues[id]?.includes(option) || false}
                    onChange={() => handleFieldChange(id, option, type)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`${id}-${index}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      case 'radio':
        return (
          <div key={id} className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor={id}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <div className="space-y-2">
              {options?.map((option, index) => (
                <div key={`${id}-option-${index}`} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${id}-${index}`}
                    name={id}
                    value={option}
                    checked={formValues[id] === option}
                    onChange={() => handleFieldChange(id, option, type)}
                    className="h-4 w-4 rounded-full border-gray-300"
                  />
                  <Label htmlFor={`${id}-${index}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      case 'date':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="date"
              value={formValues[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value, type)}
              className={formErrors[id] ? 'border-red-500' : ''}
            />
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      case 'file':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div 
              className={`border-2 border-dashed rounded-md p-6 text-center ${
                formErrors[id] ? 'border-red-500' : 'border-muted-foreground/20'
              }`}
            >
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX
              </p>
              <Input
                id={id}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // In a real app, we would upload the file to a server
                    // For this demo, we'll just store the file name
                    handleFieldChange(id, e.target.files[0].name, type);
                  }
                }}
              />
              {formValues[id] && (
                <p className="mt-2 text-sm font-medium">
                  Selected: {formValues[id]}
                </p>
              )}
            </div>
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      case 'number':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="number"
              placeholder={placeholder}
              value={formValues[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value, type)}
              min={field.validation?.min}
              max={field.validation?.max}
              className={formErrors[id] ? 'border-red-500' : ''}
            />
            {formErrors[id] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[id]}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-muted/30">
        <div className="max-w-md w-full bg-background rounded-lg border p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Job not found</h2>
          <p className="text-muted-foreground mb-6">
            The job you're trying to apply for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-muted/30">
        <div className="max-w-lg w-full bg-background rounded-lg border p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to {job.title} at {job.company}. We've received your application and will review it shortly.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormValues({});
              }}
            >
              Apply to Another Position
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-muted/30">
        <div className="max-w-md w-full bg-background rounded-lg border p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Application Unavailable</h2>
          <p className="text-muted-foreground mb-6">
            The application form for this job is currently not available. Please check back later.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              {job.company}
            </Badge>
            <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              {job.location}
            </Badge>
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              {job.type}
            </Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{form.name}</CardTitle>
            {form.description && (
              <CardDescription>{form.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {form.sections.map((section) => (
                <div key={section.id} className="mb-8">
                  <h2 className="text-lg font-medium mb-1">{section.title}</h2>
                  {section.description && (
                    <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                  )}
                  <div className="space-y-4">
                    {section.fields.map((field) => renderField(field))}
                  </div>
                </div>
              ))}
              <div className="mt-8 flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationForm;
