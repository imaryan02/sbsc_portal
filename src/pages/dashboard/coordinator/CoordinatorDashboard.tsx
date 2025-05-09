
import { useState, useEffect } from "react";
import { BarChart, CheckCircle, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the dashboard charts
const projectsStatusData = [
  { name: 'In Progress', value: 12, fill: '#1E40AF' },
  { name: 'Completed', value: 8, fill: '#10B981' },
  { name: 'Available', value: 5, fill: '#6366F1' },
  { name: 'Review', value: 3, fill: '#F59E0B' },
];

const submissionsData = [
  { name: 'Week 1', mentee: 3, mentor: 2 },
  { name: 'Week 2', mentee: 5, mentor: 4 },
  { name: 'Week 3', mentee: 7, mentor: 6 },
  { name: 'Week 4', mentee: 10, mentor: 8 },
];

const CoordinatorDashboard = () => {
  const { user } = useAuth();
  const [projectsCount, setProjectsCount] = useState(0);
  const [menteesCount, setMenteesCount] = useState(0);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState([
    {
      id: "proj1",
      title: "Interactive Landing Page",
      mentee: "Alex Chen",
      mentor: "Sarah Johnson",
      status: "in-progress",
      progress: 65,
      deadline: "2025-05-30"
    },
    {
      id: "proj2",
      title: "Todo App with React",
      mentee: "Maria Garcia",
      mentor: "Emma Rodriguez",
      status: "review",
      progress: 90,
      deadline: "2025-06-15"
    },
    {
      id: "proj3",
      title: "E-commerce Product Catalog",
      mentee: "Jordan Smith",
      mentor: "Sarah Johnson",
      status: "in-progress",
      progress: 40,
      deadline: "2025-07-10"
    }
  ]);

  useEffect(() => {
    const fetchCoordinatorData = async () => {
      if (!user) return;
      
      // Simulate fetching data from Supabase
      // In a real app, you would fetch actual data
      try {
        // Get count of projects
        const { count: projectsCountData, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        
        if (projectsError) throw projectsError;
        if (projectsCountData !== null) setProjectsCount(projectsCountData);
        
        // For simplicity in the demo, we'll use mock data for the other counts
        setMenteesCount(24);
        setMentorsCount(12);
        setSubmissionsCount(42);
        
      } catch (error) {
        console.error('Error fetching coordinator data:', error);
      }
    };
    
    fetchCoordinatorData();
  }, [user]);

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
        <div className="page-header">
          <h1 className="page-title">Program Overview</h1>
          <p className="page-description">
            Monitor the overall status of the mentorship program
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{projectsCount}</h3>
                <Badge variant="outline">
                  <span className="text-green-600">+3</span> New
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Active Mentees</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{menteesCount}</h3>
                <Badge variant="outline">
                  <span className="text-green-600">+5</span> This Month
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Mentors</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{mentorsCount}</h3>
                <Badge variant="outline">
                  <span className="text-green-600">+2</span> This Month
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{submissionsCount}</h3>
                <Badge variant="outline">
                  <span className="text-green-600">+15</span> This Month
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status Overview</CardTitle>
              <CardDescription>Distribution of projects by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={projectsStatusData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1E40AF" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Submission Activity</CardTitle>
              <CardDescription>Weekly submissions from mentees and mentors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={submissionsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mentee" fill="#1E40AF" name="Mentee Submissions" />
                    <Bar dataKey="mentor" fill="#10B981" name="Mentor Reviews" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest activity across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="inline-block mr-4">Mentee: {project.mentee}</span>
                      <span className="inline-block">Mentor: {project.mentor}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-3 md:mt-0 md:w-1/3">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">View All Projects</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
