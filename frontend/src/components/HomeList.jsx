import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { Sparkles, Home as HomeIcon, Waves, Mountain, Building2, Flame } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Homes', icon: Sparkles },
  { id: 'lake', label: 'Lakefront', icon: Waves },
  { id: 'city', label: 'City Views', icon: Building2 },
  { id: 'countryside', label: 'Cabins', icon: Mountain },
  { id: 'trending', label: 'Trending', icon: Flame },
];

export default function HomeList({ 
  homes, 
  loading, 
  searchQuery, 
  onViewDetails, 
  isHost, 
  onDelete, 
  onOpenAddHome 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter homes based on category or search
  const filteredHomes = homes.filter((home) => {
    if (selectedCategory === 'lake') {
      return home.location.toLowerCase().includes('lake') || (home.houseName || '').toLowerCase().includes('cottage');
    }
    if (selectedCategory === 'city') {
      return home.location.toLowerCase().includes('downtown') || (home.houseName || '').toLowerCase().includes('apartment');
    }
    if (selectedCategory === 'countryside') {
      return (home.houseName || '').toLowerCase().includes('cottage') || (home.houseName || '').toLowerCase().includes('cabin');
    }
    if (selectedCategory === 'trending') {
      return (home.rating || 0) >= 4.7;
    }
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Category Pills Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-gray-100">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Header (Preserved from views/home.ejs) */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Available Homes
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {searchQuery ? `Showing search results for "${searchQuery}"` : 'Explore unique places to stay and unforgettable experiences'}
          </p>
        </div>

        <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          {filteredHomes.length} {filteredHomes.length === 1 ? 'Home' : 'Homes'}
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
              <div className="h-52 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
                <div className="h-10 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredHomes.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <HomeIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No homes found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {searchQuery 
              ? `We couldn't find any listings matching "${searchQuery}". Try a different location or check your spelling.`
              : 'There are currently no listings in this category.'}
          </p>
          <button
            onClick={onOpenAddHome}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-6 rounded-lg transition shadow-md"
          >
            Add Your Home
          </button>
        </div>
      )}

      {/* Homes Grid (Preserved grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6) */}
      {!loading && filteredHomes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomes.map((home) => (
            <HomeCard
              key={home._id || home.id}
              home={home}
              onViewDetails={onViewDetails}
              isHost={isHost}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

    </main>
  );
}
