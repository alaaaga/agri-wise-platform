
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import BookConsultation from "./pages/BookConsultation";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import LivestockService from "./pages/LivestockService";
import CropCareService from "./pages/CropCareService";
import SoilAnalysisService from "./pages/SoilAnalysisService";
import AgriTechService from "./pages/AgriTechService";
import Videos from "./pages/Videos";
import CaseStudies from "./pages/CaseStudies";
import AskUs from "./pages/AskUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/livestock" element={<LivestockService />} />
              <Route path="/services/crop-care" element={<CropCareService />} />
              <Route path="/services/soil-analysis" element={<SoilAnalysisService />} />
              <Route path="/services/agri-tech" element={<AgriTechService />} />
              <Route path="/book" element={<BookConsultation />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<Account />} />
              <Route path="/content/articles" element={<Articles />} />
              <Route path="/content/articles/:id" element={<ArticleDetail />} />
              <Route path="/content/videos" element={<Videos />} />
              <Route path="/content/case-studies" element={<CaseStudies />} />
              <Route path="/content/ask-us" element={<AskUs />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
