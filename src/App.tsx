import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Analytics from "./pages/Analytics";
import PlatformConfig from "./pages/PlatformConfig";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Billing from "./pages/Billing";
import Integrations from "./pages/Integrations";
import LiveOperations from "./pages/LiveOperations";
import KnowledgeBase from "./pages/KnowledgeBase";
import OutboundCalling from "./pages/OutboundCalling";
import WidgetCustomizer from "./pages/WidgetCustomizer";
import FlowBuilder from "./pages/FlowBuilder";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import AIEngineFallback from "./pages/AIEngineFallback";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/ai-fallback" element={<ProtectedRoute><AIEngineFallback /></ProtectedRoute>} />
            <Route path="/config" element={<ProtectedRoute><PlatformConfig /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
            <Route path="/live" element={<ProtectedRoute><LiveOperations /></ProtectedRoute>} />
            <Route path="/knowledge" element={<ProtectedRoute><KnowledgeBase /></ProtectedRoute>} />
            <Route path="/outbound" element={<ProtectedRoute><OutboundCalling /></ProtectedRoute>} />
            <Route path="/widget" element={<ProtectedRoute><WidgetCustomizer /></ProtectedRoute>} />
            <Route path="/flow-builder" element={<ProtectedRoute><FlowBuilder /></ProtectedRoute>} />
            <Route path="/sentiment" element={<ProtectedRoute><SentimentAnalysis /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
