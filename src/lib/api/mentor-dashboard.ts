
import { StudentRequest } from "@/lib/types";
import { mockDataService } from "@/lib/services/mockDataService";

export async function fetchPendingRequestsCount(): Promise<number> {
  return mockDataService.getPendingRequestsCount();
}

export async function fetchActiveProjectsCount(mentorId: string): Promise<number> {
  // Modified to avoid deep type instantiation issues
  try {
    // Get projects where the mentor is assigned and status is in-progress
    const projects = await mockDataService.getProjects();
    const activeProjects = projects.filter(p => 
      p.mentor.id === mentorId && p.status === 'in-progress'
    );
    return activeProjects.length;
  } catch (error) {
    console.error('Error fetching active projects count:', error);
    return 0;
  }
}

export async function fetchPendingSubmissionsCount(): Promise<number> {
  return mockDataService.getPendingSubmissionsCount();
}

export async function fetchRecentRequests(limit = 2): Promise<StudentRequest[]> {
  return mockDataService.getRecentRequests(limit);
}

export async function updateRequestStatus(
  requestId: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  return mockDataService.updateRequestStatus(requestId, status);
}
