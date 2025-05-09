
import { useState, useEffect } from "react";
import { Calendar, CheckSquare, Clock, MessagesSquare, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { StudentRequest } from "@/lib/types";
import DashboardCard from "@/components/dashboard/mentor/DashboardCard";
import RequestList from "@/components/dashboard/mentor/RequestList";
import UpcomingReviews from "@/components/dashboard/mentor/UpcomingReviews";
import { 
  fetchPendingRequestsCount, 
  fetchActiveProjectsCount, 
  fetchPendingSubmissionsCount, 
  fetchRecentRequests 
} from "@/lib/api/mentor-dashboard";

const MentorDashboard = () => {
  const { user } = useAuth();
  const [requestsCount, setRequestsCount] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [recentRequests, setRecentRequests] = useState<StudentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMentorData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch all dashboard data
        const [requestCount, projectCount, submissionCount, requests] = await Promise.all([
          fetchPendingRequestsCount(),
          fetchActiveProjectsCount(user.id),
          fetchPendingSubmissionsCount(),
          fetchRecentRequests()
        ]);
        
        setRequestsCount(requestCount);
        setActiveProjects(projectCount);
        setPendingSubmissions(submissionCount);
        setRecentRequests(requests);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        toast({
          title: "Failed to load dashboard data",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMentorData();
  }, [user]);

  const handleRequestStatusChange = (requestId: string, newStatus: 'approved' | 'rejected') => {
    // Update local state
    setRecentRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
    );
    
    // Decrement the requests count if a pending request was handled
    if (newStatus === 'approved' || newStatus === 'rejected') {
      setRequestsCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <DashboardLayout role="mentor">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Welcome back, {user?.name || 'Mentor'}!</h1>
          <p className="page-description">
            Here's an overview of your mentoring activities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <DashboardCard
            title="Pending Requests"
            value={requestsCount}
            icon={<Users />}
            badge={requestsCount > 0 ? { text: "New", variant: "outline" } : undefined}
            isLoading={isLoading}
          />
          
          <DashboardCard
            title="Active Projects"
            value={activeProjects}
            icon={<Calendar />}
            badge={{ text: "In Progress", className: "bg-green-100 text-green-800" }}
            isLoading={isLoading}
          />
          
          <DashboardCard
            title="Submissions to Review"
            value={pendingSubmissions}
            icon={<CheckSquare />}
            badge={{ text: "Pending", className: "bg-yellow-100 text-yellow-800" }}
            isLoading={isLoading}
          />
          
          <DashboardCard
            title="Tests Completed"
            value={12} // Hardcoded value from original
            icon={<Clock />}
            badge={{ text: "This month", variant: "outline" }}
            isLoading={false}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>
                Students who have requested to join your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestList 
                requests={recentRequests}
                isLoading={isLoading}
                onStatusChange={handleRequestStatusChange}
              />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/dashboard/mentor/requests">View all requests</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reviews</CardTitle>
              <CardDescription>Project submissions due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingReviews />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View all projects</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
