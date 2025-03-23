import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  Share, 
  PaperclipIcon, 
  Users, 
  FormInput 
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { getJobById, updateJob, deleteJob } from '@/services/mockData';
import { getApplicationsByJobId } from '@/services/applicationService';
import { getFormByJobId } from '@/services/formService';
import { Job, Application, CustomForm } from '@/types';
import { initializeMockData } from '@/services/mockData';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    if (!id) return;
    
    // Load job data
    const jobData = getJobById(id);
    if (jobData) {
      setJob(jobData);
      
      // Load applications for this job
      const jobApplications = getApplicationsByJobId(id);
      setApplications(jobApplications);
      
      // Check for custom form
      const jobForm = getFormByJobId(id);
      setForm(jobForm || null);
      
      // Generate share URL
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/apply/${id}`);
    }
    
    setLoading(false);
  }, [id]);

  const handleStatusChange = (status: 'active' | 'closed' | 'draft') => {
    if (!job || !id) return;
    
    const updatedJob = updateJob(id, { status });
    if (updatedJob) {
      setJob(updatedJob);
      toast.success(`Job status updated to ${status}`);
    }
  };

  const handleDeleteJob = () => {
    if (!id) return;
    
    if (deleteJob(id)) {
      toast.success('Job deleted successfully');
      navigate('/jobs');
    } else {
      toast.error('Failed to delete job');
    }
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Application link copied to clipboard');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Job not found</h2>
        <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Button variant="outline" asChild>
            <Link to={`/jobs/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Job</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this job? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteJob}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {applications.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {applications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="form">Application Form</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p>{job.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p>{job.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>{job.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Type</p>
                  <p>{job.type}</p>
                </div>
                {job.salary && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Salary Range</p>
                    <p>{job.salary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Status:</p>
                  <Badge className={`${getStatusBadgeColor(job.status)} px-3 py-1`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Change Status:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={job.status === 'draft' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleStatusChange('draft')}
                    >
                      Draft
                    </Button>
                    <Button 
                      variant={job.status === 'active' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleStatusChange('active')}
                    >
                      Active
                    </Button>
                    <Button 
                      variant={job.status === 'closed' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleStatusChange('closed')}
                    >
                      Closed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Overview</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Applications</CardTitle>
                <CardDescription>
                  {applications.length} {applications.length === 1 ? 'candidate has' : 'candidates have'} applied for this position
                </CardDescription>
              </div>
              <Button asChild>
                <Link to={`/applications?jobId=${job.id}`}>
                  <Users className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No applications received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{application.candidateName}</p>
                        <p className="text-sm text-muted-foreground">{application.candidateEmail}</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {application.currentStage.name}
                      </Badge>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="link" asChild>
                        <Link to={`/applications?jobId=${job.id}`}>
                          View all {applications.length} applications
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Application Form</CardTitle>
                  <CardDescription>
                    Customize how candidates apply to this position
                  </CardDescription>
                </div>
                {form ? (
                  <Button asChild>
                    <Link to={`/form-builder/${job.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Form
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to={`/form-builder/${job.id}`}>
                      <FormInput className="mr-2 h-4 w-4" />
                      Create Form
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {form ? (
                <div className="space-y-4">
                  <p>
                    Your application form <span className="font-medium">{form.name}</span> is ready to use.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-medium mb-2">Share application form link:</p>
                    <div className="flex gap-2 items-center">
                      <Input value={shareUrl} readOnly className="flex-1" />
                      <Button variant="secondary" size="sm" onClick={copyShareUrl}>
                        <Share className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-medium mb-2">Embed code:</p>
                    <div className="flex gap-2 items-center">
                      <Input 
                        value={`<iframe src="${shareUrl}" width="100%" height="600px" frameborder="0"></iframe>`} 
                        readOnly 
                        className="flex-1" 
                      />
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          navigator.clipboard.writeText(`<iframe src="${shareUrl}" width="100%" height="600px" frameborder="0"></iframe>`);
                          toast.success('Embed code copied to clipboard');
                        }}
                      >
                        <PaperclipIcon className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't created a custom application form for this job yet.
                  </p>
                  <Button asChild>
                    <Link to={`/form-builder/${job.id}`}>
                      <FormInput className="mr-2 h-4 w-4" />
                      Create Application Form
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobDetails;
