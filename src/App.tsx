
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import GymRegistration from './pages/GymRegistration';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import JoinWithCode from './pages/JoinWithCode';
import NotFound from './pages/NotFound';
import RequireAuth from './components/auth/RequireAuth';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TrainerDashboard from './pages/dashboards/TrainerDashboard';
import OperatorDashboard from './pages/dashboards/OperatorDashboard';
import AssistantDashboard from './pages/dashboards/AssistantDashboard';
import InstructorDashboard from './pages/dashboards/InstructorDashboard';
import Settings from './pages/Settings';
import AdminSettings from './pages/AdminSettings';
import TrainerRegistration from './pages/registration/TrainerRegistration';
import InstructorRegistration from './pages/registration/InstructorRegistration';
import AssistantRegistration from './pages/registration/AssistantRegistration';
import OperatorRegistration from './pages/registration/OperatorRegistration';
import GenericRegistration from './pages/registration/GenericRegistration';
import TrainerProfile from './pages/TrainerProfile';
import WorkoutTemplates from './pages/WorkoutTemplates';
import ClientManagement from './pages/ClientManagement';
import Statistics from './pages/Statistics';
import TrackingPage from './pages/TrackingPage';
import Communications from './pages/Communications';
import NotificationManagement from './pages/NotificationManagement';
import NotificationHistoryPage from './pages/NotificationHistory';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/gym" element={<GymRegistration />} />
        <Route path="/register/trainer" element={<TrainerRegistration />} />
        <Route path="/register/instructor" element={<InstructorRegistration />} />
        <Route path="/register/assistant" element={<AssistantRegistration />} />
        <Route path="/register/operator" element={<OperatorRegistration />} />
        <Route path="/register/:type" element={<GenericRegistration />} />
        <Route path="/join/:code" element={<JoinWithCode />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
            <Route path="/dashboard/operator" element={<OperatorDashboard />} />
            <Route path="/dashboard/assistant" element={<AssistantDashboard />} />
            <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/trainer-profile" element={<TrainerProfile />} />
            <Route path="/workout-templates" element={<WorkoutTemplates />} />
            <Route path="/client-management" element={<ClientManagement />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/notifications" element={<NotificationManagement />} />
            <Route path="/notification-history" element={<NotificationHistoryPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
