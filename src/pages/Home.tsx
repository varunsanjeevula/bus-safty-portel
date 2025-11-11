import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, QrCode, Search, LogOut, Sparkles, AlertTriangle, TrendingUp, Shield, MapPin, Activity } from "lucide-react";
import { toast } from "sonner";
import { useBusStore } from "@/store/busStore";
import { ProfileHeader } from "@/components/ProfileHeader";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const [busId, setBusId] = useState("");
  const navigate = useNavigate();
  const { isDarkMode, themeClasses } = useTheme();
  const setCurrentBusId = useBusStore((state) => state.setCurrentBusId);

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busId.trim()) {
      toast.error("Please enter a bus ID");
      return;
    }
    setCurrentBusId(busId.trim());
    navigate(`/bus/${busId.trim()}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-4 lg:p-8`}>
      <ProfileHeader />
      
      <div className="max-w-6xl mx-auto pt-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 mb-6 shadow-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className={`text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            Safe Journey
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center gap-2 mb-8`}>
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Real-time safety monitoring and incident reporting
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className={`${themeClasses.card} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Active Buses</p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>1,247</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'} flex items-center justify-center`}>
                <Activity className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${themeClasses.card} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Routes Tracked</p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>342</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center`}>
                <MapPin className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${themeClasses.card} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Reports Today</p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>89</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-pink-900' : 'bg-pink-100'} flex items-center justify-center`}>
                <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${themeClasses.card} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Safety Score</p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>98.5%</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'} flex items-center justify-center`}>
                <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Scan Card */}
          <Card className={`border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-indigo-900' : 'bg-gradient-to-br from-white to-indigo-50'} overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className={`flex items-center gap-3 text-2xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                  <QrCode className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                Quick Scan
              </CardTitle>
              <CardDescription className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Scan the QR code on the bus to view safety information instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <Button
                onClick={() => navigate("/scanner")}
                className={`w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all`}
                size="lg"
              >
                <QrCode className="w-5 h-5 mr-3" />
                Start Scanning
              </Button>
            </CardContent>
          </Card>

          {/* Manual Entry Card */}
          <Card className={`border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-purple-900' : 'bg-gradient-to-br from-white to-purple-50'} overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className={`flex items-center gap-3 text-2xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <Search className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                Manual Entry
              </CardTitle>
              <CardDescription className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter the bus ID manually if QR code is unavailable
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleManualEntry} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="busId" className={`text-base font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bus ID</Label>
                  <Input
                    id="busId"
                    placeholder="e.g., BUS-001 or 154"
                    value={busId}
                    onChange={(e) => setBusId(e.target.value)}
                    className={`h-12 text-base border-2 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'} focus:border-purple-500 focus:ring-purple-500`}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  View Bus Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className={`border-0 ${isDarkMode ? 'bg-emerald-900' : 'bg-gradient-to-br from-emerald-50 to-teal-50'} shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-emerald-700' : 'bg-emerald-600'} flex items-center justify-center flex-shrink-0`}>
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Safety First</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time monitoring of bus safety status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 ${isDarkMode ? 'bg-blue-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'} flex items-center justify-center flex-shrink-0`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Reports</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Instant incident reporting system</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 ${isDarkMode ? 'bg-purple-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'} shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-purple-700' : 'bg-purple-600'} flex items-center justify-center flex-shrink-0`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Share feedback with other users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/privacy"
            className={`text-base ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors font-medium hover:underline`}
          >
            Privacy Policy
          </a>
          <span className={isDarkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
          <a
            href="/"
            className={`text-base ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors font-medium hover:underline`}
          >
            Terms of Service
          </a>
          <span className={isDarkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`text-base font-medium ${isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
