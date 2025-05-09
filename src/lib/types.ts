
export type UserRole = 'mentee' | 'mentor' | 'coordinator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  deadline: string;
  mentor: User;
  status: 'available' | 'in-progress' | 'completed' | 'review';
}

export interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  avatar?: string;
  rating: number;
}

export interface Feedback {
  id: string;
  from: User;
  to: User;
  projectId: string;
  message: string;
  createdAt: string;
}

export interface SubmissionFile {
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Submission {
  id: string;
  projectId: string;
  menteeId: string;
  files: SubmissionFile[];
  githubLink?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes-requested';
}

export interface StudentRequest {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  project: {
    id: string;
    title: string;
  };
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}
