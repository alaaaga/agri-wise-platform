
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "./pages/Index";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Videos from "./pages/Videos";
import CaseStudies from "./pages/CaseStudies";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import BookConsultation from "./pages/BookConsultation";
import AskUs from "./pages/AskUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AnimalArticles from "./pages/AnimalArticles";

// Service detail pages
import CropCareService from "./pages/CropCareService";
import SoilAnalysisService from "./pages/SoilAnalysisService";
import LivestockService from "./pages/LivestockService";
import AgriTechService from "./pages/AgriTechService";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/content/articles" element={<Articles />} />
                  <Route path="/content/articles/:id" element={<ArticleDetail />} />
                  <Route path="/content/animal" element={<AnimalArticles />} />
                  <Route path="/content/videos" element={<Videos />} />
                  <Route path="/content/case-studies" element={<CaseStudies />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/consultation" element={<BookConsultation />} />
                  <Route path="/ask-us" element={<AskUs />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  
                  {/* Legacy service routes */}
                  <Route path="/services/crop-care" element={<CropCareService />} />
                  <Route path="/services/soil-analysis" element={<SoilAnalysisService />} />
                  <Route path="/services/livestock" element={<LivestockService />} />
                  <Route path="/services/agri-tech" element={<AgriTechService />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
