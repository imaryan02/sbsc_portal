
import { useState, useEffect } from "react";
import { MessageSquare, Search, Filter, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { User, Feedback, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { mockDataService } from "@/lib/services/mockDataService";

const MentorFeedback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [mentees, setMentees] = useState<User[]>([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch feedbacks - in a real app, filter by mentor ID
        const feedbackData = await mockDataService.getFeedback();
        
        // Create mock mentees for the dropdown with proper UserRole type
        const mockMentees: User[] = [
          {
            id: "user1",
            name: "John Smith",
            email: "john@example.com",
            role: "mentee",
            avatar: "/placeholder.svg"
          },
          {
            id: "user4",
            name: "Emily Davis",
            email: "emily@example.com",
            role: "mentee",
            avatar: "/placeholder.svg"
          }
        ];
        
        setFeedbacks(feedbackData);
        setMentees(mockMentees);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Failed to load data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.to.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendFeedback = () => {
    if (!selectedMenteeId || !projectId || !feedbackMessage.trim()) {
      toast({
        title: "Cannot send feedback",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected mentee
    const mentee = mentees.find(m => m.id === selectedMenteeId);
    if (!mentee) return;
    
    // Create new feedback
    const newFeedback: Feedback = {
      id: `feed${feedbacks.length + 1}`,
      from: {
        id: "user2", // Mentor ID
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "mentor"
      },
      to: mentee,
      projectId: projectId,
      message: feedbackMessage,
      createdAt: new Date().toISOString()
    };
    
    // Update feedbacks
    setFeedbacks([newFeedback, ...feedbacks]);
    
    toast({
      title: "Feedback sent",
      description: `Your feedback to ${mentee.name} has been sent`
    });
    
    // Reset form
    setSelectedMenteeId(null);
    setProjectId("");
    setFeedbackMessage("");
  };

  return (
    <DashboardLayout role="mentor">
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="page-title text-2xl font-bold">Feedback Management</h1>
          <p className="page-description text-muted-foreground">
            Provide feedback to mentees and track previous feedback
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
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
              <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                    {searchQuery ? "No feedback found matching your search." : "No feedback available."}
                  </div>
                ) : (
                  filteredFeedbacks.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">To: {feedback.to.name}</CardTitle>
                            <CardDescription className="text-xs">
                              Project: {feedback.projectId}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm line-clamp-3">{feedback.message}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send New Feedback</CardTitle>
                <CardDescription>
                  Provide constructive feedback to your mentees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Mentee</label>
                    <Select 
                      value={selectedMenteeId || ""} 
                      onValueChange={setSelectedMenteeId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mentee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mentees.map(mentee => (
                          <SelectItem key={mentee.id} value={mentee.id}>
                            {mentee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project ID</label>
                    <Input
                      placeholder="Enter project ID"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback Message</label>
                    <Textarea
                      placeholder="Type your feedback message here..."
                      className="min-h-[150px]"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full flex items-center gap-2"
                  onClick={handleSendFeedback}
                >
                  <Send className="h-4 w-4" />
                  <span>Send Feedback</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorFeedback;
