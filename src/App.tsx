
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import WorkoutTemplates from "./pages/WorkoutTemplates";
import ClientManagement from "./pages/ClientManagement";
import Statistics from "./pages/Statistics";
import TrackingPage from "./pages/TrackingPage";
import Communications from "./pages/Communications";
import AdminSettings from "./pages/AdminSettings";
import Layout from "./components/Layout";
import ClientProfile from "./components/clients/ClientProfile";

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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/workout-templates" element={<Layout><WorkoutTemplates /></Layout>} />
            <Route path="/client-management" element={<Layout><ClientManagement /></Layout>} />
            <Route path="/client/:id" element={<Layout><ClientProfile /></Layout>} />
            <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
            <Route path="/tracking" element={<Layout><TrackingPage /></Layout>} />
            <Route path="/communications" element={<Layout><Communications /></Layout>} />
            <Route path="/admin-settings" element={<Layout><AdminSettings /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
