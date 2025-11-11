import { useState } from 'react';
import { Search, MapPin, Clock, DollarSign, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SearchResult {
  id: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  occupancy: number;
  rating: number;
  amenities: string[];
  type: 'express' | 'regular' | 'deluxe';
}

export const ProfessionalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  // Empty state - connect to real API
  const searchResults: SearchResult[] = [];

  const typeColors: Record<string, string> = {
    express: 'bg-blue-50 text-blue-700 border-blue-200',
    regular: 'bg-gray-50 text-gray-700 border-gray-200',
    deluxe: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const filteredResults = searchResults.filter((result) => {
    const matchesQuery =
      result.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.to.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !selectedType || result.type === selectedType;
    const matchesPrice = result.price >= priceRange[0] && result.price <= priceRange[1];

    return matchesQuery && matchesType && matchesPrice;
  });

  return (
    <div className="px-4 py-6 space-y-6 pb-24 md:pb-8">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Search Buses</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
          <input
            type="text"
            placeholder="Search routes, cities, stops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white focus:bg-blue-50 transition-all shadow-sm"
          />
        </div>

        {/* Filter and Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
          </p>

          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              <div className="mt-8 space-y-6">
                {/* Bus Type */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Bus Type</h3>
                  <div className="space-y-2">
                    {['express', 'regular', 'deluxe'].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setSelectedType(selectedType === type ? null : type)
                        }
                        className={`w-full px-4 py-2 rounded-lg border-2 text-left capitalize font-medium transition-colors ${
                          selectedType === type
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Price Range</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Amenities</h3>
                  <div className="space-y-2">
                    {['AC', 'WiFi', 'USB', 'Restroom'].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {selectedType && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2">
            {selectedType}
            <button onClick={() => setSelectedType(null)}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-3">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <Card
              key={result.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer border-gray-200 hover:border-blue-300"
            >
              <div className="space-y-3">
                {/* Route Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{result.route}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {result.from} → {result.to}
                      </span>
                    </div>
                  </div>
                  <Badge className={typeColors[result.type]}>
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </Badge>
                </div>

                {/* Journey Timeline */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Departure</p>
                      <p className="font-semibold text-gray-900">{result.departureTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Arrival</p>
                      <p className="font-semibold text-gray-900">{result.arrivalTime}</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-bold text-blue-700 text-sm mt-1">{result.duration}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Price</p>
                    <p className="font-bold text-green-700 text-sm mt-1">₹{result.price}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Rating</p>
                    <p className="font-bold text-purple-700 text-sm mt-1">⭐ {result.rating}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {result.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      ✓ {amenity}
                    </Badge>
                  ))}
                </div>

                {/* CTA */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Now
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center border-gray-200">
            <p className="text-gray-600 mb-2">No buses found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfessionalSearch;
