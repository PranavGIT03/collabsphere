import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentProfile from "@/pages/student/StudentProfile";
import ProjectListing from "@/pages/student/ProjectListing";
import ProjectDetail from "@/pages/student/ProjectDetail";
import ApplicationTracking from "@/pages/student/ApplicationTracking";
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";
import PostProject from "@/pages/faculty/PostProject";
import ManageProjects from "@/pages/faculty/ManageProjects";
import ApplicantReview from "@/pages/faculty/ApplicantReview";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import FacultyProfile from "@/pages/faculty/FacultyProfile";
import BulletinBoard from "@/pages/BulletinBoard";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} replace /> : <RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Student routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/projects" element={<ProtectedRoute><ProjectListing /></ProtectedRoute>} />
      <Route path="/student/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute><ApplicationTracking /></ProtectedRoute>} />

      {/* Faculty routes */}
      <Route path="/faculty/dashboard" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/faculty/profile" element={<ProtectedRoute><FacultyProfile /></ProtectedRoute>} />
      <Route path="/faculty/post-project" element={<ProtectedRoute><PostProject /></ProtectedRoute>} />
      <Route path="/faculty/manage-projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
      <Route path="/faculty/projects/:id/applicants" element={<ProtectedRoute><ApplicantReview /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/projects" element={<ProtectedRoute><ProjectListing /></ProtectedRoute>} />

      {/* Shared */}
      <Route path="/bulletin" element={<ProtectedRoute><BulletinBoard /></ProtectedRoute>} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
