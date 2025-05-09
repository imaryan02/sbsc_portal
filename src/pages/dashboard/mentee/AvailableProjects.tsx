
import { useState } from "react";
import { Search, Filter, Code, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface AvailableProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  deadline: string;
  mentor: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const AvailableProjects = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const [availableProjects] = useState<AvailableProject[]>([
    {
      id: "proj1",
      title: "Interactive Landing Page",
      description: "Create a responsive landing page with animations and interactive elements",
      techStack: ["HTML", "CSS", "JavaScript"],
      deadline: "2025-05-30",
      mentor: "Alex Mitchell",
      difficulty: "beginner"
    },
    {
      id: "proj2",
      title: "Todo App with React",
      description: "Build a simple todo application using React with state management",
      techStack: ["React", "CSS"],
      deadline: "2025-06-15",
      mentor: "Emma Rodriguez",
      difficulty: "beginner"
    },
    {
      id: "proj3",
      title: "E-commerce Product Catalog",
      description: "Develop a product catalog with filtering, sorting and search functionality",
      techStack: ["React", "TailwindCSS", "Firebase"],
      deadline: "2025-07-10",
      mentor: "Sarah Johnson",
      difficulty: "intermediate"
    },
    {
      id: "proj4",
      title: "Blog Platform API",
      description: "Create a RESTful API for a blog platform with authentication",
      techStack: ["Node.js", "Express", "MongoDB"],
      deadline: "2025-06-30",
      mentor: "Michael Chang",
      difficulty: "intermediate"
    },
    {
      id: "proj5",
      title: "Movie Recommendation App",
      description: "Build a movie recommendation app with AI-powered suggestions",
      techStack: ["Python", "React", "TensorFlow"],
      deadline: "2025-08-15",
      mentor: "Jessica Lee",
      difficulty: "advanced"
    }
  ]);
  
  const allTechStacks = Array.from(
    new Set(availableProjects.flatMap(project => project.techStack))
  ).sort();
  
  const handleRequestProject = (projectId: string) => {
    toast({
      title: "Request sent",
      description: "Your project request has been sent to the mentor",
    });
  };
  
  const filteredProjects = availableProjects.filter(project => {
    // Apply search filter
    const matchesSearch = 
      searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply tech stack filter
    const matchesTechStack = 
      !activeFilter || 
      project.techStack.includes(activeFilter);
    
    return matchesSearch && matchesTechStack;
  });
  
  const getProjectsByDifficulty = (difficulty: "beginner" | "intermediate" | "advanced") => {
    return filteredProjects.filter(project => project.difficulty === difficulty);
  };

  return (
    <DashboardLayout role="mentee">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Available Projects</h1>
          <p className="page-description">Browse and request available projects to work on</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={!activeFilter ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveFilter(null)}
            >
              All
            </Badge>
            {allTechStacks.map((tech) => (
              <Badge 
                key={tech} 
                variant={activeFilter === tech ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveFilter(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onRequest={() => handleRequestProject(project.id)} 
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No projects match your search criteria.
                </div>
              )}
            </div>
          </TabsContent>
          
          {["beginner", "intermediate", "advanced"].map((difficulty) => (
            <TabsContent key={difficulty} value={difficulty} className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getProjectsByDifficulty(difficulty as "beginner" | "intermediate" | "advanced").length > 0 ? (
                  getProjectsByDifficulty(difficulty as "beginner" | "intermediate" | "advanced").map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onRequest={() => handleRequestProject(project.id)} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No {difficulty} level projects available matching your filters.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface ProjectCardProps {
  project: AvailableProject;
  onRequest: () => void;
}

const ProjectCard = ({ project, onRequest }: ProjectCardProps) => {
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800",
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge className={difficultyColor[project.difficulty]}>
            {project.difficulty}
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Code className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>Mentor: {project.mentor}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRequest} className="w-full">Request to Join</Button>
      </CardFooter>
    </Card>
  );
};

export default AvailableProjects;
