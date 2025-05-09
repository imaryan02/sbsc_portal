
import { useState, useEffect } from "react";
import { Clock, Filter, Trash2, Edit, PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockDataService } from "@/lib/services/mockDataService";
import { Project, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const CoordinatorProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "",
    deadline: "",
    status: "available" as "available" | "in-progress" | "completed" | "review"
  });
  
  useEffect(() => {
    fetchProjects();
  }, []);

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
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async () => {
    try {
      if (!newProject.title || !newProject.description || !newProject.techStack || !newProject.deadline) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // For this mock implementation, we'll just add to the projects state
      const techStackArray = newProject.techStack.split(',').map(tech => tech.trim());
      
      const newProjectObj: Project = {
        id: `proj${projects.length + 1}`,
        title: newProject.title,
        description: newProject.description,
        techStack: techStackArray,
        deadline: newProject.deadline,
        mentor: projects[0]?.mentor || {
          id: "user2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "mentor"
        },
        status: newProject.status
      };
      
      setProjects([...projects, newProjectObj]);
      
      toast({
        title: "Project added",
        description: "The project was added successfully",
      });
      
      // Reset form and close dialog
      setNewProject({
        title: "",
        description: "",
        techStack: "",
        deadline: "",
        status: "available"
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Failed to add project",
        description: "An error occurred while adding the project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    try {
      setProjects(projects.filter(project => project.id !== projectId));
      toast({
        title: "Project deleted",
        description: "The project was deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Failed to delete project",
        description: "An error occurred while deleting the project",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
    project.mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>;
      case 'available':
        return <Badge className="bg-purple-100 text-purple-800">Available</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="coordinator">
      <div className="page-container">
        <div className="page-header flex justify-between items-center mb-6">
          <div>
            <h1 className="page-title text-2xl font-bold">Projects</h1>
            <p className="page-description text-muted-foreground">
              Manage all projects in the mentorship program
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Create a new project for the mentorship program
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    placeholder="Enter project title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Enter project description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Input
                    id="techStack"
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({...newProject, techStack: e.target.value})}
                    placeholder="React, Node.js, MongoDB (comma separated)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newProject.status}
                    onChange={(e) => setNewProject({
                      ...newProject, 
                      status: e.target.value as "available" | "in-progress" | "completed" | "review"
                    })}
                  >
                    <option value="available">Available</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="review">Review</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProject}>Add Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Project Name</TableHead>
                  <TableHead className="hidden md:table-cell">Tech Stack</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No projects found matching your search." : "No projects available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div>
                          {project.title}
                          <p className="text-sm text-muted-foreground hidden sm:block mt-1 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech, index) => (
                            <Badge key={index} variant="outline" className="bg-muted text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{project.mentor.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(project.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorProjects;
