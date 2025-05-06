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
import ClientProfile from './components/clients/ClientProfile';
import Statistics from './pages/Statistics';
import TrackingPage from './pages/TrackingPage';
import Communications from './pages/Communications';
import NotificationManagement from './pages/NotificationManagement';
import NotificationHistoryPage from './pages/NotificationHistory';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/gym" element={<GymRegistration />} />
      <Route path="/register/trainer" element={<TrainerRegistration />} />
      <Route path="/register/instructor" element={<InstructorRegistration />} />
      <Route path="/register/assistant" element={<AssistantRegistration />} />
      <Route path="/register/operator" element={<OperatorRegistration />} />
      <Route path="/register/:type" element={<GenericRegistration roleName="User" roleId="user" />} />
      <Route path="/join/:code" element={<JoinWithCode />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/dashboard/admin" element={
        <RequireAuth>
          <Layout>
            <AdminDashboard />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/dashboard/trainer" element={
        <RequireAuth>
          <Layout>
            <TrainerDashboard />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/dashboard/operator" element={
        <RequireAuth>
          <Layout>
            <OperatorDashboard />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/dashboard/assistant" element={
        <RequireAuth>
          <Layout>
            <AssistantDashboard />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/dashboard/instructor" element={
        <RequireAuth>
          <Layout>
            <InstructorDashboard />
          </Layout>
        </RequireAuth>
      } />
      
      <Route path="/settings" element={
        <RequireAuth>
          <Layout>
            <Settings />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/admin-settings" element={
        <RequireAuth>
          <Layout>
            <AdminSettings />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/trainer/:id" element={
        <RequireAuth>
          <Layout>
            <TrainerProfile />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/workout-templates" element={
        <RequireAuth>
          <Layout>
            <WorkoutTemplates />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/client-management" element={
        <RequireAuth>
          <Layout>
            <ClientManagement />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/client/:id" element={
        <RequireAuth>
          <Layout>
            <ClientProfile />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/statistics" element={
        <RequireAuth>
          <Layout>
            <Statistics />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/tracking" element={
        <RequireAuth>
          <Layout>
            <TrackingPage />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/communications" element={
        <RequireAuth>
          <Layout>
            <Communications />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/notifications" element={
        <RequireAuth>
          <Layout>
            <NotificationManagement />
          </Layout>
        </RequireAuth>
      } />
      <Route path="/notification-history" element={
        <RequireAuth>
          <Layout>
            <NotificationHistoryPage />
          </Layout>
        </RequireAuth>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
