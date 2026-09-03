import React, { useState } from 'react';
import { Star, MapPin, Trash2, Eye } from 'lucide-react';

export default function HomeCard({ home, onViewDetails, isHost, onDelete }) {
  const [imgError, setImgError] = useState(false);

  // Fallback image in case external links expire or are blocked
  const fallbackImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  const displayName = home.houseName || home.name || 'Airbnb Home';
  const displayPhoto = (!imgError && home.photoUrl) ? home.photoUrl : fallbackImg;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 group">
      
      {/* Image container with original hover:scale-105 transition */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={displayPhoto}
          alt={displayName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Rating Badge Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{home.rating || '4.5'}</span>
        </div>

        {/* Host action: Delete listing if logged in as host */}
        {isHost && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to remove "${displayName}"?`)) {
                onDelete(home._id || home.id);
              }
            }}
            title="Delete listing (Host option)"
            className="absolute top-3 left-3 bg-white/90 hover:bg-rose-50 text-gray-500 hover:text-rose-600 p-2 rounded-full shadow-sm transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1.5 truncate group-hover:text-rose-600 transition">
            {displayName}
          </h3>

          <p className="text-gray-600 text-sm mb-4 flex items-center gap-1.5">
            <span className="text-rose-500">📍</span>
            <span>{home.location}</span>
          </p>
        </div>

        <div>
          {/* Price Per Night */}
          <div className="text-2xl font-bold text-rose-500 mb-4 flex items-baseline gap-1">
            <span>₹{Number(home.pricePerNight).toLocaleString('en-IN')}</span>
            <span className="text-sm font-normal text-gray-500">/night</span>
          </div>

          {/* View Details Action Button (Preserved styling from views/home.ejs) */}
          <button
            onClick={() => onViewDetails(home)}
            className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>

    </div>
  );
}
