
import { User, Project, StudentRequest, Submission, Feedback } from "@/lib/types";

// Mock users data
const users: User[] = [
  {
    id: "user1",
    name: "John Smith",
    email: "john@example.com",
    role: "mentee",
    avatar: "/placeholder.svg"
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "mentor",
    avatar: "/placeholder.svg"
  },
  {
    id: "user3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "coordinator",
    avatar: "/placeholder.svg"
  }
];

// Mock projects data
const projects: Project[] = [
  {
    id: "proj1",
    title: "E-commerce Dashboard",
    description: "Build a responsive dashboard for an e-commerce website with data visualization.",
    techStack: ["React", "TailwindCSS", "Chart.js"],
    deadline: "2025-06-15",
    mentor: users.find(u => u.id === "user2") as User,
    status: "in-progress"
  },
  {
    id: "proj2",
    title: "Task Management App",
    description: "Create a task management application with drag and drop functionality.",
    techStack: ["React", "Redux", "Tailwind"],
    deadline: "2025-07-20",
    mentor: users.find(u => u.id === "user2") as User,
    status: "available"
  },
  {
    id: "proj3",
    title: "Social Media API Integration",
    description: "Integrate various social media APIs into a React application.",
    techStack: ["React", "REST API", "OAuth"],
    deadline: "2025-08-10",
    mentor: users.find(u => u.id === "user2") as User,
    status: "completed"
  }
];

// Mock student requests
const studentRequests: StudentRequest[] = [
  {
    id: "req1",
    student: {
      id: "user1",
      name: "John Smith",
      email: "john@example.com",
      avatar: "/placeholder.svg"
    },
    project: {
      id: "proj1",
      title: "E-commerce Dashboard"
    },
    requestDate: "2025-04-05T09:30:00Z",
    status: "pending"
  },
  {
    id: "req2",
    student: {
      id: "user4",
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "/placeholder.svg"
    },
    project: {
      id: "proj2",
      title: "Task Management App"
    },
    requestDate: "2025-04-08T14:20:00Z",
    status: "pending"
  }
];

// Mock submissions
const submissions: Submission[] = [
  {
    id: "sub1",
    projectId: "proj1",
    menteeId: "user1",
    files: [
      {
        name: "main.js",
        type: "application/javascript",
        size: 25600,
        url: "#"
      },
      {
        name: "styles.css",
        type: "text/css",
        size: 12800,
        url: "#"
      }
    ],
    githubLink: "https://github.com/johnsmith/ecommerce-dashboard",
    submittedAt: "2025-04-10T15:30:00Z",
    status: "pending"
  }
];

// Mock feedback
const feedback: Feedback[] = [
  {
    id: "feed1",
    from: users.find(u => u.id === "user2") as User,
    to: users.find(u => u.id === "user1") as User,
    projectId: "proj1",
    message: "Great work on the dashboard layout! Consider improving the responsiveness for mobile devices.",
    createdAt: "2025-04-12T10:15:00Z"
  }
];

// Mock data service functions
export const mockDataService = {
  // Auth functions
  getCurrentUser: (): User | null => {
    return users[0]; // Default to first user (mentee)
  },
  
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const user = users.find(u => u.email === email);
      if (user) {
        setTimeout(() => resolve(user), 500); // Simulate network delay
      } else {
        setTimeout(() => reject(new Error("Invalid credentials")), 500);
      }
    });
  },
  
  logout: (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(resolve, 300);
    });
  },
  
  // Projects functions
  getProjects: (): Promise<Project[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...projects]), 500);
    });
  },
  
  getProjectById: (id: string): Promise<Project | null> => {
    return new Promise(resolve => {
      const project = projects.find(p => p.id === id) || null;
      setTimeout(() => resolve(project), 300);
    });
  },
  
  // Student requests functions
  getStudentRequests: (): Promise<StudentRequest[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...studentRequests]), 500);
    });
  },
  
  updateRequestStatus: (requestId: string, status: 'approved' | 'rejected'): Promise<void> => {
    return new Promise(resolve => {
      const request = studentRequests.find(r => r.id === requestId);
      if (request) {
        request.status = status;
      }
      setTimeout(resolve, 300);
    });
  },
  
  // Dashboard data functions
  getPendingRequestsCount: (): Promise<number> => {
    return new Promise(resolve => {
      const count = studentRequests.filter(r => r.status === 'pending').length;
      setTimeout(() => resolve(count), 200);
    });
  },
  
  getActiveProjectsCount: (mentorId: string): Promise<number> => {
    return new Promise(resolve => {
      const count = projects.filter(p => p.mentor.id === mentorId && p.status === 'in-progress').length;
      setTimeout(() => resolve(count), 200);
    });
  },
  
  getPendingSubmissionsCount: (): Promise<number> => {
    return new Promise(resolve => {
      const count = submissions.filter(s => s.status === 'pending').length;
      setTimeout(() => resolve(count), 200);
    });
  },
  
  getRecentRequests: (limit = 2): Promise<StudentRequest[]> => {
    return new Promise(resolve => {
      const sorted = [...studentRequests]
        .filter(r => r.status === 'pending')
        .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
        .slice(0, limit);
        
      setTimeout(() => resolve(sorted), 300);
    });
  },

  // Submissions functions
  getSubmissions: (): Promise<Submission[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...submissions]), 500);
    });
  },
  
  // Feedback functions
  getFeedback: (): Promise<Feedback[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...feedback]), 500);
    });
  }
};

// Helper function to switch between mock roles for demo purposes
export const switchUserRole = (role: 'mentee' | 'mentor' | 'coordinator'): User => {
  let user: User;
  switch (role) {
    case 'mentee':
      user = users[0];
      break;
    case 'mentor':
      user = users[1];
      break;
    case 'coordinator':
      user = users[2];
      break;
    default:
      user = users[0];
  }
  return user;
};
