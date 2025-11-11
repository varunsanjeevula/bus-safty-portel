import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Navigation,
  Clock,
  Users,
  AlertCircle,
  ChevronRight,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusHistoryFeed } from '@/components/bus/BusHistoryFeed';

export const ProfessionalHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'nearby' | 'favorite' | 'recent'>('nearby');

  // Empty states - connect to real API
  const nearbyBuses: any[] = [];

  const stats = [
    { icon: TrendingUp, label: 'Active Buses', value: '—', color: 'text-green-600' },
    { icon: Users, label: 'Passengers', value: '—', color: 'text-blue-600' },
    { icon: Clock, label: 'Avg Delay', value: '—', color: 'text-yellow-600' },
    { icon: AlertCircle, label: 'Alerts', value: '—', color: 'text-red-600' },
  ];

  return (
    <div className="px-4 py-6 space-y-6 pb-24 md:pb-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Welcome back, Varun! 👋</h1>
        <p className="text-lg text-gray-600">Track buses in real-time and plan your journey</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const gradients = [
            'from-emerald-500 to-teal-600',
            'from-blue-500 to-indigo-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600'
          ];
          return (
            <Card
              key={idx}
              className={`p-5 hover:shadow-2xl transition-all cursor-pointer border-0 bg-gradient-to-br ${gradients[idx]} text-white transform hover:scale-105`}
              onClick={() => navigate('/map')}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white text-opacity-80 mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`w-6 h-6 text-white text-opacity-70`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search and Quick Actions */}
      <div className="space-y-3">
        <div className="flex gap-2 md:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search routes, stops..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white focus:bg-blue-50 transition-all shadow-sm"
              onClick={() => navigate('/search')}
            />
          </div>
          <Button
            size="icon"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl h-11 w-11 shadow-lg"
            onClick={() => navigate('/map')}
          >
            <Navigation className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-indigo-100">
        {['nearby', 'favorite', 'recent'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 font-medium capitalize border-b-2 transition-all ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50 rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nearby Buses */}
      <div className="space-y-3">
        {nearbyBuses.map((bus) => (
          <Card
            key={bus.id}
            className="p-4 hover:shadow-lg transition-all cursor-pointer border-gray-200 hover:border-blue-300"
            onClick={() => navigate(`/bus/${bus.id}`)}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    {bus.route}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-600">Arriving in {bus.arrivalTime}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      bus.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }
                  >
                    {bus.status === 'active' ? 'On Time' : 'Delayed'}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Speed */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Speed</p>
                  <p className="text-lg font-bold text-blue-700">{bus.currentSpeed} km/h</p>
                </div>

                {/* Occupancy */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Occupancy</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span className="text-lg font-bold text-purple-700">{bus.occupancy}%</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                    <span className="text-lg font-bold text-amber-700">{bus.rating}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                {bus.amenities.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700"
                  >
                    ✓ {amenity}
                  </Badge>
                ))}
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10">
                Track Bus
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Section */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900">Trending Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { route: 'Route 154', popularity: '8.2K views', color: 'from-blue-500 to-blue-600' },
            { route: 'Route 156', popularity: '6.5K views', color: 'from-purple-500 to-purple-600' },
          ].map((item, idx) => (
            <Card
              key={idx}
              className={`p-4 bg-gradient-to-br ${item.color} text-white cursor-pointer hover:shadow-lg transition-shadow`}
              onClick={() => navigate('/search')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.route}</p>
                  <p className="text-sm opacity-90">{item.popularity}</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bus History Feed Section */}
      <div className="space-y-3 pt-6 border-t border-gray-200">
        <BusHistoryFeed />
      </div>
    </div>
  );
};

export default ProfessionalHome;
