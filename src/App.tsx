import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { ThemeProvider } from "@/contexts/ThemeContext";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import ProfessionalHome from "./pages/ProfessionalHome";
import ProfessionalSearch from "./pages/ProfessionalSearch";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Scanner from "./pages/Scanner";
import BusDetails from "./pages/BusDetails";
import ReportIncident from "./pages/ReportIncident";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import LiveTracking from "./pages/LiveTracking";
import DistanceTrackingTest from "./pages/DistanceTrackingTest";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, session }: { children: React.ReactNode; session: Session | null }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute session={session}>
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <ProfessionalHome />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <ProfessionalSearch />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <ProfessionalProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scanner"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <Scanner />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bus/:busId"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <BusDetails />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bus/:busId/tracking"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <LiveTracking />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bus/:busId/incident"
              element={
                <ProtectedRoute session={session}>
                  <MainLayout>
                    <ReportIncident />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking-demo"
              element={
                <ProtectedRoute session={session}>
                  <DistanceTrackingTest />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
