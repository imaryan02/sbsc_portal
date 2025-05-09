
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Code, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/lib/types";

const MenteeDashboard = () => {
  // Mock data for the mentee dashboard
  const [currentProject] = useState<Project>({
    id: "1",
    title: "React E-commerce Dashboard",
    description: "Build a responsive dashboard for an e-commerce website with data visualization components.",
    techStack: ["React", "TailwindCSS", "Chart.js"],
    deadline: "2025-06-15",
    mentor: {
      id: "mentor1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "mentor",
      avatar: "/placeholder.svg"
    },
    status: "in-progress"
  });

  const [upcomingDeadlines] = useState([
    {
      id: "task1",
      title: "Complete UI Mockups",
      deadline: "2025-04-20",
      project: "React E-commerce Dashboard"
    },
    {
      id: "task2",
      title: "Backend Integration",
      deadline: "2025-05-10",
      project: "React E-commerce Dashboard"
    }
  ]);

  const [recentFeedback] = useState([
    {
      id: "feedback1",
      from: "Sarah Johnson",
      message: "Great progress on the dashboard navigation, but consider refactoring the sidebar component for better reusability.",
      date: "2 days ago",
      projectTitle: "React E-commerce Dashboard"
    }
  ]);

  const calculateDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining(currentProject.deadline);
  const progress = 45; // Mock progress percentage

  return (
    <DashboardLayout role="mentee">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Welcome back, John!</h1>
          <p className="page-description">
            Here's an overview of your current projects and activities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Current Project</CardTitle>
              <CardDescription>Your active project and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{currentProject.title}</h3>
                    <Badge variant={daysRemaining < 7 ? "destructive" : "outline"}>
                      {daysRemaining} days left
                    </Badge>
                  </div>
                  
                  <p className="mt-2 text-muted-foreground">
                    {currentProject.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {currentProject.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                        <Code className="h-3 w-3" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-start space-y-4 md:border-l md:pl-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">Mentor</p>
                    <div className="flex items-center mt-1 gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentProject.mentor.avatar} alt={currentProject.mentor.name} />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{currentProject.mentor.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due: {new Date(currentProject.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <Button className="w-full">Schedule Meeting</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks due soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">{deadline.title}</h4>
                    <p className="text-sm text-muted-foreground">{deadline.project}</p>
                    <p className="text-sm font-medium mt-1">
                      Due: {new Date(deadline.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View all deadlines</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Latest comments from your mentor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="font-medium">{feedback.from}</span>
                    <span className="text-xs text-muted-foreground">{feedback.date}</span>
                  </div>
                  <p className="text-sm">{feedback.message}</p>
                  <p className="text-xs text-muted-foreground">Re: {feedback.projectTitle}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View all feedback</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenteeDashboard;
