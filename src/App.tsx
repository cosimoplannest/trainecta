
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Statistics from "./pages/Statistics";
import GymLoad from "./pages/GymLoad";
import GymLoadSettings from "./pages/GymLoadSettings";

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
        <Route path="/registration/generic/:role" element={<GenericRegistration />} />

        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/client/:id" element={<ClientProfile />} />
          <Route path="/workout-templates" element={<WorkoutTemplates />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/gym-load" element={<GymLoad />} />
          
          {/* Admin routes */}
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/gym-load-settings" element={<GymLoadSettings />} />
          <Route path="/admin/notifications/history" element={<NotificationHistory />} />
          <Route path="/admin/notifications" element={<NotificationManagement />} />

          {/* User routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/trainer/:id" element={<TrainerProfile />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
