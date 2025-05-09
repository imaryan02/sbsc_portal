
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const CoordinatorSubmissions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // In a real app, this would fetch submissions from the database
    // Since we don't have a submissions table yet, using mock data
    const mockSubmissions: Submission[] = [
      {
        id: "sub1",
        projectId: "proj1",
        menteeId: "user1",
        files: [
          { name: "main.js", type: "text/javascript", size: 1024, url: "#" }
        ],
        githubLink: "https://github.com/user/project1",
        submittedAt: "2025-04-05T12:00:00Z",
        status: "pending"
      },
      {
        id: "sub2",
        projectId: "proj2",
        menteeId: "user2",
        files: [
          { name: "index.html", type: "text/html", size: 2048, url: "#" },
          { name: "styles.css", type: "text/css", size: 1536, url: "#" }
        ],
        githubLink: "https://github.com/user/project2",
        submittedAt: "2025-04-07T15:30:00Z",
        status: "approved"
      },
      {
        id: "sub3",
        projectId: "proj3",
        menteeId: "user3",
        files: [
          { name: "app.py", type: "text/python", size: 3072, url: "#" }
        ],
        submittedAt: "2025-04-08T09:15:00Z",
        status: "changes-requested"
      }
    ];
    
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredSubmissions = submissions.filter(submission => 
    submission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <DashboardLayout role="coordinator">
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="page-title text-2xl font-bold">Submission Review</h1>
          <p className="page-description text-muted-foreground">
            Review and approve student project submissions
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
                          <Button variant="ghost" size="icon" className="text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
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
    </DashboardLayout>
  );
};

export default CoordinatorSubmissions;
