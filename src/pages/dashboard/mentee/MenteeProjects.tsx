
import { useState, useEffect } from "react";
import { Clock, Book, Video, Users, MessageSquare, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockDataService } from "@/lib/services/mockDataService";
import { Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const MenteeProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsData = await mockDataService.getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Failed to load projects",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast]);
  
  const activeProjects = projects.filter(p => p.status === 'in-progress');
  const availableProjects = projects.filter(p => p.status === 'available');
  const completedProjects = projects.filter(p => p.status === 'completed');
  
  return (
    <DashboardLayout role="mentee">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Projects</h1>
          <p className="page-description">View and manage your active and completed projects</p>
        </div>
        
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active Projects ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available Projects ({availableProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProjects.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="bg-muted/40 h-20"></CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activeProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <Book className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No active projects</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  You don't have any active projects. Browse available projects to get started.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/dashboard/mentee/available-projects">Browse Projects</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="bg-muted/40 h-20"></CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : availableProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <Book className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No available projects</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  There are no available projects at the moment. Check back later or contact a coordinator.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="bg-muted/40 h-20"></CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : completedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No completed projects</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  You haven't completed any projects yet. Complete your active projects to see them here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Calculate a mock progress percentage based on project status
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'available':
        return 0;
      case 'in-progress':
        return 65;
      case 'review':
        return 90;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'available':
        return <Badge className="bg-purple-100 text-purple-800">Available</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const progressPercentage = getProgressPercentage(project.status);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle>{project.title}</CardTitle>
          {getStatusBadge(project.status)}
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </CardHeader>
      <CardContent className="py-2 space-y-4">
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Mentor: {project.mentor.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {project.status === 'in-progress' && (
          <Button asChild className="w-full">
            <Link to="/dashboard/mentee/submit">Submit Work</Link>
          </Button>
        )}
        {project.status === 'available' && (
          <Button variant="outline" className="w-full">Request to Join</Button>
        )}
        {project.status === 'completed' && (
          <Button variant="outline" className="w-full">View Feedback</Button>
        )}
        {project.status === 'review' && (
          <Button variant="outline" disabled className="w-full">Awaiting Review</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenteeProjects;
