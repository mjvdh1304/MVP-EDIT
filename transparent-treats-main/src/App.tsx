import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDemo from "./pages/ProductDemo";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SubmitProduct from "./pages/SubmitProduct";
import Scan from "./pages/Scan";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductDemo />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/submit" element={<SubmitProduct />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
