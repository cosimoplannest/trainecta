
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Statistics from "./pages/Statistics";
import GymLoad from "./pages/GymLoad";
import GymLoadSettings from "./pages/GymLoadSettings";
import RequireAuth from "./components/auth/RequireAuth";

// Import pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClientManagement = lazy(() => import("./pages/ClientManagement"));
const WorkoutTemplates = lazy(() => import("./pages/WorkoutTemplates"));
const Communications = lazy(() => import("./pages/Communications"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const TrainerProfile = lazy(() => import("./pages/TrainerProfile"));
const ClientProfile = lazy(() => import("./components/clients/ClientProfile"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const NotificationHistory = lazy(() => import("./pages/NotificationHistory"));
const NotificationManagement = lazy(() => import("./pages/NotificationManagement"));
const Settings = lazy(() => import("./pages/Settings"));
const JoinWithCode = lazy(() => import("./pages/JoinWithCode"));
const GymRegistration = lazy(() => import("./pages/GymRegistration"));
const TrainerRegistration = lazy(() => import("./pages/registration/TrainerRegistration"));
const OperatorRegistration = lazy(() => import("./pages/registration/OperatorRegistration"));
const InstructorRegistration = lazy(() => import("./pages/registration/InstructorRegistration"));
const AssistantRegistration = lazy(() => import("./pages/registration/AssistantRegistration"));
const GenericRegistration = lazy(() => import("./pages/registration/GenericRegistration"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  console.log("App rendering at path:", window.location.pathname);
  
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Caricamento...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join/:code" element={<JoinWithCode />} />
        <Route path="/registration/gym" element={<GymRegistration />} />
        <Route path="/registration/trainer" element={<TrainerRegistration />} />
        <Route path="/registration/operator" element={<OperatorRegistration />} />
        <Route path="/registration/instructor" element={<InstructorRegistration />} />
        <Route path="/registration/assistant" element={<AssistantRegistration />} />
        <Route path="/registration/generic/:role" element={<GenericRegistration roleName="Generic" roleId="generic" />} />

        {/* Protected routes - Fixed to use Layout with Outlet */}
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/clients" element={
            <RequireAuth>
              <ClientManagement />
            </RequireAuth>
          } />
          <Route path="/client/:id" element={
            <RequireAuth>
              <ClientProfile />
            </RequireAuth>
          } />
          <Route path="/workout-templates" element={
            <RequireAuth>
              <WorkoutTemplates />
            </RequireAuth>
          } />
          <Route path="/communications" element={
            <RequireAuth>
              <Communications />
            </RequireAuth>
          } />
          <Route path="/tracking" element={
            <RequireAuth>
              <TrackingPage />
            </RequireAuth>
          } />
          <Route path="/statistics" element={
            <RequireAuth>
              <Statistics />
            </RequireAuth>
          } />
          {/* Modified: Now only admins can access Gym Load */}
          <Route path="/gym-load" element={
            <RequireAuth allowedRoles={["admin"]}>
              <GymLoad />
            </RequireAuth>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/settings" element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminSettings />
            </RequireAuth>
          } />
          <Route path="/admin/gym-load-settings" element={
            <RequireAuth allowedRoles={["admin"]}>
              <GymLoadSettings />
            </RequireAuth>
          } />
          <Route path="/admin/notifications/history" element={
            <RequireAuth allowedRoles={["admin"]}>
              <NotificationHistory />
            </RequireAuth>
          } />
          <Route path="/admin/notifications" element={
            <RequireAuth allowedRoles={["admin"]}>
              <NotificationManagement />
            </RequireAuth>
          } />

          {/* User routes */}
          <Route path="/settings" element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          } />
          <Route path="/trainer/:id" element={
            <RequireAuth>
              <TrainerProfile />
            </RequireAuth>
          } />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
