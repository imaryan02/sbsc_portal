
import { useState, useEffect } from "react";
import { Check, X, FileText, ExternalLink, Download, Search, Filter } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockDataService } from "@/lib/services/mockDataService";
import { Submission } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const ReviewSubmissions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        // In a real app, filter submissions by mentor ID
        const submissionsData = await mockDataService.getSubmissions();
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Failed to load submissions",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [toast]);

  const handleProvideFeedback = (submission: Submission) => {
    setSelectedSubmission(submission);
    setFeedback("");
    setIsDialogOpen(true);
  };

  const handleSubmitFeedback = () => {
    if (!selectedSubmission || !feedback.trim()) {
      toast({
        title: "Cannot submit feedback",
        description: "Please provide feedback",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the feedback to the database
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been sent to the mentee"
    });
    
    // Update submission status
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id 
        ? { ...sub, status: 'changes-requested' as const } 
        : sub
    );
    setSubmissions(updatedSubmissions);
    
    setIsDialogOpen(false);
    setFeedback("");
    setSelectedSubmission(null);
  };

  const handleApproveSubmission = (submissionId: string) => {
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'approved' as const } 
        : sub
    );
    setSubmissions(updatedSubmissions);
    
    toast({
      title: "Submission approved",
      description: "The project submission has been approved"
    });
  };

  const handleRejectSubmission = (submissionId: string) => {
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'rejected' as const } 
        : sub
    );
    setSubmissions(updatedSubmissions);
    
    toast({
      title: "Submission rejected",
      description: "The project submission has been rejected"
    });
  };

  const filteredSubmissions = submissions.filter(submission => 
    submission.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.menteeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'changes-requested':
        return <Badge className="bg-blue-100 text-blue-800">Changes Requested</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="mentor">
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="page-title text-2xl font-bold">Review Submissions</h1>
          <p className="page-description text-muted-foreground">
            Review and provide feedback on mentee project submissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
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
                  <TableHead>Project ID</TableHead>
                  <TableHead>Mentee ID</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="hidden md:table-cell">Files</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No submissions found matching your search." : "No submissions available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.projectId}</TableCell>
                      <TableCell>{submission.menteeId}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {submission.files.map((file, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="text-xs">{file.name}</span>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {submission.githubLink && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={submission.githubLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600"
                            onClick={() => handleProvideFeedback(submission)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600"
                            onClick={() => handleApproveSubmission(submission.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600"
                            onClick={() => handleRejectSubmission(submission.id)}
                          >
                            <X className="h-4 w-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>Provide feedback for project: {selectedSubmission.projectId}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your feedback here..."
              className="min-h-[200px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ReviewSubmissions;
