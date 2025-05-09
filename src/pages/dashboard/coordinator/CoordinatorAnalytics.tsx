
import { useState, useEffect } from "react";
import { BarChart3, PieChart, LineChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend, LineChart as ReLineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CoordinatorAnalytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data for charts
  const projectStatusData = [
    { name: 'Available', value: 15 },
    { name: 'In Progress', value: 25 },
    { name: 'Review', value: 10 },
    { name: 'Completed', value: 20 },
  ];
  
  const menteeProgressData = [
    { name: 'Week 1', completed: 5, inProgress: 20 },
    { name: 'Week 2', completed: 10, inProgress: 18 },
    { name: 'Week 3', completed: 15, inProgress: 15 },
    { name: 'Week 4', completed: 20, inProgress: 12 },
    { name: 'Week 5', completed: 25, inProgress: 10 },
    { name: 'Week 6', completed: 30, inProgress: 8 },
  ];
  
  const submissionData = [
    { name: 'Monday', value: 12 },
    { name: 'Tuesday', value: 19 },
    { name: 'Wednesday', value: 15 },
    { name: 'Thursday', value: 8 },
    { name: 'Friday', value: 22 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 4 },
  ];
  
  const techStackData = [
    { name: 'React', value: 30 },
    { name: 'Python', value: 25 },
    { name: 'Node.js', value: 20 },
    { name: 'Angular', value: 15 },
    { name: 'Vue', value: 10 },
  ];
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <DashboardLayout role="coordinator">
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="page-title text-2xl font-bold">Analytics</h1>
          <p className="page-description text-muted-foreground">
            View program metrics and performance data
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PieChart className="h-5 w-5 text-primary" />
                    Project Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of projects by current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Technology Stack Distribution
                  </CardTitle>
                  <CardDescription>
                    Projects by primary technology
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={techStackData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LineChart className="h-5 w-5 text-primary" />
                    Mentee Progress Over Time
                  </CardTitle>
                  <CardDescription>
                    Projects completed vs. in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart
                        data={menteeProgressData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="completed"
                          stroke="#10B981"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="inProgress"
                          stroke="#3B82F6"
                          strokeWidth={2}
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Weekly Submission Activity
                  </CardTitle>
                  <CardDescription>
                    Number of submissions per day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={submissionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorAnalytics;
