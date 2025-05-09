
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";

import AuthPage from "./pages/AuthPage";

// Mentee Dashboard Pages
import MenteeDashboard from "./pages/dashboard/mentee/MenteeDashboard";
import MenteeProjects from "./pages/dashboard/mentee/MenteeProjects";

import MentorList from "./pages/dashboard/mentee/MentorList";
import TakeTest from "./pages/dashboard/mentee/TakeTest";
import SubmitProject from "./pages/dashboard/mentee/SubmitProject";
import MenteeFeedback from "./pages/dashboard/mentee/MenteeFeedback";
import AvailableProjects from './pages/dashboard/mentee/AvailableProjects';



// Mentor Dashboard Pages
import MentorDashboard from "./pages/dashboard/mentor/MentorDashboard";
import StudentRequests from "./pages/dashboard/mentor/StudentRequests";
import TestCreator from "./pages/dashboard/mentor/TestCreator";
import ReviewSubmissions from "./pages/dashboard/mentor/ReviewSubmissions";
import MentorFeedback from "./pages/dashboard/mentor/MentorFeedback";

// Coordinator Dashboard Pages
import CoordinatorDashboard from "./pages/dashboard/coordinator/CoordinatorDashboard";
import CoordinatorProjects from "./pages/dashboard/coordinator/CoordinatorProjects";
import CoordinatorSubmissions from "./pages/dashboard/coordinator/CoordinatorSubmissions";
import CoordinatorFeedback from "./pages/dashboard/coordinator/CoordinatorFeedback";
import CoordinatorAnalytics from "./pages/dashboard/coordinator/CoordinatorAnalytics";

// New About Us Page
import AboutUs from "./pages/AboutUs";

// Utility Pages
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* For demo purposes, go directly to the mentee dashboard */}
              <Route path="/" element={<Navigate to="/dashboard/mentee" replace />} />
              
              {/* Auth Routes */}
              {/* <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} /> */}

          <Route path="/auth" element={<AuthPage />} />

              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* About Us Route */}
              <Route path="/about-us" element={<AboutUs />} />
              
              {/* Mentee Dashboard Routes - No role protection for demo */}
              <Route path="/dashboard/mentee" element={<MenteeDashboard />} />
              <Route path="/dashboard/mentee/projects" element={<MenteeProjects />} />

              <Route path="/dashboard/mentee/mentors" element={<MentorList />} />
              <Route path="/dashboard/mentee/tests" element={<TakeTest />} />
              <Route path="/dashboard/mentee/submit" element={<SubmitProject />} />
              <Route path="/dashboard/mentee/feedback" element={<MenteeFeedback />} />


              <Route path="/dashboard/mentee/AvailableProjects" element={<AvailableProjects />} />

              {/* Mentor Dashboard Routes - No role protection for demo */}
              <Route path="/dashboard/mentor" element={<MentorDashboard />} />
              <Route path="/dashboard/mentor/requests" element={<StudentRequests />} />
              <Route path="/dashboard/mentor/test-creator" element={<TestCreator />} />
              <Route path="/dashboard/mentor/submissions" element={<ReviewSubmissions />} />
              <Route path="/dashboard/mentor/feedback" element={<MentorFeedback />} />
              
              {/* Coordinator Dashboard Routes - No role protection for demo */}
              <Route path="/dashboard/coordinator" element={<CoordinatorDashboard />} />
              <Route path="/dashboard/coordinator/projects" element={<CoordinatorProjects />} />
              <Route path="/dashboard/coordinator/submissions" element={<CoordinatorSubmissions />} />
              <Route path="/dashboard/coordinator/feedback" element={<CoordinatorFeedback />} />
              <Route path="/dashboard/coordinator/analytics" element={<CoordinatorAnalytics />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
