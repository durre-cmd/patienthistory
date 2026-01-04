import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, HashRouter } from "react-router-dom"; 
import Index from "./pages/Index";
import CaseForm from "./pages/CaseForm";
import CaseView from "./pages/CaseView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Use HashRouter here. No 'basename' is needed for HashRouter on GH Pages */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/case/new" element={<CaseForm />} />
          <Route path="/case/edit/:id" element={<CaseForm />} />
          <Route path="/case/:id" element={<CaseView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;