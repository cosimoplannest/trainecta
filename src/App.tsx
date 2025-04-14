
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import GymRegistration from "./pages/GymRegistration";
import JoinWithCode from "./pages/JoinWithCode";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import WorkoutTemplates from "./pages/WorkoutTemplates";
import ClientManagement from "./pages/ClientManagement";
import Statistics from "./pages/Statistics";
import TrackingPage from "./pages/TrackingPage";
import Communications from "./pages/Communications";
import AdminSettings from "./pages/AdminSettings";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import ClientProfile from "./components/clients/ClientProfile";
import RequireAuth from "./components/auth/RequireAuth";
import TrainerRegistration from "./pages/registration/TrainerRegistration";
import OperatorRegistration from "./pages/registration/OperatorRegistration";
import AssistantRegistration from "./pages/registration/AssistantRegistration";
import InstructorRegistration from "./pages/registration/InstructorRegistration";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import OperatorDashboard from "./pages/dashboards/OperatorDashboard";
import TrainerDashboard from "./pages/dashboards/TrainerDashboard";
import AssistantDashboard from "./pages/dashboards/AssistantDashboard";
import InstructorDashboard from "./pages/dashboards/InstructorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gym-registration" element={<GymRegistration />} />
            <Route path="/join/:code" element={<JoinWithCode />} />
            <Route path="/login" element={<Login />} />
            
            {/* Role-specific registration routes */}
            <Route path="/trainer-registration/:gymCode" element={<TrainerRegistration />} />
            <Route path="/operator-registration/:gymCode" element={<OperatorRegistration />} />
            <Route path="/assistant-registration/:gymCode" element={<AssistantRegistration />} />
            <Route path="/instructor-registration/:gymCode" element={<InstructorRegistration />} />
            
            {/* Role-specific dashboards */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/dashboard/admin" element={
              <RequireAuth allowedRoles={['admin']}>
                <Layout><AdminDashboard /></Layout>
              </RequireAuth>
            } />
            <Route path="/dashboard/operator" element={
              <RequireAuth allowedRoles={['operator']}>
                <Layout><OperatorDashboard /></Layout>
              </RequireAuth>
            } />
            <Route path="/dashboard/trainer" element={
              <RequireAuth allowedRoles={['trainer']}>
                <Layout><TrainerDashboard /></Layout>
              </RequireAuth>
            } />
            <Route path="/dashboard/assistant" element={
              <RequireAuth allowedRoles={['assistant']}>
                <Layout><AssistantDashboard /></Layout>
              </RequireAuth>
            } />
            <Route path="/dashboard/instructor" element={
              <RequireAuth allowedRoles={['instructor']}>
                <Layout><InstructorDashboard /></Layout>
              </RequireAuth>
            } />
            
            {/* Protected routes with role-based access */}
            <Route path="/workout-templates" element={
              <RequireAuth allowedRoles={['admin', 'trainer']}>
                <Layout><WorkoutTemplates /></Layout>
              </RequireAuth>
            } />
            <Route path="/client-management" element={
              <RequireAuth allowedRoles={['admin', 'operator', 'trainer']}>
                <Layout><ClientManagement /></Layout>
              </RequireAuth>
            } />
            <Route path="/client/:id" element={
              <RequireAuth allowedRoles={['admin', 'operator', 'trainer']}>
                <Layout><ClientProfile /></Layout>
              </RequireAuth>
            } />
            <Route path="/statistics" element={
              <RequireAuth allowedRoles={['admin', 'operator']}>
                <Layout><Statistics /></Layout>
              </RequireAuth>
            } />
            <Route path="/tracking" element={
              <RequireAuth allowedRoles={['admin', 'trainer']}>
                <Layout><TrackingPage /></Layout>
              </RequireAuth>
            } />
            <Route path="/communications" element={
              <RequireAuth allowedRoles={['admin', 'operator', 'trainer']}>
                <Layout><Communications /></Layout>
              </RequireAuth>
            } />
            <Route path="/admin-settings" element={
              <RequireAuth allowedRoles={['admin']}>
                <Layout><AdminSettings /></Layout>
              </RequireAuth>
            } />
            <Route path="/settings" element={
              <RequireAuth>
                <Layout><Settings /></Layout>
              </RequireAuth>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
