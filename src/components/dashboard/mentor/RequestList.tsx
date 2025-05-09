
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentRequest } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { updateRequestStatus } from "@/lib/api/mentor-dashboard";

interface RequestListProps {
  requests: StudentRequest[];
  isLoading: boolean;
  onStatusChange: (requestId: string, newStatus: 'approved' | 'rejected') => void;
}

const RequestList = ({ 
  requests, 
  isLoading, 
  onStatusChange 
}: RequestListProps) => {
  const [updatingRequests, setUpdatingRequests] = useState<Set<string>>(new Set());

  const handleApproveRequest = async (requestId: string) => {
    try {
      setUpdatingRequests(prev => new Set(prev).add(requestId));
      await updateRequestStatus(requestId, 'approved');
      onStatusChange(requestId, 'approved');
      toast({
        title: "Request approved",
        description: "The student has been notified",
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Failed to approve request",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUpdatingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      setUpdatingRequests(prev => new Set(prev).add(requestId));
      await updateRequestStatus(requestId, 'rejected');
      onStatusChange(requestId, 'rejected');
      toast({
        title: "Request rejected",
        description: "The student has been notified",
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Failed to reject request",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUpdatingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <p>No pending requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={request.student.avatar} alt={request.student.name} />
              <AvatarFallback>{request.student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{request.student.name}</p>
              <p className="text-sm text-muted-foreground">
                Requesting: {request.project.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(request.requestDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {request.status === 'pending' ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRejectRequest(request.id)}
                  disabled={updatingRequests.has(request.id)}
                >
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleApproveRequest(request.id)}
                  disabled={updatingRequests.has(request.id)}
                >
                  Approve
                </Button>
              </>
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
      ))}
    </div>
  );
};

export default RequestList;
