
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Feedback, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const CoordinatorFeedback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [newFeedbackMessage, setNewFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Simulating API fetch with mock data
    const mockUser: User = {
      id: "coord1",
      name: "John Coordinator",
      email: "john@example.com",
      role: "coordinator"
    };
    
    const mockFeedbacks: Feedback[] = [
      {
        id: "fb1",
        from: mockUser,
        to: {
          id: "user1",
          name: "Alex Chen",
          email: "alex@example.com",
          role: "mentee"
        },
        projectId: "proj1",
        message: "Great work on implementing the UI components. Consider adding more documentation for the API integration.",
        createdAt: "2025-04-01T10:30:00Z"
      },
      {
        id: "fb2",
        from: mockUser,
        to: {
          id: "user2",
          name: "Maria Garcia",
          email: "maria@example.com",
          role: "mentee"
        },
        projectId: "proj2",
        message: "The API integration is well done. Your code is clean and well-structured. I'd recommend adding more comprehensive error handling.",
        createdAt: "2025-04-03T14:15:00Z"
      },
      {
        id: "fb3",
        from: mockUser,
        to: {
          id: "user3",
          name: "Jordan Smith",
          email: "jordan@example.com",
          role: "mentee"
        },
        projectId: "proj3",
        message: "Your project submission meets the technical requirements, but there are some UI improvements needed. Let's schedule a call to discuss.",
        createdAt: "2025-04-05T09:45:00Z"
      }
    ];
    
    setTimeout(() => {
      setFeedbacks(mockFeedbacks);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.to.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendFeedback = () => {
    if (!selectedFeedback || !newFeedbackMessage.trim()) {
      toast({
        title: "Cannot send feedback",
        description: "Please select a recipient and provide a message",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the feedback to the database
    toast({
      title: "Feedback sent",
      description: `Your feedback to ${selectedFeedback.to.name} has been sent`
    });
    
    setNewFeedbackMessage("");
  };

  return (
    <DashboardLayout role="coordinator">
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="page-title text-2xl font-bold">Feedback Panel</h1>
          <p className="page-description text-muted-foreground">
            Provide feedback to mentees and mentors
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
                    <Card 
                      key={feedback.id}
                      className={`cursor-pointer transition-colors ${selectedFeedback?.id === feedback.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{feedback.to.name}</CardTitle>
                            <CardDescription className="text-xs">
                              Project: {feedback.projectId}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {feedback.to.role === "mentee" ? "Mentee" : "Mentor"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm line-clamp-2">{feedback.message}</p>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Provide Feedback</CardTitle>
                <CardDescription>
                  {selectedFeedback 
                    ? `Sending feedback to ${selectedFeedback.to.name}`
                    : "Select a recipient from the list"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your feedback message here..."
                  className="min-h-[200px]"
                  value={newFeedbackMessage}
                  onChange={(e) => setNewFeedbackMessage(e.target.value)}
                  disabled={!selectedFeedback}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                  Cancel
                </Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleSendFeedback}
                  disabled={!selectedFeedback || !newFeedbackMessage.trim()}
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

export default CoordinatorFeedback;
