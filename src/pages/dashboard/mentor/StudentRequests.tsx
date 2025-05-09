
import { useState, useEffect } from "react";
import { Search, Filter, Calendar, User, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { StudentRequest } from "@/lib/types";

const StudentRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Get all request data with related project and profile info
        const { data, error } = await supabase
          .from('project_requests')
          .select(`
            id,
            status,
            created_at,
            projects (id, title),
            profiles!project_requests_mentee_id_fkey (id, name, email, avatar)
          `)
          .order('created_at', { ascending: sortOption === 'oldest' });
        
        if (error) throw error;
        
        if (data) {
          const formattedRequests: StudentRequest[] = data.map((req: any) => ({
            id: req.id,
            student: {
              id: req.profiles?.id || '',
              name: req.profiles?.name || 'Unknown Student',
              email: req.profiles?.email || '',
              avatar: req.profiles?.avatar
            },
            project: {
              id: req.projects?.id || '',
              title: req.projects?.title || 'Unknown Project'
            },
            requestDate: req.created_at,
            status: req.status as 'pending' | 'approved' | 'rejected'
          }));
          
          // Apply additional sorting if needed
          if (sortOption === 'az') {
            formattedRequests.sort((a, b) => a.student.name.localeCompare(b.student.name));
          } else if (sortOption === 'za') {
            formattedRequests.sort((a, b) => b.student.name.localeCompare(a.student.name));
          }
          
          setRequests(formattedRequests);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: "Failed to load requests",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, [user, sortOption]);

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('project_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      ));
      
      toast({
        title: "Request approved",
        description: "The student has been notified about the approval",
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Failed to approve request",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('project_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      ));
      
      toast({
        title: "Request rejected",
        description: "The student has been notified about the rejection",
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Failed to reject request",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const filteredRequests = (status: 'pending' | 'approved' | 'rejected' | 'all') => {
    return requests.filter(request => {
      // Apply status filter
      const matchesStatus = status === 'all' || request.status === status;
      
      // Apply search filter
      const matchesSearch = 
        searchQuery === "" || 
        request.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.project.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  };

  return (
    <DashboardLayout role="mentor">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Student Requests</h1>
          <p className="page-description">
            Manage applications from students for your projects
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or project..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select 
              defaultValue="newest" 
              value={sortOption}
              onValueChange={setSortOption}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="az">A-Z (Student)</SelectItem>
                <SelectItem value="za">Z-A (Student)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <TabsContent key={status} value={status} className="mt-0">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  <p className="mt-2 text-muted-foreground">Loading requests...</p>
                </div>
              ) : filteredRequests(status as any).length > 0 ? (
                <div className="space-y-4">
                  {filteredRequests(status as any).map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex flex-col items-center md:items-start space-y-2">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={request.student.avatar} alt={request.student.name} />
                              <AvatarFallback>{request.student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="hidden md:flex md:flex-col space-y-2">
                              {request.status === 'pending' && (
                                <>
                                  <Button 
                                    onClick={() => handleApprove(request.id)}
                                    className="w-full"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleReject(request.id)}
                                    className="w-full"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              
                              {request.status !== 'pending' && (
                                <Badge className={
                                  request.status === 'approved' 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                              <h3 className="text-xl font-semibold">{request.student.name}</h3>
                              <div className="md:hidden">
                                {request.status === 'pending' ? (
                                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                ) : (
                                  <Badge className={
                                    request.status === 'approved' 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-red-100 text-red-800"
                                  }>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{request.student.email}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Project: {request.project.title}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {request.notes && (
                              <p className="text-sm text-muted-foreground border-t pt-3">
                                <span className="font-medium">Note:</span> {request.notes}
                              </p>
                            )}
                            
                            <div className="md:hidden flex space-x-2 mt-4">
                              {request.status === 'pending' && (
                                <>
                                  <Button 
                                    onClick={() => handleApprove(request.id)}
                                    className="flex-1"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => handleReject(request.id)}
                                    className="flex-1"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No {status === 'all' ? '' : status} requests found.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentRequests;
