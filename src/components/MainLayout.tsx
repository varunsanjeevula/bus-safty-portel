import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Home,
  Search,
  Bell,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Settings,
  HelpCircle,
  BarChart3,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const bottomNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Bell, label: 'Updates', path: '/updates' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark bg-gradient-to-b from-slate-950 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700' : 'bg-gradient-to-r from-white via-indigo-50 to-white border-indigo-200'} border-b shadow-lg backdrop-blur-md bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg ring-2 ${isDarkMode ? 'ring-slate-700' : 'ring-indigo-200'}`}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Bus Watch Plus
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-indigo-600'} font-semibold`}>
                Real-time Tracking
              </p>
            </div>
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search buses, routes..."
                className={`w-full pl-10 pr-4 py-2 rounded-full border-2 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    : 'bg-white border-indigo-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200'
                } focus:outline-none`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Drawer Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(true)}
              className={`rounded-full ${isDarkMode ? 'text-white hover:bg-slate-800' : 'text-indigo-600 hover:bg-indigo-100'}`}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Drawer Menu */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className={`${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800' : 'bg-gradient-to-b from-white to-indigo-50 border-indigo-200'} w-80`}>
          <SheetHeader>
            <SheetTitle className={`text-2xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-8 space-y-6">
            {/* User Profile Quick Access */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  VK
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Varun Kumar
                  </p>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-indigo-600'}`}>
                    Premium Member
                  </p>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="space-y-2">
              <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-indigo-600'} px-4`}>Navigation</p>
              
              <button
                onClick={() => handleNavigation('/')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive('/')
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive('/dashboard')
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNavigation('/search')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive('/search')
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>

              <button
                onClick={() => handleNavigation('/profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive('/profile')
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile & Account</span>
              </button>
            </div>

            {/* Settings Section */}
            <div className="space-y-2">
              <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-indigo-600'} px-4`}>Settings</p>
              
              <button
                onClick={() => handleNavigation('/settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => handleNavigation('/help')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-gray-300">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isDarkMode
                    ? 'text-red-400 hover:bg-red-900/20'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'} pb-20 md:pb-0`}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav
        className={`fixed bottom-0 left-0 right-0 md:hidden ${
          isDarkMode ? 'bg-gradient-to-t from-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-t from-white to-indigo-50 border-indigo-200'
        } border-t shadow-2xl backdrop-blur-md bg-opacity-95`}
      >
        <div className="flex justify-around items-center h-20">
          {bottomNavItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-all duration-200 ${
                isActive(path)
                  ? 'scale-110'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-indigo-400'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
              aria-label={label}
            >
              <div className={`p-2 rounded-lg transition-all ${
                isActive(path)
                  ? isDarkMode
                    ? 'bg-indigo-600/30 text-indigo-400'
                    : 'bg-indigo-100 text-indigo-600'
                  : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive(path) ? 'text-indigo-600' : ''}`} />
              </div>
              <span className={`text-xs font-semibold transition-all ${
                isActive(path)
                  ? 'text-indigo-600'
                  : isDarkMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
