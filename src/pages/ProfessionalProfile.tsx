import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  User,
  MapPin,
  Clock,
  Star,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Edit2,
  Bookmark,
  HistoryIcon,
  Mail,
  Phone,
  Award,
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { FeedbackHistory } from '@/components/FeedbackHistory';
import { IncidentHistory } from '@/components/IncidentHistory';

interface UserData {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'feedback' | 'incidents' | 'settings'>('bookings');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!user) {
          navigate('/login');
          return;
        }

        // Use authenticated user data
        setUserData({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url,
          phone: user.user_metadata?.phone,
          created_at: user.created_at || new Date().toISOString(),
        });
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
    { icon: CreditCard, label: 'Payment Methods', action: () => toast.info('Payment methods coming soon') },
    { icon: Bell, label: 'Notifications', action: () => toast.info('Notification settings coming soon') },
    { icon: User, label: 'Edit Profile', action: () => navigate('/edit-profile') },
  ];

  if (loading) {
    return (
      <div className="px-4 py-6 space-y-6 pb-24 md:pb-8">
        <Card className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-0 shadow-xl">
          <Skeleton className="h-32 w-full" />
        </Card>
        <Card className="p-4 space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="px-4 py-6 pb-24 md:pb-8">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900">Error Loading Profile</h4>
              <p className="text-sm text-red-700">{error}</p>
              <Button 
                size="sm" 
                className="mt-3" 
                onClick={() => navigate('/login')}
              >
                Return to Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const initials = userData.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const memberDate = new Date(userData.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="px-4 py-6 space-y-6 pb-24 md:pb-8">
      {/* Profile Header - Gradient Card */}
      <div className="space-y-4">
        <Card className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 flex-shrink-0 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-white ring-opacity-40">
                {initials}
              </div>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                <Badge className="bg-white bg-opacity-20 text-white mt-1 gap-1 border-white border-opacity-40 inline-block">
                  ⭐ Active User
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white hover:bg-opacity-20 self-end sm:self-auto flex-shrink-0"
              onClick={() => navigate('/edit-profile')}
            >
              <Edit2 className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white border-opacity-20">
            <div className="text-center">
              <Award className="w-5 h-5 mx-auto mb-1 text-white text-opacity-75" />
              <p className="text-xs text-white text-opacity-80">Member</p>
              <p className="text-sm font-bold text-white">Active</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-white text-opacity-75" />
              <p className="text-xs text-white text-opacity-80">Joined</p>
              <p className="text-sm font-bold text-white">{memberDate.split(' ')[0]}</p>
            </div>
            <div className="text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-white text-opacity-75" />
              <p className="text-xs text-white text-opacity-80">Status</p>
              <p className="text-sm font-bold text-white">Verified</p>
            </div>
          </div>
        </Card>

        {/* Contact Information Card */}
        <Card className="p-4 space-y-3 border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Email Address</p>
              <p className="font-semibold text-gray-900 truncate">{userData.email}</p>
            </div>
          </div>

          {userData.phone && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Phone Number</p>
                <p className="font-semibold text-gray-900">{userData.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Member Since</p>
              <p className="font-semibold text-gray-900">{memberDate}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-indigo-100 overflow-x-auto">
        {(['bookings', 'feedback', 'incidents', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium capitalize border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50 rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {activeTab === 'bookings' && (
          <Card className="p-8 text-center border-2 border-dashed border-indigo-200 bg-indigo-50">
            <Clock className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">No Bookings Yet</p>
            <p className="text-sm text-gray-600 mb-4">Start exploring and book your first bus journey</p>
            <Button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700">
              Browse Buses
            </Button>
          </Card>
        )}

        {activeTab === 'feedback' && (
          <FeedbackHistory />
        )}

        {activeTab === 'incidents' && (
          <IncidentHistory />
        )}

        {activeTab === 'settings' && (
          <Card className="p-6 space-y-4 border-0 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                <div>
                  <p className="font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Coming soon</p>
                </div>
                <Button size="sm" variant="outline" disabled>Toggle</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                <div>
                  <p className="font-semibold text-gray-900">Language</p>
                  <p className="text-sm text-gray-600">English</p>
                </div>
                <Button size="sm" variant="outline" disabled>Change</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                <div>
                  <p className="font-semibold text-gray-900">Two-Factor Auth</p>
                  <p className="text-sm text-gray-600">Not enabled</p>
                </div>
                <Button size="sm" variant="outline">Enable</Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Account</p>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors border border-gray-100 hover:border-indigo-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        className="w-full gap-2 h-12 text-base bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </Button>
    </div>
  );
};

export default ProfessionalProfile;


