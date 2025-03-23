
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RefreshCcw, 
  ChevronDown, 
  Download, 
  Trash,
  Eye,
  SlidersHorizontal,
  Star,
  StarOff
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getApplications, updateApplicationStage, deleteApplication } from '@/services/applicationService';
import { getJobs } from '@/services/mockData';
import { getData } from '@/services/mockData';
import { Application, Job, Stage } from '@/types';
import { initializeMockData } from '@/services/mockData';

const Applications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState<string>(searchParams.get('jobId') || 'all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    initializeMockData();
    
    // Get all applications
    const allApplications = getApplications();
    setApplications(allApplications);
    
    // Get all jobs
    const allJobs = getJobs();
    setJobs(allJobs);
    
    // Get all stages
    const allStages = getData<Stage[]>('stages', []);
    setStages(allStages);
    
    // Check if there's a jobId in the URL
    const jobId = searchParams.get('jobId');
    if (jobId) {
      setJobFilter(jobId);
    }
    
    setLoading(false);
  }, [searchParams]);

  // Filter applications when filters change
  useEffect(() => {
    let filtered = [...applications];
    
    // Filter by job
    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.jobId === jobFilter);
    }
    
    // Filter by stage
    if (stageFilter !== 'all') {
      filtered = filtered.filter(app => app.currentStage.id === stageFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(term) || 
        app.candidateEmail.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    setFilteredApplications(filtered);
    
    // Reset selection when filters change
    setSelectedApplications([]);
    setSelectAll(false);
  }, [applications, jobFilter, stageFilter, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleJobFilterChange = (value: string) => {
    setJobFilter(value);
    if (value !== 'all') {
      setSearchParams({ jobId: value });
    } else {
      setSearchParams({});
    }
  };

  const handleStageFilterChange = (value: string) => {
    setStageFilter(value);
  };

  const handleStageChange = (applicationId: string, stageId: string) => {
    const updatedApp = updateApplicationStage(applicationId, stageId);
    if (updatedApp) {
      // Update the application in the state
      setApplications(prev => 
        prev.map(app => app.id === applicationId ? updatedApp : app)
      );
      toast.success('Application stage updated');
    }
  };

  const handleDelete = (applicationId: string) => {
    if (deleteApplication(applicationId)) {
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
      toast.success('Application deleted');
    }
  };

  const toggleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev => {
      if (prev.includes(applicationId)) {
        return prev.filter(id => id !== applicationId);
      } else {
        return [...prev, applicationId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
    setSelectAll(!selectAll);
  };

  const bulkChangeStage = (stageId: string) => {
    selectedApplications.forEach(appId => {
      updateApplicationStage(appId, stageId);
    });
    
    // Update applications in state
    setApplications(prev => 
      prev.map(app => {
        if (selectedApplications.includes(app.id)) {
          const newStage = stages.find(s => s.id === stageId);
          if (newStage) {
            return {
              ...app,
              currentStage: newStage,
              stageHistory: [
                ...app.stageHistory,
                {
                  stageId: newStage.id,
                  enteredAt: new Date().toISOString(),
                },
              ],
            };
          }
        }
        return app;
      })
    );
    
    toast.success(`${selectedApplications.length} applications updated`);
    setSelectedApplications([]);
    setSelectAll(false);
  };

  const bulkDelete = () => {
    selectedApplications.forEach(appId => {
      deleteApplication(appId);
    });
    
    setApplications(prev => 
      prev.filter(app => !selectedApplications.includes(app.id))
    );
    
    toast.success(`${selectedApplications.length} applications deleted`);
    setSelectedApplications([]);
    setSelectAll(false);
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setApplications(getApplications());
              toast.success('Applications refreshed');
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select
          value={jobFilter}
          onValueChange={handleJobFilterChange}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All jobs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All jobs</SelectItem>
            {jobs.map(job => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={stageFilter}
          onValueChange={handleStageFilterChange}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {stages.map(stage => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedApplications.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Bulk Actions ({selectedApplications.length})
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="text-primary">
                Change Stage
              </DropdownMenuItem>
              {stages.map(stage => (
                <DropdownMenuItem 
                  key={stage.id} 
                  className="pl-8"
                  onClick={() => bulkChangeStage(stage.id)}
                >
                  {stage.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={bulkDelete}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No applications found.</p>
            <p className="text-muted-foreground mt-1">Try changing your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map(application => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => toggleSelectApplication(application.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.candidateName}</p>
                        <p className="text-xs text-muted-foreground">{application.candidateEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/jobs/${application.jobId}`} className="text-primary hover:underline">
                        {getJobTitle(application.jobId)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={application.currentStage.id}
                        onValueChange={(value) => handleStageChange(application.id, value)}
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map(stage => (
                            <SelectItem key={stage.id} value={stage.id}>
                              {stage.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`mr-2 font-medium ${
                          application.score >= 80 ? 'text-green-600' : 
                          application.score >= 60 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {application.score}%
                        </span>
                        {application.score >= 80 && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            High
                          </Badge>
                        )}
                        {application.score >= 60 && application.score < 80 && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                            Medium
                          </Badge>
                        )}
                        {application.score < 60 && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(application.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            // Toggle eligibility
                            const updatedApp = {
                              ...application,
                              isEligible: !application.isEligible
                            };
                            setApplications(prev => 
                              prev.map(app => app.id === application.id ? updatedApp : app)
                            );
                          }}
                        >
                          {application.isEligible ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <SlidersHorizontal className="mr-2 h-4 w-4" />
                              Update Score
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Application</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this application? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleDelete(application.id)}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
