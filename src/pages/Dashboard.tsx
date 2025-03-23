import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  getJobs,
  getActiveJobsCount,
  getJobsByStatus,
} from "@/services/jobService";
import {
  getApplications,
  getApplicationsCountByStage,
  getRecentApplications,
} from "@/services/applicationService";
import { getData } from "@/services/mockData";
import { Application, Job, Stage } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [applicationStats, setApplicationStats] = useState<{
    screening: number;
    interview: number;
    rejected: number;
  }>({ screening: 0, interview: 0, rejected: 0 });
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const activeJobsCount = getActiveJobsCount();
        const applications = getApplications();
        const appCountByStage = getApplicationsCountByStage();
        const recent = getRecentApplications(5);
        const stageData = getData<Stage[]>("stages", []);

        setActiveJobs(activeJobsCount);
        setTotalApplications(applications.length);
        setApplicationStats({
          screening: appCountByStage["s2"] || 0,
          interview: appCountByStage["s3"] || 0,
          rejected: appCountByStage["s7"] || 0,
        });
        setRecentApplications(recent);
        setStages(stageData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getStageBadge = (stage: Stage) => {
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "default";

    if (stage.type === "rejected") {
      variant = "destructive";
    } else if (stage.type === "applied" || stage.type === "screening") {
      variant = "secondary";
    } else if (stage.type === "hired") {
      variant = "default";
    }

    return (
      <Badge variant={variant} className="ml-auto">
        {stage.name}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your hiring activities
          </p>
        </div>
        <Button onClick={() => navigate("/jobs/create")}>Post a new job</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-smooth card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              {activeJobs > 0 ? "+1" : "0"} from last month
            </p>
          </CardContent>
        </Card>
        <Card className="transition-smooth card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {totalApplications > 0 ? "+3" : "0"} from last week
            </p>
          </CardContent>
        </Card>
        <Card className="transition-smooth card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalApplications > 0
                ? Math.round(
                    (applicationStats.interview / totalApplications) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Applied to Interview
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 transition-smooth card-hover">
          <CardHeader>
            <CardTitle>Application Pipeline</CardTitle>
            <CardDescription>
              Distribution of applications across stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">Screening</span>
                </div>
                <div className="flex-1">
                  <Progress
                    value={
                      (applicationStats.screening / totalApplications) * 100
                    }
                    className="h-2"
                  />
                </div>
                <div className="font-medium text-sm">
                  {applicationStats.screening}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Interview</span>
                </div>
                <div className="flex-1">
                  <Progress
                    value={
                      (applicationStats.interview / totalApplications) * 100
                    }
                    className="h-2"
                  />
                </div>
                <div className="font-medium text-sm">
                  {applicationStats.interview}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Rejected</span>
                </div>
                <div className="flex-1">
                  <Progress
                    value={
                      (applicationStats.rejected / totalApplications) * 100
                    }
                    className="h-2"
                  />
                </div>
                <div className="font-medium text-sm">
                  {applicationStats.rejected}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 transition-smooth card-hover">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest candidates who have applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="-mt-2">
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{app.candidateName}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStageBadge(app.currentStage)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground">No applications yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-smooth card-hover">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
            <CardDescription>Currently active job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {activeJobs > 0 ? (
              <div className="space-y-4">
                {getJobsByStatus("active").map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.department} · {job.location}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground">No active jobs</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/jobs/create")}
                >
                  Post a job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="transition-smooth card-hover">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => navigate("/jobs/create")}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Create a new job posting
              </Button>
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => navigate("/applications")}
              >
                <Users className="mr-2 h-4 w-4" />
                Review pending applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
