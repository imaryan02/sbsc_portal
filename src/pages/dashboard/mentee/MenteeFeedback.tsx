
import { useState, useEffect } from "react";
import { MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockDataService } from "@/lib/services/mockDataService";
import { Feedback } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const MenteeFeedback = () => {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const feedbackData = await mockDataService.getFeedback();
        // Filter feedback that is directed to user1 (the current mentee in mock data)
        const menteeFeedback = feedbackData.filter(f => f.to.id === "user1");
        setFeedbacks(menteeFeedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast({
          title: "Failed to load feedback",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, [toast]);
  
  return (
    <DashboardLayout role="mentee">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Feedback</h1>
          <p className="page-description">View feedback from your mentors and coordinators</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="bg-muted/40 h-20"></CardHeader>
                <CardContent className="space-y-2 pt-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {feedbacks.map(feedback => (
              <Card key={feedback.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Feedback from {feedback.from.name}</CardTitle>
                      <CardDescription>Project: {feedback.projectId}</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{feedback.from.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/20 p-4 rounded-lg mb-4">
                    <p className="italic">{feedback.message}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>Reply</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No feedback yet</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              You haven't received any feedback yet. Complete your projects to get feedback from mentors.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MenteeFeedback;
