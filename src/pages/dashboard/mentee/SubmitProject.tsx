
import { useState, useEffect } from "react";
import { Upload, File, Plus, X, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { SubmissionFile, Project } from "@/lib/types";
import { mockDataService } from "@/lib/services/mockDataService";

const SubmitProject = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<SubmissionFile[]>([]);
  const [githubLink, setGithubLink] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsData = await mockDataService.getProjects();
        // Filter for in-progress projects
        const availableProjects = projectsData.filter(p => 
          p.status === 'in-progress' || p.status === 'available'
        );
        setProjects(availableProjects);
        if (availableProjects.length > 0) {
          setSelectedProjectId(availableProjects[0].id);
        }
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      
      setFiles([...files, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].url);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProjectId) {
      toast({
        title: "No project selected",
        description: "Please select a project to submit your work for",
        variant: "destructive"
      });
      return;
    }
    
    if (files.length === 0 && !githubLink) {
      toast({
        title: "Submission incomplete",
        description: "Please upload files or provide a GitHub link",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        toast({
          title: "Project submitted successfully",
          description: "Your project has been submitted for review",
        });
        
        // Reset the form
        setFiles([]);
        setGithubLink("");
        setNotes("");
        setUploadProgress(0);
      }
    }, 100);
  };

  return (
    <DashboardLayout role="mentee">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Submit Project</h1>
          <p className="page-description">Submit your project files and GitHub repository link</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Upload Your Work</CardTitle>
              <CardDescription>
                Upload your project files, provide a GitHub link, or both
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-select">Select Project</Label>
                {isLoading ? (
                  <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                ) : (
                  <Select
                    value={selectedProjectId}
                    onValueChange={setSelectedProjectId}
                  >
                    <SelectTrigger id="project-select">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No projects available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div>
                <Label>Project Files</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center ${
                    isDragging ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop your files here, or{" "}
                    <label className="text-primary cursor-pointer hover:underline">
                      browse
                      <Input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max file size: 50MB
                  </p>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-muted/40">
                          <div className="flex items-center">
                            <File className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github-link">GitHub Repository Link</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github-link"
                    placeholder="https://github.com/yourusername/your-repo"
                    className="pl-9"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your submission..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading files...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Submit Project"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubmitProject;
