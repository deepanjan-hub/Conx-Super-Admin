import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-fallback" element={<AIEngineFallback />} />
          <Route path="/config" element={<PlatformConfig />} />
          <Route path="/security" element={<Security />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/live" element={<LiveOperations />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/outbound" element={<OutboundCalling />} />
          <Route path="/widget" element={<WidgetCustomizer />} />
          <Route path="/flow-builder" element={<FlowBuilder />} />
          <Route path="/sentiment" element={<SentimentAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;